"use client";

import { createStudent } from "@/lib/actions/student.actions";
import { StudentCreateDto } from "@/lib/types/student.create.dto";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { OverServiceAdhereBody } from "./CardBody/OverServiceAdhereBody";
import { isStudentOnOverService } from "@/lib/subscription.utils";

export function OverServiceCard() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { data: session, update } = useSession();

  const terms = [
    "Por parte de Nexus, se garantiza que:",
    "1. Nexus no hará uso de tus datos académicos para ningún fin que no sea el de OverService.",
    "2. Nexus no se responsabilizará por ningún daño o perjuicio que pueda causar el uso de OverService. El servicio pretende interconectarte con otros usuarios de Nexus, por lo que requiere el almacenado externo de tu información académica.",
    "Por parte tuya como estudiante y usuario de Nexus, te comprometes a que:",
    "1. Al adherirte, estás de acuerdo con que tus datos académicos sean almacenados en un servidor externo a la institución, para uso de OverService.",
    "2. No harás uso de OverService para ningún fin que no sea los descritos dentro de cada módulo.",
    "3. No utilizaras exploits o vulnerabilidades de OverService para tu fin personal (extracción de datos de alumnos, DDoS, etcétera)",
  ];

  const [isAdhering, setIsAdhering] = useState(false);

  const [isAdhered, setIsAdhered] = useState(false);

  useEffect(() => {
    if (!session || !session?.user) return;

    if (isStudentOnOverService(session.user)) setIsAdhered(true);
  }, [session]);

  async function adhereStudent(): Promise<void> {
    if (!session || !session?.user) return;

    setIsAdhering(true);

    try {
      // Create the new student.
      const dto: StudentCreateDto = {
        name: session.user.firstName,
        lastName: session.user.lastName,
        academicId: session.user.academicId,
        dni: session.user.dni,
      };

      const student = await createStudent(dto);

      setIsAdhering(false);
      setIsAdhered(true);

      // Update the user's session to reflect their subscription.
      update({
        subscription: {
          role: student.role,
          profilePicture: student?.profilePicture,
          email: student?.email,
          phone: student?.phone,
          createdAt: student.createdAt,
        },
      });
    } catch (e) {
      setIsAdhering(false);

      console.error(e);
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>
                <h2 className="font-bold">Adhesión a OverService</h2>
              </ModalHeader>
              <ModalBody>
                {isAdhering ? (
                  <>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Adhiriendo...</h3>
                        <Spinner color="success" />
                      </div>
                      <p className="text-sm text-foreground-500">
                        Estamos adhiriendo tu cuenta a OverService, por favor
                        espera...
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="border border-foreground-200 rounded-lg p-2">
                      <h3 className="font-semibold">Términos y condiciones</h3>
                      <div className="flex flex-col gap-1">
                        {terms.map((term, i) => (
                          <p key={i} className="text-sm text-foreground-500">
                            {term}
                          </p>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground-600">
                      Si estás de acuerdo con estos términos, puedes proceder a
                      tu adhesión.
                    </p>
                  </>
                )}
              </ModalBody>
              <ModalFooter>
                <div className="flex gap-2">
                  <Button color="danger" variant="ghost" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button
                    color="success"
                    variant="flat"
                    onClick={() => {
                      adhereStudent();
                      onClose();
                    }}
                  >
                    Adherirme
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Card className="w-[40%] max-xl:w-[70%] max-lg:w-full">
        <CardHeader className="flex-col items-start">
          <Chip
            className="absolute right-2"
            variant="flat"
            color="secondary"
            size="sm"
          >
            BETA
          </Chip>
          <p className="text-tiny text-white/60 uppercase font-bold">
            Interconectando estudiantes
          </p>
          <h4 className="text-white/90 font-medium text-xl">
            Suscríbete a{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-tr from-white/40 to-white/70">
              OverService
            </span>
          </h4>
        </CardHeader>
        <CardBody className="gap-2">
          {isAdhered ? (
            <h1 className="text-center text-foreground-400">
              ¡Ya estás adherido!
            </h1>
          ) : (
            <OverServiceAdhereBody />
          )}
        </CardBody>
        {isAdhered ? null : (
          <CardFooter className="bg-black/40 border-t-1 border-default-100">
            <div className="flex flex-grow gap-2 items-center justify-between">
              <p className="text-tiny text-white/60 uppercase font-bold">
                ¿Te convencí?
              </p>
              <Button
                color="success"
                variant="bordered"
                size="sm"
                onClick={onOpen}
              >
                Quiero Participar
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </>
  );
}
