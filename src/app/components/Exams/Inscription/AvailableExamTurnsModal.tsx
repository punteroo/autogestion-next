"use client";

import {
  useDisclosure,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Spinner,
  RadioGroup,
  Radio,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import {
  AvailableExam,
  ExamEnrollResponse,
  ExamTurn,
  ExamTurnTime,
} from "autogestion-frvm/types";
import axios from "axios";
import { motion } from "framer-motion";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { SunIcon } from "../../Icons/SunIcon";
import { MoonIcon } from "../../Icons/MoonIcon";
import moment from "moment";
import "moment/locale/es";
import { CheckIcon } from "../../Icons/CheckIcon";

type AvailableExamTurnModalProps = {
  exam: AvailableExam;
  setAvailableExams: Dispatch<SetStateAction<AvailableExam[]>>;
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: () => void;
};

type ExamEntry = {
  courseId?: string;
  plan?: string;
  specialty?: string;
};

export default function AvailableExamTurnModal({
  exam,
  setAvailableExams,
  isOpen,
  onOpen,
  onOpenChange,
}: AvailableExamTurnModalProps) {
  /** State that controls if the turns are loading or not. */
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** State that holds available turns for this specific exam. */
  const [availableTurns, setAvailableTurns] = useState<Array<ExamTurn>>([]);

  /** State that holds the selected turn to enroll into. */
  const [selectedTurn, setSelectedTurn] = useState<ExamTurn | null>(null);

  /** State that controls an error message when searching turns. */
  const [turnsErrorMessage, setTurnsErrorMessage] = useState<string>("");

  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
  } = useDisclosure({ id: "confirmation" });

  const {
    isOpen: isSuccessOpen,
    onOpenChange: openSuccessChange,
    onClose: onSucessClose,
  } = useDisclosure({ id: "success" });

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

  useEffect(() => {
    async function fetchExamTurns() {
      // Map the exam entry.
      const entry: ExamEntry = {
        courseId: exam.codigoMateria,
        plan: exam.plan,
        specialty: exam.especialidad,
      };

      setIsLoading(true);
      setHasFailed(false);
      setIsEnrolling(false);
      setErrorMessage("");
      setSelectedTurn(null);
      setAvailableTurns([]);

      try {
        const { data } = await axios<ExamTurn[]>({
          method: "GET",
          url: "/api/autogestion/exams/inscription/turns",
          params: entry,
        });

        setAvailableTurns(data);
      } catch (e: any) {
        console.error(
          `Failed to search for turns for ${JSON.stringify(exam)}: ${
            e?.response?.data ? JSON.stringify(e.response.data) : e
          }`
        );

        setTurnsErrorMessage(
          e?.response?.data?.message ??
            "No hay turnos disponibles para esta materia."
        );
      }

      setIsLoading(false);
    }

    if (isOpen) fetchExamTurns();
  }, [isOpen]);

  /** State that controls if the enrollment process has started or not. */
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  /** State that controls if the enrollment process has failed or not. */
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  /** State that holds the error message returned by the enrollment process. */
  const [errorMessage, setErrorMessage] = useState<string>("");

  /** State that holds the enrollment data if successful. */
  const [enrollment, setEnrollment] = useState<ExamEnrollResponse | null>(null);

  async function enroll() {
    // Ignore null selections.
    if (!selectedTurn) return;

    // If no turn was selected, return.
    if (!selectedTurn.horarioSeleccionado)
      return alert("No se ha seleccionado un horario para el examen.");

    try {
      // Restart states.
      setIsEnrolling(true);
      setHasFailed(false);
      setErrorMessage("");
      setEnrollment(null);

      // Send the inscription request.
      const { data } = await axios<ExamEnrollResponse>({
        method: "POST",
        url: "/api/autogestion/exams/inscription",
        data: {
          exam,
          turn: selectedTurn,
          turnTime: selectedTurn.horarioSeleccionado,
        },
      });

      setIsEnrolling(false);
      setEnrollment(data);

      // Close the underlying modal.
      onOpenChange();
      onConfirmationClose();
      openSuccessChange();
    } catch (e: any) {
      // Set the error state.
      console.error(e);
      setIsEnrolling(false);
      setHasFailed(true);
      setErrorMessage(e?.response?.data?.message ?? "Desconocido");
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        backdrop="blur"
        placement="bottom-center"
        size="md"
        onOpenChange={onOpenChange}
        isDismissable={!isLoading}
        hideCloseButton={isLoading}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">
                  Turnos {exam.nombreMateriaLargo}
                </h2>
                <p className="text-foreground-500 text-sm text-center">
                  Debes seleccionar un turno específico para tu inscripción a
                  final. Recuerda:{" "}
                  <span className="text-foreground-600">
                    siempre puedes anular tu inscripción hasta antes de la fecha
                    de cierre de inscripciones a exámen final.
                  </span>
                </p>
              </ModalHeader>
              <ModalBody>
                <motion.div
                  key={+isLoading}
                  initial={{
                    opacity: 0,
                    y: -10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                >
                  {isLoading ? (
                    <div className="flex mx-auto w-max items-center gap-3">
                      <Spinner />
                      <p className="text-foreground-400 text-sm">
                        Buscando turnos disponibles...
                      </p>
                    </div>
                  ) : availableTurns.length ? (
                    <RadioGroup
                      color="primary"
                      label="Seleccione un turno"
                      onValueChange={(value) => {
                        // Search for the available turn based on its ID.
                        const turn = availableTurns.find(
                          (turn) => turn.turno === value
                        );

                        if (!turn) return;

                        // Determine the turn name.
                        const turnName = turn.habilitadoTarde
                          ? "TARDE"
                          : turn.habilitadoManana
                          ? "MANANA"
                          : "NOCHE";

                        // Set the selected turn.
                        setSelectedTurn({
                          ...turn,
                          horarioSeleccionado: turnName,
                        });
                      }}
                    >
                      {availableTurns.map((turn, i) => {
                        // Determine the turn name.
                        const turnName = turn.habilitadoTarde
                          ? "TARDE"
                          : turn.habilitadoManana
                          ? "MANANA"
                          : "NOCHE";

                        // Obtain the date the exam is going to be held.
                        const heldOn = new Date(turn.fechaExamen);

                        moment.locale("es");

                        // Create a moment instance.
                        const fromDate = moment(new Date()),
                          untilDate = moment(heldOn);

                        // Calculate the difference in days.
                        const difference = fromDate.to(untilDate);

                        return (
                          <Radio
                            key={i}
                            value={turn.turno}
                            description={`${difference} (${heldOn.toLocaleDateString(
                              "es-AR"
                            )})`}
                          >
                            <div className="flex gap-2 items-center">
                              {["MANANA", "TARDE"].includes(turnName) ? (
                                <SunIcon />
                              ) : (
                                <MoonIcon />
                              )}
                              {mapTurnToVisual(turnName)}
                            </div>
                          </Radio>
                        );
                      })}
                    </RadioGroup>
                  ) : (
                    <div className="text-center text-foreground-400 text-sm">
                      <p>
                        {turnsErrorMessage ??
                          "No hay turnos disponibles para esta materia."}
                      </p>
                      <p>
                        Si crees que esto es un error, contáctate con{" "}
                        <span className="font-semibold">
                          Secretaria de Asuntos Estudiantiles
                        </span>
                        .
                      </p>
                    </div>
                  )}
                </motion.div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="bordered"
                  onPress={onConfirmationOpen}
                  isDisabled={selectedTurn === null}
                >
                  Inscribirme
                </Button>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Volver
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isConfirmationOpen}
        onOpenChange={onConfirmationClose}
        size="lg"
        placement="top"
        backdrop="blur"
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onConfirmationClose) => {
            if (isEnrolling)
              return (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Inscribiendo a {exam.nombreMateria}
                  </ModalHeader>
                  <ModalBody>
                    <div className="flex gap-2 items-center my-4 mx-auto">
                      <Spinner />
                      <p className="text-foreground-400 text-sm">
                        Inscribiendote al turno de la materia...
                      </p>
                    </div>
                  </ModalBody>
                </>
              );

            if (hasFailed)
              return (
                <>
                  <ModalHeader className="flex flex-col gap-1">
                    Fallo en la inscripción
                  </ModalHeader>
                  <ModalBody>
                    <div className="my-4 mx-auto">
                      <p className="text-foreground-400 text-sm">
                        Hubo un error al inscribirte a la materia. Por favor,
                        intenta de nuevo más tarde.
                      </p>
                      <p className="text-foreground-400 text-sm">
                        Error:{" "}
                        {errorMessage.length ? errorMessage : "Desconocido"}
                      </p>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      variant="light"
                      onPress={onConfirmationClose}
                    >
                      Ok
                    </Button>
                  </ModalFooter>
                </>
              );

            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  Confirmar inscripción a{" "}
                  <span className="font-semibold">{exam.nombreMateria}</span>
                </ModalHeader>
                <ModalBody>
                  <p>
                    Estás por inscribirte al exámen final de la materia{" "}
                    {exam.nombreMateria} (Plan {exam.plan})
                  </p>
                  <p>
                    Tu horario de rendir será el día{" "}
                    {new Date(
                      selectedTurn?.fechaExamen ?? ""
                    ).toLocaleDateString("es-AR")}
                    . Una vez te inscribas te informaremos el horario exacto.
                  </p>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onConfirmationClose}
                  >
                    Cancelar
                  </Button>
                  <Button color="primary" onPress={enroll}>
                    Sí, inscribirme
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isSuccessOpen}
        onOpenChange={onSucessClose}
        size="lg"
        placement="top"
        backdrop="opaque"
        isDismissable={false}
        hideCloseButton={true}
      >
        <ModalContent>
          {(onSucessClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center text-green-300">
                <CheckIcon /> Inscripción exitosa
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col my-4 mx-auto text-sm gap-4">
                  <p className="text-foreground">
                    Ya te encuentras inscripto al exámen de{" "}
                    {exam.nombreMateriaLargo}. Rindes el{" "}
                    {enrollment?.dato.inscripto}.
                  </p>
                  <p className="text-foreground">
                    Tu checksum de inscripción es{" "}
                    <span className="font-semibold">
                      {enrollment?.dato.checksum}
                    </span>
                    . Puedes usar este código ante un problema con tu
                    inscripción.
                  </p>
                  <Table removeWrapper>
                    <TableHeader>
                      <TableColumn>Checksum</TableColumn>
                      <TableColumn hidden>-</TableColumn>
                      <TableColumn colSpan={2}>Horarios</TableColumn>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="w-full">
                          <div className="h-1 bg-foreground-100"></div>
                        </TableCell>
                        <TableCell className="bg-foreground-100 text-foreground-500 font-semibold text-xs rounded-l-xl">
                          Teórico
                        </TableCell>
                        <TableCell className="bg-foreground-100 text-foreground-500 font-semibold text-xs rounded-r-xl">
                          Práctico
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{enrollment?.dato.checksum}</TableCell>
                        <TableCell>{enrollment?.dato.horarioTeorico}</TableCell>
                        <TableCell>
                          {enrollment?.dato.horarioPractico}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  variant="light"
                  onPress={() => {
                    // Hacky helper function to update available exam entries after confirming the enrollment.
                    // This is to prevent an underlying state update on top-level components which would make the modal not render.
                    setAvailableExams((previous) => {
                      if (!enrollment) return previous;

                      // Search for the available exam entry and update its properties to reflect the inscription.
                      const {
                        materia: { codigoMateria },
                        dato: enrollmentInfo,
                        fecha: enrolledExam,
                      } = enrollment;

                      const previousCopy = [...previous];

                      return previousCopy.map((entry) => {
                        if (entry.codigoMateria === codigoMateria) {
                          // Extract only what's important from the turn (it's missing on the other metadata)
                          const mappedTurn: Partial<AvailableExam> = {
                            turno: enrolledExam.turno,
                            tribunal: enrolledExam.tribunal,
                            nombreTribunal: enrolledExam.nombreTribunal,
                          };

                          entry = {
                            ...entry,
                            ...enrollmentInfo,
                            ...mappedTurn,
                          };
                        }

                        return entry;
                      });
                    });

                    onSucessClose();
                  }}
                >
                  Entendido
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
