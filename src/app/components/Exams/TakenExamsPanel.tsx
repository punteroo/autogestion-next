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

    if (exams?.length < 1) fetchExams();
  });

  function mapNumberNameToNumber(numberName: string): number | string {
    switch (numberName) {
      case "UNO":
      case "uno":
        return 1;
      case "DOS":
      case "dos":
        return 2;
      case "TRES":
      case "tres":
        return 3;
      case "CUATRO":
      case "cuatro":
        return 4;
      case "CINCO":
      case "cinco":
        return 5;
      case "SEIS":
      case "seis":
        return 6;
      case "SIETE":
      case "siete":
        return 7;
      case "OCHO":
      case "ocho":
        return 8;
      case "NUEVE":
      case "nueve":
        return 9;
      case "DIEZ":
      case "diez":
        return 10;
      case "Ausen.":
        return "-";
      default:
        return numberName;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mx-4 gap-4">
      <h1 className="my-4 text-xl font-bold">Mis Exámenes Rendidos</h1>

      <Table isHeaderSticky aria-label="Examenes">
        <TableHeader>
          <TableColumn>Materia</TableColumn>
          <TableColumn>Fecha</TableColumn>
          <TableColumn>Nota</TableColumn>
        </TableHeader>
        <TableBody>
          {loading
            ? [...Array(12)].map((_, i) => (
                <TableRow key={i} aria-label={i.toString()}>
                  {[...Array(3)].map((_, i) => (
                    <TableCell key={i}>
                      <Skeleton className="w-full rounded-lg h-4" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : exams.map((exam, i) => (
                <TableRow key={i} aria-label={i.toString()}>
                  <TableCell>
                    {exam.nombreMateria} ({exam.plan})
                  </TableCell>
                  <TableCell>
                    {new Date(exam.fecha).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex flex-col justify-center items-center my-auto">
                    {mapNumberNameToNumber(exam.nota)}
                    <Chip
                      size="sm"
                      className={`text-xs px-1.5 ${
                        exam.estadoAprobacion === "APROBADO"
                          ? "bg-green-200 text-green-600"
                          : exam.estadoAprobacion === "AUSENTE"
                          ? "bg-gray-200 text-gray-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {exam.estadoAprobacion}
                    </Chip>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </div>
  );
}
