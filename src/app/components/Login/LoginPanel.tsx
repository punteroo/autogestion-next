"use client";

import { getSections } from "@/app/api/autogestion/client.wrapper";
import { DashboardContext } from "@/app/context/DashboardContext";
import { Modal, ModalContent, ModalBody } from "@nextui-org/react";
import { ClientSection } from "autogestion-frvm/client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useRef, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = useState<{
    width?: number;
    height?: number;
  }>({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    // only execute all the code below in client side
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}

export default function LoginPanel({ providerName }: { providerName: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setSections } = useContext(DashboardContext);

  const router = useRouter();

  const academicId = useRef<string>();
  const password = useRef<string>();

  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Disallow non-mobile devices.
  const size = useWindowSize();
  useEffect(() => setIsMobile(size.width! < 640), [size]);

  async function submitLogin() {
    setIsLoading(true);

    toast.promise(
      // Hacky promise to make toast work correctly.
      new Promise<Array<ClientSection>>(async (resolve, reject) => {
        const result = await signIn(providerName, {
          academicId: academicId.current,
          password: password.current,
          redirect: false,
        });

        if (result!.error) reject(result!.error);
        else {
          // Fetch available sections to expose them to the context.
          const sections = await getSections(
            academicId.current!,
            password.current!
          );

          resolve(sections);
        }
      }),
      {
        pending: "Iniciando sesión...",
        success: {
          render: ({ data }) => {
            // Set the new sections.
            setSections(data as Array<ClientSection>);

            // Redirect in a few seconds.
            setTimeout(() => router.push("/"), 1500);

            return "Gracias por iniciar sesión. Ya te redireccionamos...";
          },
        },
        error: {
          render: ({ data }) => {
            setIsLoading(false);
            return (
              (data as string) ??
              "Error desconocido. Contacta con el administrador."
            );
          },
        },
      }
    );
  }

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

      {isMobile ? null : (
        <Modal
          isOpen={true}
          isDismissable={false}
          hideCloseButton
          isKeyboardDismissDisabled
          size="full"
        >
          <ModalContent className="h-full">
            <ModalBody className="text-center my-auto">
              <div className="flex flex-col my-auto gap-12">
                <h1 className="text-3xl font-bold">
                  Dispositivo No Compatible
                </h1>
                <p>
                  Esta aplicación no es compatible con dispositivos de
                  escritorio.
                </p>
                <p>
                  Por favor, ingrese a la aplicación desde un dispositivo móvil.
                </p>
              </div>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}

      <div className="bg-slate-100 rounded-xl flex-col relative w-full p-8 m-auto text-black">
        <div className="text-center p-4">
          <h1 className="font-bold">Autogestión</h1>
          <h3>Inicia con tu legajo y contraseña</h3>
        </div>

        <form
          className="w-full grid grid-cols-1 gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submitLogin();
          }}
        >
          <input
            type="text"
            className="w-full p-4 rounded-xl border-2 bg-foreground"
            name="academicId"
            placeholder="Legajo Universitario"
            onChange={(e) => (academicId.current = e.target.value)}
            disabled={isLoading}
          />
          <input
            type="password"
            className="w-full p-4 rounded-xl border-2 bg-foreground"
            name="password"
            placeholder="Contraseña"
            onChange={(e) => (password.current = e.target.value)}
            disabled={isLoading}
          />

          <div className="w-full">
            <button
              type="submit"
              onClick={() => submitLogin()}
              className="w-full p-4 rounded-xl border-2 bg-slate-700 text-white"
              disabled={isLoading}
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
        <div className="bg-slate-300 h-0.5 w-full my-4"></div>
        <div className="text-center font-light text-xs">
          <p>
            <b>Recuerda:</b> esta app no es oficial. No está afiliada a UTN FRVM
            ni nada por el estilo.
          </p>
          <br />
          <p>
            No se persisten datos de los usuarios más que redireccionarlos hacia
            el Web Service de Autogestión.
          </p>
          <br />
          <p>
            El proyecto hace uso de un wrapper no oficial de la API de
            autogestión escrito por mí en Typescript.
          </p>
          <br />
          <p>
            Por petición de la UTN FRVM, tengo prohibido distribuir tanto el
            código de este front como el wrapper de la API de Autogestión (ambos
            en Typescript).
          </p>
        </div>
        <div className="bg-slate-300 h-0.5 w-full my-4"></div>
        <div className="grid grid-cols-3 gap-y-2 text-xs font-semibold text-center w-full mx-auto">
          <Link href="https://github.com/punteroo">GitHub</Link>
          <Link href="https://github.com/punteroo">Soporte</Link>
          <Link href="https://frvm.utn.edu.ar">UTN FRVM</Link>
        </div>
      </div>
    </>
  );
}
