import LoginPanel from "../components/Login/LoginPanel";
import { NextAuth_ProviderName } from "@/objects/next-auth.literals";
import { auth } from "../api/auth/[...nextauth]/route";
import { redirect } from 'next/navigation';

export default async function SignIn() {
  // Is user already logged in?
  const session = await auth();

  if (session && session?.user) return redirect("/")

  return (
    <main className="min-h-screen p-8 bg-slate-700 w-full">
      <LoginPanel providerName={NextAuth_ProviderName} />
    </main>
  );
}
