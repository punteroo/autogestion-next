"use client";

import { getSections } from "@/app/api/autogestion/client.wrapper";
import { DashboardContext } from "@/app/context/DashboardContext";
import { ClientSection } from "autogestion-frvm/client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useRef, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";
import { NexusLogo } from "../Icons/NexusLogo";
import { Button, Input } from "@nextui-org/react";
import EyeSlashFilledIcon from "../Icons/EyeSlashFilledIcon";
import EyeFilledIcon from "../Icons/EyeFilledIcon";
import GitHubLogo from "../Icons/Logos/GitHubLogo";
import { AcademicIcon } from "../Icons/AcademicIcon";
import UTNLogo from "../Icons/Logos/UTNLogo";

export default function LoginPanel({ providerName }: { providerName: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setSections } = useContext(DashboardContext);

  const router = useRouter();

  const [academicId, setAcademicId] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);

  async function submitLogin() {
    if (!academicId?.length || !password?.length)
      return toast.error("Por favor, completa todos los campos.");

    setIsLoading(true);

    toast.promise(
      // Hacky promise to make toast work correctly.
      new Promise<Array<ClientSection>>(async (resolve, reject) => {
        try {
          const result = await signIn(providerName, {
            academicId,
            password,
            redirect: false,
          });

          if (result!.error) return reject(result!.error);

          // Fetch available sections to expose them to the context.
          const sections = await getSections(academicId, password);

          resolve(sections);
        } catch (e) {
          // FIXME: Hacky method to ignore the redirect URL error from NextAuth, until fixed on the main stable release.
          if (
            (e as any).message.includes(
              "Failed to construct 'URL': Invalid base URL"
            )
          ) {
            try {
              const sections = await getSections(academicId, password);

              return resolve(sections);
            } catch (e) {
              return reject(e);
            }
          }

          console.error(e);
          return reject(e);
        }
      }),
      {
        pending: "Iniciando sesión...",
        success: {
          render: ({ data }) => {
            // Set the new sections.
            setSections(data as Array<ClientSection>);

            // Redirect in a few seconds.
            // FIXME: Should use the router instead, until NextAuth fixes this this is a temporary solution.
            setTimeout(() => (window.location.href = "/"), 1500);

            return "Gracias por iniciar sesión. Ya te redireccionamos...";
          },
        },
        error: {
          render: ({ data }: any) => {
            setIsLoading(false);

            if (data?.message) return data.message;

            return (
              (data as string) ??
              "Error desconocido. Contacta con el administrador."
            );
          },
        },
      }
    );
  }

  /** State that controls password field visibility. */
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <>
      <ToastContainer
        position="bottom-center"
        autoClose={3500}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      <div className="flex items-center justify-center">
        <div
          className="flex h-screen w-screen items-center justify-start overflow-hidden rounded-small bg-content1 p-2 sm:p-4 lg:p-8"
          style={{
            backgroundImage: "url('/login_background.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div className="absolute right-10 top-10">
            <div className="flex items-center gap-2">
              <NexusLogo />
              <p className="font-bold text-inherit">NEXUS</p>
            </div>
          </div>
          <div className="absolute bottom-10 right-10 flex flex-col items-end">
            <p className="max-w-xl text-right text-white/60">
              <span className="font-medium">“</span>Tu progreso académico,
              simplificado.
              <span className="font-medium">”</span>
            </p>
            <div className="self-end">
              <div className="flex gap-2 items-center h-8">
                <Link
                  href="https://github.com/punteroo/autogestion-next"
                  target="_blank"
                >
                  <GitHubLogo />
                </Link>
                <Link href="https://frvm.utn.edu.ar" target="_blank">
                  <UTNLogo />
                </Link>
              </div>
            </div>
          </div>
          <div className="flex w-full sm:max-w-sm flex-col gap-4 rounded-large bg-content1 px-8 pb-10 pt-6 shadow-small">
            <p className="text-2xl font-semibold">Iniciar Sesión</p>
            <div className="flex flex-col gap-3">
              <Input
                variant="bordered"
                label="Legajo"
                placeholder="123456"
                isRequired
                disabled={isLoading}
                value={academicId}
                onChange={(e) => setAcademicId(e.target.value)}
              />
              <Input
                variant="bordered"
                label="Contraseña"
                placeholder="Su contraseña"
                isRequired
                disabled={isLoading}
                type={isVisible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                  >
                    {isVisible ? (
                      <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                      <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />
            </div>
            <Button
              variant="solid"
              color="primary"
              className="w-full"
              isDisabled={isLoading}
              onClick={submitLogin}
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
