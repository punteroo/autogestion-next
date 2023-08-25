import { NextAuth_ProviderName } from "@/objects/next-auth.literals";
import Autogestion from "autogestion-frvm";
import type { AuthOptions } from "next-auth";
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
}

export const auth: AuthOptions = {
  callbacks: {
    async jwt({ token, user }) {
      // Assign the user to the token.
      if (user) token.user = user;

      return token;
    },
    async session({ session, token }) {
      // Assign the user to the session.
      if (token?.user) session.user = token.user;

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

        const client = new Autogestion(academicId, password);

        try {
          // Try to login.
          const { hashActual } = await client.authenticate();

          // Fetch student persona data to build an user object.
          const { persona } = await client.exams.taken.fetch();

          const {
            alumno: { especialidad },
          } = persona;

          const user: UserSession & { id: any } = {
            id: academicId,
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

const authHandler = NextAuth(auth);

export { authHandler as GET, authHandler as POST };
