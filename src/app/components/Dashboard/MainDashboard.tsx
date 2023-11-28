import NavBar from "../NavBar";
import { auth } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { NexusLogo } from "../Icons/NexusLogo";
import Link from "next/link";

export default async function MainDashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session?.user) return redirect("/login");

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <div className="text-foreground">
        <NavBar />
      </div>
      <div className="w-full h-full flex grow">
        <main className="flex grow text-foreground bg-background md:mb-auto">
          <div className="w-full h-full py-4 grow">{children}</div>
        </main>
      </div>
      <footer className="bg-background">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <a
                href="https://not-autogestion.vercel.app"
                className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
              >
                <NexusLogo />
                <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                  NEXUS
                </span>
              </a>
              <p className="text-sm text-foreground-500">
                Tu progreso académico, simplificado.
              </p>
            </div>

            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium sm:mb-0 text-gray-400">
              <li>
                <Link href="/about">
                  <span className="hover:underline me-4 md:me-6">
                    Acerca de
                  </span>
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/punteroo"
                  target="_blank"
                  className="hover:underline me-4 md:me-6"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/lucassmaza"
                  target="_blank"
                  className="hover:underline me-4 md:me-6"
                >
                  Contacto
                </a>
              </li>
              <li>
                <a
                  href="https://frvm.utn.edu.ar"
                  target="_blank"
                  className="hover:underline me-4 md:me-6"
                >
                  Institución
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 sm:mx-auto border-gray-700 lg:my-8" />
          <span className="block text-sm sm:text-center text-gray-400">
            © {new Date().getFullYear()}{" "}
            <a
              href="https://not-autogestion.vercel.app/"
              className="hover:underline"
            >
              Nexus
            </a>
            . No afiliado con UTN FRVM.
          </span>
        </div>
      </footer>
    </div>
  );
}
