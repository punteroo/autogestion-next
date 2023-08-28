"use client";

import { Button, Card, Chip, Spinner } from "@nextui-org/react";
import { AcademicStatusEntry } from "autogestion-frvm/types";
import axios from "axios";
import { useEffect, useState } from "react";
import AcademicStatusYearEntry from "./AcademicStatusYearEntry";

export default function AcademicStatusPanel() {
  const [loading, isLoading] = useState<boolean>(true);
  const [failed, hasFailed] = useState<boolean>(false);

  /** Holds all academic status data for the student to check. */
  const [academicStatus, setAcademicStatus] = useState<
    Array<AcademicStatusEntry>
  >([]);

  /** An object whose keys represent each career's year. */
  const [academicStatusByYear, setAcademicStatusByYear] = useState<
    Record<string, Array<AcademicStatusEntry>>
  >({});

  useEffect(() => {
    async function fetchAcademicData() {
      hasFailed(false);
      isLoading(true);

      try {
        const { data } = await axios<AcademicStatusEntry[]>({
          method: "GET",
          url: "/api/autogestion/courses/academic",
        });

        setAcademicStatus(data);

        // Format data to classify each course by their corresponding year.
        const courseByYear: Record<
          string,
          (Omit<AcademicStatusEntry, "anioCursado"> & { anioCursado: null })[]
        > = {};
        for (const course of data) {
          if (courseByYear[course.nivel])
            courseByYear[course.nivel].push(course);
          else courseByYear[course.nivel] = [course];
        }

        setAcademicStatusByYear(courseByYear);
        isLoading(false);

        isLoading(false);
      } catch (e) {
        console.error(e);
        isLoading(false);
        hasFailed(true);
      }
    }

    if (academicStatus?.length < 1 && !failed) fetchAcademicData();
  }, [academicStatus, failed]);

  function getRandomLoadingMessage(): string {
    return [
      "Buscando tus materias...",
      "Encuestando a tus profesores...",
      "Calculando tu promedio...",
      "Lo sé, suelo tardar un poco...",
    ][Math.floor(Math.random() * 4)];
  }

  const [loadingMessage, setLoadingMessage] = useState<string>("Cargando...");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage());
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center mx-4 gap-4">
      <h1 className="my-4 text-xl font-bold">Mi Estado Académico</h1>

      <Card className="w-full flex flex-col items-center justify-center mx-4 px-2 gap-y-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-4 gap-y-4 text-center">
            <Spinner />
            <h3 className="text-sm font-semibold text-foreground-300">
              {loadingMessage}
            </h3>
          </div>
        ) : failed ? (
          <div className="flex flex-col items-center justify-center p-4 gap-y-4 text-center">
            <Chip color="danger" className="text-sm">
              ¡Oops!
            </Chip>
            <h3 className="text-sm font-semibold text-foreground-300">
              Algo falló al intentar cargar tu estado academico. Puede ser que
              actualmente el sistema de autogestion de la FRVM no este
              disponible. Si quieres, puedes intentar cargar de nuevo.
            </h3>
            <Button
              variant="flat"
              color="secondary"
              onClick={() => {
                isLoading(true);
                hasFailed(false);
              }}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          Object.keys(academicStatusByYear).map((year) => {
            return (
              <AcademicStatusYearEntry
                key={year}
                year={parseInt(year)}
                courses={academicStatusByYear[year]}
              />
            );
          })
        )}
      </Card>
    </div>
  );
}
