"use client";

import {
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { AcademicStatusEntry } from "autogestion-frvm/types";

type AcademicStatusYearEntryDetailsProps = {
  course: AcademicStatusEntry;
};

export default function AcademicStatusYearEntryDetails({
  course,
}: AcademicStatusYearEntryDetailsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function formatPassedCourse(visual: string, grade?: string): string {
    // If no grade is provided, this is probably a regularized course (could be promoted)
    if (!grade) {
      const [original, year] = /[A|a]p\. Directa en ([0-9]{4})/g.exec(visual!)!;

      return year
        ? `Usted finalizo el cursado de esta materia en el año ${year} y ha promocionado. ¡Felicitaciones!`
        : original;
    }

    // Extract data from the string via regex.
    const [original, time, tomo, folio] =
      /Aprobada con [0-9]{1,2} \(([0-9]{1,2} hs\.)\) Tomo: ([0-9]+) Folio: ([0-9]+)/g.exec(
        visual
      )!;

    // Return the formatted string.
    return `Usted rindió esta materia en ${time} y aprobó con una nota de ${grade}. Tomo: ${tomo} Folio: ${folio}`;
  }

  function findSelectiveHours(originalString: string): string {
    // Apply custom regex to find a custom selective course hours restriction (if present).
    return "";
  }

  function splitAndExtractCourseNames(originalString: string): string[] {
    // Split the original to obtain a list.
    const list = originalString.split("\n");

    // Match with regex each course name.
    if (list.length > 0) {
      const courses = [];
      for (const item of list) {
        if (
          /^No (?:regularizó|aprobó ni está inscripto a) ([\w áóéíú]+.+)$/gm.test(
            item
          )
        ) {
          const [original, course] =
            /^No (?:regularizó|aprobó ni está inscripto a) ([\w áóéíú]+.+)$/gm.exec(
              item
            )!;

          if (course) courses.push(course);
        }
      }

      return courses;
    }

    return [];
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {course.nombreMateria} (Plan {course.plan})
              </ModalHeader>
              <ModalBody>
                {["APROBADA", "REGULARIZADA"].includes(course.estadoMateria) ? (
                  <p className="text-center">
                    {formatPassedCourse(course.estado!, course.nota)}
                  </p>
                ) : (
                  <div className="flex flex-col justify-center items-center px-2 gap-y-4">
                    <p className="text-base text-center">
                      Para cursar esta materia, debes cumplir con los siguientes
                      requisitos estipulados por tu plan academico.
                    </p>
                    <div className="w-full grid grid-cols-2 gap-x-2 max-h-[50%]">
                      {course.faltaAprobar !== null ? (
                        <Table
                          className="w-full"
                          removeWrapper
                          aria-label="Falta Aprobar"
                        >
                          <TableHeader>
                            <TableColumn>Falta de Aprobar</TableColumn>
                          </TableHeader>
                          <TableBody>
                            {splitAndExtractCourseNames(
                              course?.faltaAprobar ?? ""
                            )?.map((item) => {
                              return (
                                <TableRow key={`${item}-aprobar`}>
                                  <TableCell>
                                    <p className="text-center text-xs">
                                      {item}
                                    </p>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <h3 className="text-small text-center justify-self-center my-auto text-foreground-400">
                          Has aprobado todas las dependencias.
                        </h3>
                      )}

                      {course.faltaReg !== null ? (
                        <Table
                          className="w-full"
                          removeWrapper
                          aria-label="Falta Regularizar"
                        >
                          <TableHeader>
                            <TableColumn>Falta de Regularizar</TableColumn>
                          </TableHeader>
                          <TableBody>
                            {splitAndExtractCourseNames(
                              course?.faltaReg ?? ""
                            )?.map((item) => {
                              return (
                                <TableRow key={`${item}-reg`}>
                                  <TableCell>
                                    <p className="text-center text-xs">
                                      {item}
                                    </p>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      ) : (
                        <h3 className="text-small text-center justify-self-center my-auto text-foreground-400">
                          Has regularizado todas las dependencias.
                        </h3>
                      )}
                    </div>
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Link showAnchorIcon={true} onClick={onOpen}>
        Ver
      </Link>
    </>
  );
}
