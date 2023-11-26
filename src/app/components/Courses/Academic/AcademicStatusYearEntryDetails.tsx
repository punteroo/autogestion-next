"use client";

import { AcademicEntry } from "@/types/api/academic.entry";
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

type AcademicStatusYearEntryDetailsProps = {
  course: AcademicEntry;
};

export default function AcademicStatusYearEntryDetails({
  course,
}: AcademicStatusYearEntryDetailsProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  function findSelectiveHours(originalString: string): string {
    // Apply custom regex to find a custom selective course hours restriction (if present).
    return "";
  }

  /**
   * Builds a string that represents the course's status.
   *
   * @param {AcademicEntry} entry The course entry to process.
   *
   * @returns {string} A string that represents the course's status.
   */
  function processCourseStatus(entry: AcademicEntry): string {
    // Classify course status depending on what the course has set.
    switch (entry.status) {
      case "PROMOCIONADA":
        return `Tienes promoción directa en esta materia, ¡felicitaciones!`;
      case "APROBADA":
        return `Has cursado y aprobado esta materia con una nota final promedio de ${entry.grade}.`;
      case "REGULARIZADA":
        return "Has regularizado esta materia con una nota de 6 o más. ¡Éxitos preparando tu final!";
      case "CURSANDO":
        return "Actualmente cursas esta materia.";
      case "NO_CURSADA":
        return "Aún no cursas esta materia.";
      case "LIBRE":
        return "Has quedado libre en esta materia, ¡no te desanimes!";
      default:
        return "Desconocido";
    }
  }

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {course.name} (Plan {course.plan})
              </ModalHeader>
              <ModalBody>
                {["APROBADA", "REGULARIZADA", "PROMOCIONADA"].includes(
                  course.status
                ) ? (
                  <p className="text-center">{processCourseStatus(course)}</p>
                ) : (
                  <div className="flex flex-col justify-center items-center px-2 gap-y-4">
                    <p className="text-center">{processCourseStatus(course)}</p>
                    <p className="text-base text-center">
                      Para cursar esta materia, debes cumplir con los siguientes
                      requisitos estipulados por tu plan academico.
                    </p>
                    <div className="w-full grid grid-cols-2 gap-x-2 max-h-[50%]">
                      {course.passPending?.length ? (
                        <Table
                          className="w-full"
                          removeWrapper
                          aria-label="Falta Aprobar"
                        >
                          <TableHeader>
                            <TableColumn>Falta de Aprobar</TableColumn>
                          </TableHeader>
                          <TableBody>
                            {course.passPending?.map((item) => {
                              return (
                                <TableRow key={`${item}-aprobar`}>
                                  <TableCell>
                                    <p className="text-center text-xs">
                                      {item.name}
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

                      {course.regularizePending?.length ? (
                        <Table
                          className="w-full"
                          removeWrapper
                          aria-label="Falta Regularizar"
                        >
                          <TableHeader>
                            <TableColumn>Falta de Regularizar</TableColumn>
                          </TableHeader>
                          <TableBody>
                            {course.regularizePending.map((item) => {
                              return (
                                <TableRow key={`${item}-reg`}>
                                  <TableCell>
                                    <p className="text-center text-xs">
                                      {item.name}
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

      <Link className="cursor-pointer" onClick={onOpen}>Ver</Link>
    </>
  );
}
