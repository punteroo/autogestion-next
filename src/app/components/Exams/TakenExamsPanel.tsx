"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Skeleton,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { ExamEntry } from "autogestion-frvm/exams";
import axios from "axios";

export default function TakenExamsPanel() {
  const [loading, isLoading] = useState<boolean>(true);

  /** A list of current courses. */
  const [exams, setExams] = useState<ExamEntry[]>([]);

  useEffect(() => {
    async function fetchExams() {
      isLoading(true);

      try {
        const { data } = await axios<ExamEntry[]>({
          method: "GET",
          url: "/api/autogestion/exams/historic",
        });

        // Sort exams by date.
        const sorted = data.sort((a, b) => {
          return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
        });

        setExams(sorted);

        isLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchExams();
  }, []);

  function calculateStatusColorFromGrade(grade: number): string {
    switch (grade) {
      case 10:
        return "bg-green-300 text-green-700";
      case 9:
        return "bg-green-200 text-green-600";
      case 8:
        return "bg-green-200 text-green-600";
      case 7:
        return "bg-green-100 text-green-500";
      case 6:
        return "bg-green-100 text-green-500";
      case 5:
        return "bg-yellow-200 text-yellow-600";
      case 4:
        return "bg-yellow-200 text-yellow-600";
      case 3:
        return "bg-yellow-200 text-yellow-600";
      case 2:
        return "bg-red-200 text-red-600";
      case 1:
        return "bg-red-200 text-red-600";
      case 0:
        return "bg-red-200 text-red-600";
      case -1:
      case -2:
        return "bg-gray-200 text-gray-600";
      default:
        return "bg-gray-200 text-gray-600";
    }
  }

  function mapNumberNameToNumber(numberName: string): number {
    switch (numberName) {
      case "UNO":
        return 1;
      case "DOS":
        return 2;
      case "TRES":
        return 3;
      case "CUATRO":
        return 4;
      case "CINCO":
        return 5;
      case "SEIS":
        return 6;
      case "SIETE":
        return 7;
      case "OCHO":
        return 8;
      case "NUEVE":
        return 9;
      case "DIEZ":
        return 10;
      case "AUSEN.":
        return -1;
      case "INSC.":
        return -2;
      default:
        return 0;
    }
  }

  function parseStatusName(
    status: ExamEntry["estadoAprobacion"]
  ): "APROBADO" | "DESAPROBADO" | "AUSENTE" | "INSCRIPTO" {
    switch (status) {
      case "NO_APROBADO":
        return "DESAPROBADO";
      case null:
        return "INSCRIPTO";
      default:
        return status;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mx-4 gap-4">
      <h1 className="my-4 text-xl md:text-3xl font-bold">
        Mis Exámenes Rendidos
      </h1>

      <Table isHeaderSticky aria-label="Examenes" className="md:w-[75%]">
        <TableHeader>
          <TableColumn>Materia</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Nota</TableColumn>
        </TableHeader>
        <TableBody>
          {loading ? (
            [...Array(12)].map((_, i) => (
              <TableRow key={i} aria-label={i.toString()}>
                {[...Array(3)].map((_, i) => (
                  <TableCell key={i}>
                    <Skeleton className="w-full rounded-lg h-4" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : exams?.length ? (
            exams.map((exam, i) => {
              // Obtain the exam grade.
              const grade = mapNumberNameToNumber(exam.nota.toUpperCase());

              // Also determine the status based on the grade info.
              const status = parseStatusName(exam.estadoAprobacion);

              return (
                <TableRow key={i} aria-label={i.toString()}>
                  <TableCell>
                    {exam.nombreMateria} ({exam.plan})
                  </TableCell>
                  <TableCell>
                    {new Date(exam.fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex max-sm:flex-col md:gap-unit-md justify-center md:justify-start gap-y-2 items-center my-auto">
                    {grade < 0 ? null : (
                      <Chip
                        size="sm"
                        className={calculateStatusColorFromGrade(grade)}
                      >
                        {grade ?? "-"}
                      </Chip>
                    )}
                    <Chip
                      size="sm"
                      className={`text-xs px-1.5 ${
                        status === "APROBADO"
                          ? "bg-green-200 text-green-600"
                          : status === "AUSENTE"
                          ? "bg-gray-200 text-gray-600"
                          : status === "INSCRIPTO"
                          ? "bg-orange-200 text-orange-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {status}
                    </Chip>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={3}
                className="text-center text-foreground-500"
              >
                No has rendido ningún exámen aún.
              </TableCell>
              {([...Array(5)] as any).map((_: any, i: number) => (
                <TableCell key={i} hidden={true}>
                  haha
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
