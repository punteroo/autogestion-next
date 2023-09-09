"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Progress,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import { useEffect, useState } from "react";
import AcademicStatusYearEntry from "./AcademicStatusYearEntry";
import { AcademicEntry } from "@/types/api/academic.entry";
import { UserSession } from "@/app/api/auth/[...nextauth]/route";
import { useSession } from "next-auth/react";
import FailedLoad from "../../FailedLoad";

export default function AcademicStatusPanel() {
  const { data: session } = useSession();

  const [loading, isLoading] = useState<boolean>(true);
  const [failed, hasFailed] = useState<boolean>(false);

  /** Holds all academic status data for the student to check. */
  const [academicStatus, setAcademicStatus] = useState<Array<AcademicEntry>>(
    []
  );

  /** An object whose keys represent each career's year. */
  const [academicStatusByYear, setAcademicStatusByYear] = useState<
    Record<string, Array<AcademicEntry>>
  >({});

  useEffect(() => {
    async function fetchAcademicData() {
      hasFailed(false);
      isLoading(true);

      try {
        const { data } = await axios<AcademicEntry[]>({
          method: "GET",
          url: "/api/autogestion/courses/academic",
        });

        setAcademicStatus(data);

        // Format data to classify each course by their corresponding year.
        const courseByYear: Record<string, AcademicEntry[]> = {};
        for (const course of data) {
          if (courseByYear[course.level])
            courseByYear[course.level].push(course);
          else courseByYear[course.level] = [course];
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

  function getRandomLoadingMessage(user?: UserSession): string {
    const messages = [
      "Buscando tus materias...",
      "Encuestando a tus profesores...",
      "Calculando tu promedio...",
      "Lo sé, suelo tardar un poco...",
      `SELECT * FROM materias WHERE alumno = '${user?.firstName}';`,
      "Mirando tus notas parecería que no estudiaste mucho...",
      "Veo notas lindas, ¿estás estudiando?",
    ];

    return messages[Math.floor(Math.random() * messages.length)];
  }

  /**
   * Calculates the average grade of all courses that have been passed by the student (currently).
   *
   * @param {AcademicEntry[]} courses The courses to calculate the average grade from.
   *
   * @returns {number} The average grade of all courses that have been passed by the student (currently).
   */
  function calculateAverageGrade(courses: AcademicEntry[]): number {
    let total = 0,
      count = 0;

    for (const course of courses) {
      if (course.status === "APROBADA") {
        total += course.grade;
        count++;
      }
    }

    return total / count;
  }

  function filterCoursesByStatus(
    status: Array<AcademicEntry["status"]>
  ): Array<AcademicEntry> {
    return academicStatus.filter((course) => status.includes(course.status));
  }

  const [loadingMessage, setLoadingMessage] = useState<string>("Cargando...");

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingMessage(getRandomLoadingMessage(session?.user));
      }, 2500);

      return () => clearInterval(interval);
    }
  }, [loading]);

  return (
    <div className="flex flex-col items-center justify-center mx-2 gap-4">
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
          <FailedLoad
            message="Algo falló al intentar cargar tu estado academico. Puede ser que actualmente el sistema de autogestion de la FRVM no este disponible. Si quieres, puedes intentar cargar de nuevo."
            stateChanges={{ isLoading, hasFailed }}
          />
        ) : (
          <>
            <Card className="mt-4">
              <CardHeader>
                <h1 className="text-center text-base font-bold">
                  Estadísticas
                </h1>
              </CardHeader>
              <Divider />
              <CardBody>
                <div className="flex justify-center gap-4 w-full">
                  <div className="w-full text-center">
                    <h4 className="text-md font-semibold">Promedio</h4>
                    <p className="text-sm font-light text-foreground-500">
                      {calculateAverageGrade(academicStatus).toFixed(2)}
                    </p>
                  </div>
                  <div className="w-full text-center">
                    <h4 className="text-md font-semibold">Aprobadas</h4>
                    <p className="text-sm font-light text-foreground-500">
                      {
                        filterCoursesByStatus(["APROBADA", "PROMOCIONADA"])
                          .length
                      }
                    </p>
                  </div>
                  <div className="w-full text-center">
                    <h4 className="text-md font-semibold">Totales</h4>
                    <p className="text-sm font-light text-foreground-500">
                      {academicStatus.length}
                    </p>
                  </div>
                </div>
                <div className="w-full py-4">
                  <Progress
                    color="success"
                    label="Progreso de Carrera"
                    showValueLabel
                    maxValue={100}
                    isStriped
                    value={
                      (filterCoursesByStatus(["APROBADA", "PROMOCIONADA"])
                        .length /
                        academicStatus.length) *
                      100
                    }
                  />
                </div>
              </CardBody>
            </Card>

            {Object.keys(academicStatusByYear).map((year) => {
              return (
                <AcademicStatusYearEntry
                  key={year}
                  year={parseInt(year)}
                  courses={academicStatusByYear[year]}
                />
              );
            })}
          </>
        )}
      </Card>
    </div>
  );
}
