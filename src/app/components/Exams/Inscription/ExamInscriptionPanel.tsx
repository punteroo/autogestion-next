"use client";

import { Card, CardBody, Skeleton, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { AvailableExam } from "autogestion-frvm/types";
import axios from "axios";
import FailedLoad from "../../FailedLoad";
import EnrolledExamsAccordion from "./Legacy/EnrolledExamsAccordion";
import { motion } from "framer-motion";
import AvailableExamCard from "./AvailableExamCard";

function AvailableExamEntrySkeleton({
  amount,
}: {
  amount: number;
}): JSX.Element {
  return (
    <div className="w-full flex flex-col md:mx-4 md:grid md:grid-cols-3 gap-2">
      {Array.from({ length: amount }).map((_, i) => (
        <Skeleton className="w-full" key={i}>
          <Card>
            <CardBody>
              <div className="w-full mx-4 h-7"></div>
            </CardBody>
          </Card>
        </Skeleton>
      ))}
    </div>
  );
}

const testExams = [
  {
    especialidad: "5",
    plan: "2008",
    codigoMateria: "332",
    anioMateria: "3",
    nombreMateria: "Comunicaciones",
    nombreMateriaLargo: "Comunicaciones",
    inscripto: null,
    turno: "0",
    fechaExamen: null,
    horarioTeorico: null,
    horarioPractico: null,
    tribunal: "0",
    nombreTribunal: null,
    edificio: null,
    checksum: null,
    horario: "0",
    impreso: null,
    auditoria: null,
    materia: {
      nombre: "Comunicaciones",
      codigoAcademico: "332",
    },
  },
  {
    especialidad: "5",
    plan: "2008",
    codigoMateria: "683",
    anioMateria: "3",
    nombreMateria: "Taller de Programación (Elec.)",
    nombreMateriaLargo: "Taller de Programación (Elec.)",
    inscripto: null,
    turno: "0",
    fechaExamen: null,
    horarioTeorico: null,
    horarioPractico: null,
    tribunal: "0",
    nombreTribunal: null,
    edificio: null,
    checksum: null,
    horario: "0",
    impreso: null,
    auditoria: null,
    materia: {
      nombre: "Taller de Programación (Elec.)",
      codigoAcademico: "683",
    },
  },
  {
    especialidad: "5",
    plan: "2008",
    codigoMateria: "308",
    anioMateria: "3",
    nombreMateria: "Economía",
    nombreMateriaLargo: "Economía",
    inscripto: null,
    turno: "0",
    fechaExamen: null,
    horarioTeorico: null,
    horarioPractico: null,
    tribunal: "0",
    nombreTribunal: null,
    edificio: null,
    checksum: null,
    horario: "0",
    impreso: null,
    auditoria: null,
    materia: {
      nombre: "Economía",
      codigoAcademico: "308",
    },
  },
  {
    especialidad: "5",
    plan: "2008",
    codigoMateria: "115",
    anioMateria: "2",
    nombreMateria: "Sistemas de Representación",
    nombreMateriaLargo: "Sistemas de Representación",
    inscripto: null,
    turno: "0",
    fechaExamen: null,
    horarioTeorico: null,
    horarioPractico: null,
    tribunal: "0",
    nombreTribunal: null,
    edificio: null,
    checksum: null,
    horario: "0",
    impreso: null,
    auditoria: null,
    materia: {
      nombre: "Sistemas de Representación",
      codigoAcademico: "115",
    },
  },
  {
    especialidad: "5",
    plan: "2008",
    codigoMateria: "392",
    anioMateria: "3",
    nombreMateria: "Reingeniería de Procesos de Negocios (El",
    nombreMateriaLargo: "Reingeniería de Procesos de Negocios (Elec.)",
    inscripto: null,
    turno: "0",
    fechaExamen: null,
    horarioTeorico: null,
    horarioPractico: null,
    tribunal: "0",
    nombreTribunal: null,
    edificio: null,
    checksum: null,
    horario: "0",
    impreso: null,
    auditoria: null,
    materia: {
      nombre: "Reingeniería de Procesos de Negocios (El",
      codigoAcademico: "392",
    },
  },
];

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

      /* setTimeout(() => {
        isLoading(false);
        setAvailableExams(testExams);
      }, 2500); */
    }

    if (!failed) fetchAvailableExams();
  }, [failed]);

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
      <h1 className="my-4 text-xl md:text-3xl font-bold">
        Inscribirte a Exámen Final
      </h1>

      <Card className="w-full md:w-max px-2 rounded-none md:rounded-lg">
        <CardBody className="w-full mx-0">
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >
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
                <EnrolledExamsAccordion
                  entries={getActiveInscriptions()}
                  setEntries={setAvailableExams}
                />
              )}
            </div>
          </motion.div>
        </CardBody>
      </Card>

      {!loading && !failed ? (
        availableExams?.length > 0 ? (
          <motion.div
            key={
              availableExams.filter((exam) => exam.inscripto === null).length
            }
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="w-full flex flex-col lg:w-max lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-3 px-2 p-0 m-0"
          >
            {availableExams.map((exam, i) => {
              // Only map exams that are not enrolled into.
              if (exam.inscripto === null) {
                return (
                  <AvailableExamCard
                    key={i}
                    exam={exam}
                    setAvailableExams={setAvailableExams}
                  />
                );
              }
            })}
          </motion.div>
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
