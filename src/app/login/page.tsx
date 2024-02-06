import LoginPanel from "../components/Login/LoginPanel";
import { NextAuth_ProviderName } from "@/objects/next-auth.literals";
import { auth } from "@/app/auth";
import { redirect } from 'next/navigation';

export default async function SignIn() {
  // Is user already logged in?
  const session = await auth();

  if (session && session?.user) return redirect("/")

  return (
    <main>
      <LoginPanel providerName={NextAuth_ProviderName} />
    </main>
  );
}
