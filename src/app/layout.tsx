import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "./api/auth/[...nextauth]/route";
import NextAuth from "./components/SessionProvider";
import { NextUI } from "./providers";
import { DashboardContextProvider } from "./context/DashboardContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Autogestión FRVM",
  description: "Autogestión de alumnos de la UTN FRVM (no oficial)",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className} dark bg-background min-h-screen`}>
        <NextAuth session={session}>
          <NextUI>
            <DashboardContextProvider>
              {children}
            </DashboardContextProvider>
          </NextUI>
        </NextAuth>
      </body>
    </html>
  );
}
