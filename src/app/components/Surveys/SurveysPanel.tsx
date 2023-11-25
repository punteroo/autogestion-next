"use client";

import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { PollEntry } from "autogestion-frvm/types";
import axios from "axios";
import SurveyEntry from "./SurveyEntry";
import SurveyEntryContainer from "./SurveyEntryContainer";

/**
 * A poll entry is a poll that is available for the user to complete.
 *
 * This type sorts them between quarters.
 */
type SurveyEntryPoll = {
  [quarter: string]: Array<PollEntry>;
};

export default function SurveysPanel() {
  const [loading, isLoading] = useState<boolean>(true);

  /** Lists all available polls. */
  const [polls, setPolls] = useState<SurveyEntryPoll>({});

  /** Holds a list of completed polls. */
  const [completedPolls, setCompletedPolls] = useState<PollEntry[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    async function fetchPolls() {
      isLoading(true);

      try {
        const { data } = await axios<PollEntry[]>({
          method: "GET",
          url: "/api/autogestion/polls",
        });

        // Order polls by type and set their corresponding status.
        const polls: SurveyEntryPoll = {};

        const completed = [];
        for (const poll of data) {
          // If the poll is completed, assign it to the "completed" section and skip it.
          if (poll?.encuestaRealizada) {
            completed.push(poll);
            continue;
          }

          // Set the quarter.
          const quarter = poll?.cargoDocente?.tipoDictado?.nombre;

          if (!polls[quarter]) polls[quarter] = [poll];
          else polls[quarter].push(poll);
        }

        // Set the new polls.
        setPolls(polls);
        setCompletedPolls(completed);

        isLoading(false);
      } catch (e) {
        console.error(e);
        throw e;
      }
    }

    if (completedPolls?.length < 1 && Object.keys(polls)?.length < 1)
      fetchPolls();
  });

  return (
    <div className="flex flex-col items-center justify-center mx-4 gap-4">
      <h1 className="my-4 text-xl md:text-3xl font-bold">Encuestas Docentes</h1>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        scrollBehavior="inside"
        size="3xl"
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Encuestas Realizadas
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
                  {completedPolls?.length > 0 ? (
                    completedPolls?.map((poll, i) => {
                      return (
                        <SurveyEntry
                          key={i}
                          firstName={poll.persona.nombre}
                          lastName={poll.persona.apellido}
                          course={
                            poll.cargoDocente?.asignatura?.nombre ?? "Sin Curso"
                          }
                          role={
                            poll.cargoDocente?.tipoCargoDocente?.nombre ??
                            "Sin Rol"
                          }
                          isDone={true}
                        />
                      );
                    })
                  ) : (
                    <div className="p-4">
                      <h2 className="text-center font-semibold text-foreground-300">
                        No contestaste ninguna encuesta todavía.
                      </h2>
                    </div>
                  )}
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Card className="max-sm:w-full">
        <CardHeader>
          <Button
            className="w-full text-foreground"
            color="warning"
            isDisabled={completedPolls?.length > 0 && completedPolls === null}
            onClick={onOpen}
          >
            Ver Encuestas Realizadas
          </Button>
        </CardHeader>
      </Card>

      {Object.keys(polls)?.length > 0 ? (
        Object.keys(polls)?.map((quarter, i) => {
          return (
            <SurveyEntryContainer key={i} name={quarter}>
              {polls[quarter]?.map((poll, i) => {
                return (
                  <SurveyEntry
                    key={i}
                    firstName={poll.persona.nombre}
                    lastName={poll.persona.apellido}
                    course={poll.cargoDocente.asignatura.nombre}
                    role={poll.cargoDocente.tipoCargoDocente.nombre}
                    isDone={poll.encuestaRealizada}
                    entry={poll}
                  />
                );
              })}
            </SurveyEntryContainer>
          );
        })
      ) : loading ? (
        <Card className="max-sm:w-full">
          <CardBody>
            <div className="flex gap-x-2 items-center">
              <Spinner color="primary" />
              <h2 className="text-center font-semibold text-foreground-300">
                Cargando encuestas...
              </h2>
            </div>
          </CardBody>
        </Card>
      ) : (
        <Card className="max-sm:w-full">
          <CardBody>
            <h2 className="text-center font-semibold text-foreground-300">
              No hay encuestas disponibles.
            </h2>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
