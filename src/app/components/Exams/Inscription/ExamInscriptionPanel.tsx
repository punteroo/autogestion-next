"use client";

import { Card, CardBody, Skeleton, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import AvailableExamsAccordion from "./AvailableExamsAccordion";
import { AvailableExam } from "autogestion-frvm/types";
import axios from "axios";
import FailedLoad from "../../FailedLoad";
import EnrolledExamsAccordion from "./EnrolledExamsAccordion";

function AvailableExamEntrySkeleton({
  amount,
}: {
  amount: number;
}): JSX.Element {
  return (
    <>
      {Array.from({ length: amount }).map((_, i) => (
        <Skeleton className="w-full" key={i}>
          <Card>
            <CardBody>
              <div className="w-full mx-4 h-7"></div>
            </CardBody>
          </Card>
        </Skeleton>
      ))}
    </>
  );
}

export default function ExamInscriptionPanel() {
  const [loading, isLoading] = useState<boolean>(true);

  const [failed, hasFailed] = useState<boolean>(false);

  /** A list of available exams for inscription. */
  const [availableExams, setAvailableExams] = useState<AvailableExam[]>([]);

  useEffect(() => {
    async function fetchAvailableExams() {
      isLoading(true);
      hasFailed(false);

      try {
        const { data } = await axios<AvailableExam[]>({
          method: "GET",
          url: "/api/autogestion/exams/inscription",
        });

        setAvailableExams(data);

        isLoading(false);
      } catch (e) {
        console.error(e);
        isLoading(false);
        hasFailed(true);
      }
    }

    if (!failed && availableExams?.length < 1) fetchAvailableExams();
  }, [availableExams]);

  /**
   * Fetches from the list of available exams those that have an active inscription.
   *
   * @returns {AvailableExam[]} A list of available exams with an active inscription.
   */
  function getActiveInscriptions(): AvailableExam[] {
    return availableExams.filter((exam) => exam.inscripto !== null);
  }

  return (
    <div className="flex flex-col items-center justify-center gap-y-4">
      <h1 className="my-4 text-xl font-bold">Inscribirte a Exámen Final</h1>

      <Card className="w-full px-2 rounded-none">
        <CardBody className="w-full mx-0">
          <div className="flex flex-col w-full">
            {loading ? (
              <>
                <div className="flex flex-col gap-y-3">
                  <Spinner />
                  <p className="text-foreground-400 text-sm text-center my-auto">
                    Cargando exámenes disponibles...
                  </p>
                </div>
              </>
            ) : failed ? (
              <FailedLoad
                message="No se pudo obtener la lista de exámenes disponibles. Puedes reintentar la carga si crees que es un error."
                stateChanges={{ isLoading, hasFailed }}
              />
            ) : (
              <EnrolledExamsAccordion entries={getActiveInscriptions()} setEntries={setAvailableExams} />
            )}
          </div>
        </CardBody>
      </Card>

      {!loading && !failed ? (
        availableExams?.length > 0 ? (
          <div className="w-full p-0 m-0">
            <AvailableExamsAccordion
              entries={availableExams}
              setEntries={setAvailableExams}
            />
          </div>
        ) : (
          <p className="text-foreground-400 text-sm text-center">
            No hay exámenes disponibles para inscribirte.
          </p>
        )
      ) : (
        <AvailableExamEntrySkeleton amount={6} />
      )}
    </div>
  );
}
