"use client";

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import Link from "next/link";
import { PowerIcon } from "./Icons/PowerIcon";
import { signOut } from "next-auth/react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.min.css";

export default function NavBarLogOut() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        as={Link}
        color="danger"
        href="#"
        variant="flat"
        startContent={<PowerIcon />}
        onClick={onOpen}
      >
        Salir
      </Button>

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

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement={"top"}
        backdrop={"blur"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Estás por cerrar tu sesión.
              </ModalHeader>
              <ModalBody>
                <p>
                  Si cierras sesión deberás volver a introducir tus credenciales
                  para acceder de nuevo.
                </p>
                <p>
                  Recuerda que tu sesión persiste por mucho tiempo. ¿Estás
                  seguro de querer cerrar tu sesión?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onClick={onClose}>
                  No gracias
                </Button>
                <Button
                  color="danger"
                  onClick={() => {
                    onClose();
                    toast.promise(signOut({ redirect: true }), {
                      pending: "Cerrando sesión...",
                    });
                  }}
                >
                  Si, cerrar sesión
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
