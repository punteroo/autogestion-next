import NavBar from "../NavBar";
import { auth } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { NexusLogo } from "../Icons/NexusLogo";

export default async function MainDashboard({
  children,
}: {
  children?: React.ReactNode;
}) {
  const session = await auth();

  if (!session || !session?.user) return redirect("/login");

  return (
    <div className="h-screen flex flex-col">
      <main className="dark text-foreground bg-background md:mb-auto">
        <NavBar />
        <div className="w-full h-full py-4">{children}</div>
      </main>
      <footer className="hidden md:block rounded-lg shadow bg-content1 m-4 bottom-0">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div>
              <a
                href="https://not-autogestion.vercel.app"
                className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
              >
                <NexusLogo />
                <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                  NEXUS
                </span>
              </a>
              <p className="text-sm text-foreground-500">
                Tu progreso académico, simplificado.
              </p>
            </div>

            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
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
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
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
