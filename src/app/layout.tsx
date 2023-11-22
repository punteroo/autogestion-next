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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className={`${inter.className} dark bg-background min-h-screen`}>
        <NextAuth session={session}>
          <NextUI>
            <DashboardContextProvider>{children}</DashboardContextProvider>
          </NextUI>
        </NextAuth>
        <script
          dangerouslySetInnerHTML={{
            __html: `document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
            // special hack to prevent zoom-to-tabs gesture in safari
            document.body.style.zoom = 0.99;
        });
        
        document.addEventListener('gesturechange', function(e) {
            e.preventDefault();
            // special hack to prevent zoom-to-tabs gesture in safari
            document.body.style.zoom = 0.99;
        });
        
        document.addEventListener('gestureend', function(e) {
            e.preventDefault();
            // special hack to prevent zoom-to-tabs gesture in safari
            document.body.style.zoom = 0.99;
        });`,
          }}
        ></script>
      </body>
    </html>
  );
}
