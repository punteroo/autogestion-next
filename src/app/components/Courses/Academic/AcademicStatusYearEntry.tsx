"use client";

import {
  Card,
  CardHeader,
  CardBody,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableRow,
  TableCell,
  Chip,
} from "@nextui-org/react";
import { AcademicStatusEntry } from "autogestion-frvm/types";
import AcademicStatusYearEntryDetails from "./AcademicStatusYearEntryDetails";
import { AcademicEntry } from "@/types/api/academic.entry";

type AcademicStatusYearEntryProps = {
  year: number;
  courses: AcademicEntry[];
};

export default function AcademicStatusYearEntry({
  year,
  courses,
}: AcademicStatusYearEntryProps) {
  function mapYearNumberToString(year: number): string {
    switch (year) {
      case 1:
        return "1er Año";
      case 2:
        return "2do Año";
      case 3:
        return "3er Año";
      case 4:
        return "4to Año";
      case 5:
        return "5to Año";
      default:
        return "Año Desconocido";
    }
  }

  function processCourseStatus(
    status: AcademicEntry["status"],
    grade?: number
  ): React.ReactNode {
    // Classify course status depending on what the course has set.
    switch (status) {
      case "APROBADA":
        return (
          <Chip
            size="sm"
            className="text-xs px-1.5 bg-green-200 text-green-600"
          >
            Aprobada
          </Chip>
        );
      case "CURSANDO":
        return (
          <Chip
            size="sm"
            className="text-xs px-1.5 bg-yellow-200 text-yellow-600"
          >
            Cursando
          </Chip>
        );
      case "LIBRE":
        return (
          <Chip size="sm" className="text-xs px-1.5 bg-red-200 text-red-600">
            Libre
          </Chip>
        );
      case "PROMOCIONADA": {
        return (
          <Chip
            size="sm"
            className="text-xs px-1.5 bg-green-400 text-green-800"
          >
            Promocionada
          </Chip>
        );
      }
      case "REGULARIZADA": {
        return (
          <Chip size="sm" className="text-xs px-1.5 bg-blue-400 text-blue-800">
            Regular
          </Chip>
        );
      }
      case "NO_CURSADA":
        return (
          <Chip size="sm" className="text-xs px-1.5 bg-gray-200 text-gray-600">
            Pendiente
          </Chip>
        );
      default:
        return (
          <Chip size="sm" className="text-xs px-1.5 bg-gray-200 text-gray-600">
            Desconocido
          </Chip>
        );
    }
  }

  return (
    <Card className="w-full my-4">
      <CardHeader className="w-full mx-auto">
        <h1 className="text-center text-base font-bold">
          {mapYearNumberToString(year)}
        </h1>
      </CardHeader>
      <CardBody className="p-2">
        <Table isHeaderSticky removeWrapper aria-label="Estado Academico">
          <TableHeader>
            <TableColumn>Materia</TableColumn>
            <TableColumn>Estado</TableColumn>
            <TableColumn>Detalles</TableColumn>
          </TableHeader>
          <TableBody>
            {courses.map((course) => (
              <TableRow key={course.name}>
                <TableCell>
                  {course.name} ({course.plan})
                </TableCell>
                <TableCell className="break-keep">
                  {processCourseStatus(course.status, course.grade)}
                </TableCell>
                <TableCell className="text-center">
                  {course.status === "CURSANDO" ? (
                    <p className="text-foreground-400 cursor-not-allowed">N/A</p>
                  ) : (
                    <AcademicStatusYearEntryDetails course={course} />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}
