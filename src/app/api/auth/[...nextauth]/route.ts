import { fetchStudent } from "@/lib/actions/student.actions";
import { StudentRole } from "@/lib/objects/student.roles";
import { NextAuth_ProviderName } from "@/objects/next-auth.literals";
import Autogestion from "autogestion-frvm";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface UserSession {
  academicId: number;
  firstName: string;
  lastName: string;
  dni: number;
  hash: string;
  career: {
    id: number;
    code: number;
    name: string;
  };
  subscription?: {
    role: StudentRole;
    profilePicture?: string;
    email?: string;
    phone?: string;
    createdAt: string;
  };
}

export const authOptions: NextAuthConfig = {
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update")
        // Update the user's subscription data.
        token["subscription"] = session.subscription;

      // Assign the user to the token.
      if (user) token = { ...token, ...user };

      return token;
    },
    async session({ session, token }) {
      // Assign the user to the session.
      if (token) session.user = token as any;

      return session;
    },
  },
  providers: [
    CredentialsProvider({
      id: NextAuth_ProviderName,
      name: "Autogestion Alumnos",
      credentials: {
        academicId: { label: "Legajo", type: "text", placeholder: "Legajo" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Deny empty login requests.
        if (!credentials?.academicId || !credentials?.password) return null;

        // Authenticate the user with the Autogestion client.
        const { academicId, password } = credentials;

        const client = new Autogestion(
          academicId as string,
          password as string
        );

        try {
          // Try to login.
          const { hashActual } = await client.authenticate();

          // Fetch student persona data to build an user object.
          const { persona } = await client.exams.taken.fetch();

          const {
            alumno: { especialidad },
          } = persona;

          const user: UserSession & { id: string } = {
            id: academicId as string,
            academicId: +academicId,
            firstName: persona.nombre,
            lastName: persona.apellido,
            dni: persona.documento,
            hash: hashActual,
            career: {
              id: especialidad.id,
              code: +especialidad.codigoAcademico,
              name: especialidad.nombre,
            },
          };

          // Obtain subscription data, if the user is subscribed.
          const student = await fetchStudent(+academicId);

          if (student)
            // Attach subscription data to the user.
            user["subscription"] = {
              role: student.role,
              profilePicture: student?.profilePicture,
              email: student?.email,
              phone: student?.phone,
              createdAt: student.createdAt!.toISOString(),
            };

          // Return the user session.
          return user;
        } catch (e: any) {
          console.error(
            `${CredentialsProvider.name}::Failed to authorize login for ${academicId}: ${e}`
          );

          throw e;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    signOut: "/login",
    error: "/login",
  },
};

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth(authOptions);
