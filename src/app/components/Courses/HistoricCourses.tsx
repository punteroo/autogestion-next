"use client";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  useDisclosure,
  ModalFooter,
  Skeleton,
  TableCell,
  TableRow,
  Chip,
} from "@nextui-org/react";
import { StudentCourse } from "autogestion-frvm/courses";
import axios from "axios";
import { useState } from "react";

function HistoricCourseStatus({ course }: { course: StudentCourse }) {
  enum CourseStatus {
    CURSANDO = "0",

    LIBRE = "1",

    REGULAR = "3",

    APROBADO = "4",
  }

  const data: { styles?: string; name?: string } = {};

  switch (course.estado as string) {
    case CourseStatus.CURSANDO: {
      data.styles = "bg-yellow-200 text-yellow-600";
      data.name = "Cursando";
      break;
    }
    case CourseStatus.LIBRE: {
      data.styles = "bg-red-200 text-red-600";
      data.name = "Libre";
      break;
    }
    case CourseStatus.REGULAR: {
      data.styles = "bg-blue-200 text-blue-600";
      data.name = "Regular";
      break;
    }
    case CourseStatus.APROBADO: {
      data.styles = "bg-green-200 text-green-600";
      data.name = "Aprobada";
      break;
    }
  }

  return (
    <Chip size="sm" className={`text-xs px-1.5 ${data.styles}`}>
      {data.name}
    </Chip>
  );
}

export default function HistoricCourses() {
  const [loading, isLoading] = useState<boolean>(true);

  /** A list of historic courses, filtering out active ones. */
  const [historicCourses, setHistoricCourses] = useState<StudentCourse[]>([]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /**
   * Searches for historic courses and filters out active ones.
   *
   * @returns {StudentCourse[]} A list of historic courses.
   */
  async function fetchHistoricCourses(): Promise<StudentCourse[]> {
    isLoading(true);

    console.log(`${HistoricCourses.name}::Fetching historic courses...`);

    try {
      // Fetch historic courses.
      const { data } = await axios<StudentCourse[]>({
        method: "GET",
        url: "/api/autogestion/courses",
        params: {
          type: "historic",
        },
      });

      // Filter out those that are active currently.
      const filtered = data.filter(
        (course) => !["CURSANDO", "0"].includes(course.estado)
      );

      // Sort them by name and year.
      filtered.sort((a, b) => {
        if (+a.anioCursado > +b.anioCursado) return 1;
        if (+a.anioCursado < +b.anioCursado) return -1;
        if (a.nombreMateria > b.nombreMateria) return 1;
        if (a.nombreMateria < b.nombreMateria) return -1;
        return 0;
      });

      setHistoricCourses(filtered);
      isLoading(false);

      return filtered;
    } catch (e) {
      console.error(e);
      isLoading(false);

      return [];
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        isDismissable={false}
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Histórico de Materias
              </ModalHeader>
              <ModalBody>
                <Table isHeaderSticky aria-label="Materias">
                  <TableHeader>
                    <TableColumn>Materia</TableColumn>
                    <TableColumn>Inscripto</TableColumn>
                    <TableColumn>Estado</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {loading
                      ? [...Array(7)].map((_, i) => (
                          <TableRow key={i} aria-label={i.toString()}>
                            {[...Array(3)].map((_, i) => (
                              <TableCell key={i}>
                                <Skeleton className="w-full rounded-lg h-4" />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))
                      : historicCourses.map((course) => {
                          return (
                            <TableRow
                              key={`${course.codigoMateria}-${course.anioCursado}`}
                              aria-label={course.codigoMateria}
                            >
                              <TableCell>
                                {course.nombreMateria} ({course.plan})
                              </TableCell>
                              <TableCell>{course.anioCursado}</TableCell>
                              <TableCell className="m-auto">
                                <HistoricCourseStatus course={course} />
                              </TableCell>
                            </TableRow>
                          );
                        })}
                  </TableBody>
                </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onClick={onClose}>
                  Cerrar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button
        color="default"
        onClick={() => {
          onOpen();
          if (!historicCourses?.length) fetchHistoricCourses();
        }}
      >
        Ver Histórico
      </Button>
    </>
  );
}
