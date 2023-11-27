"use client";

import {
  Button,
  Card,
  CardBody,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { AvailableExam, ExamTurn, ExamTurnTime } from "autogestion-frvm/types";

type AvailableExamTurnEntriesProps = {
  turns: Array<ExamTurn>;
  isLoading: boolean;
  errorMessage: string;
  exam: AvailableExam;
  enrollFunction: (exam: AvailableExam, turn: ExamTurn) => Promise<void>;
};

export default function AvailableExamTurnEntries({
  turns,
  isLoading,
  errorMessage,
  exam,
  enrollFunction,
}: AvailableExamTurnEntriesProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function mapTurnToVisual(turnName: ExamTurnTime): string {
    switch (turnName) {
      case "NOCHE":
        return "Turno Nocturno";
      case "MANANA":
        return "Turno Matutino";
      case "TARDE":
        return "Turno Vespertino";
      default:
        return "Turno Desconocido";
    }
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : turns?.length ? (
        turns.map((turn, i) => (
          <>
            <Card key={`${turn.turno}-${i}`}>
              <CardBody className="grid grid-cols-2 gap-x-3">
                <div className="flex flex-col">
                  <p className="text-md">
                    {mapTurnToVisual(
                      turn.habilitadoTarde
                        ? "TARDE"
                        : turn.habilitadoManana
                        ? "MANANA"
                        : "NOCHE"
                    )}
                  </p>
                  <p className="text-small text-default-500">
                    {new Date(turn.fechaExamen).toLocaleDateString("es-AR")}
                  </p>
                </div>
                <div className="flex flex-col justify-self-center">
                  <Button
                    color="success"
                    disabled={isLoading}
                    onClick={() => {
                      onOpen();
                    }}
                  >
                    Inscribirme
                  </Button>
                </div>
              </CardBody>
            </Card>
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
                      Confirma tu inscripción a{" "}
                      <span className="font-bold">{exam.nombreMateria}</span>
                    </ModalHeader>
                    <ModalBody>
                      <p>
                        Estás por inscribirte al exámen final de la materia{" "}
                        {exam.nombreMateria} ({exam.plan})
                      </p>
                      <p>
                        Tu horario de rendir será el día{" "}
                        {new Date(turn.fechaExamen).toLocaleDateString("es-AR")}
                        . Una vez te inscribas te informaremos el horario
                        exacto.
                      </p>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onClick={onClose}>
                        Cancelar
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          onClose();
                          enrollFunction(exam, {
                            ...turn,
                            horarioSeleccionado: turn.habilitadoTarde
                              ? "TARDE"
                              : turn.habilitadoManana
                              ? "MANANA"
                              : "NOCHE",
                          });
                        }}
                      >
                        Sí, inscribirme
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </>
        ))
      ) : (
        <p className="text-center text-foreground-400">
          {errorMessage?.length ? (
            errorMessage
          ) : (
            <>
              No existen turnos para este exámen. Puedes contactar a{" "}
              <Link href="tel:+543534537500">SAE</Link> para más información.
            </>
          )}
        </p>
      )}
    </>
  );
}
