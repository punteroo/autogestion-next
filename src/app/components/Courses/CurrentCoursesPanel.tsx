"use client";

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
  Card,
  CardHeader,
  CardBody,
  Divider,
  Link,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { StudentCourse } from "autogestion-frvm/courses";
import axios from "axios";
import CurrentCourseGrades from "./CurrentCourseGrades";
import HistoricCourses from "./HistoricCourses";

export default function TakenCoursesPanel() {
  const [loading, isLoading] = useState<boolean>(true);

  /** A list of current courses. */
  const [courses, setCourses] = useState<StudentCourse[]>([]);

  useEffect(() => {
    async function fetchCourses() {
      isLoading(true);

      try {
        const { data } = await axios<StudentCourse[]>({
          method: "GET",
          url: "/api/autogestion/courses",
          params: {
            type: "current",
          },
        });

        setCourses(data);

        isLoading(false);
      } catch (e) {
        console.error(e);
      }
    }

    fetchCourses();
  }, []);

  /**
   * Parses the provided level into a readable string.
   *
   * @param {string} level The level to parse.
   *
   * @returns {string} The parsed level.
   */
  function parseCourseLevel(level: string): string {
    try {
      const parsed = parseInt(level);
      switch (parsed) {
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
          return "Desconocido";
      }
    } catch (e) {
      return "N/A";
    }
  }

  return (
    <>
      <h1 className="hidden md:block text-3xl font-bold m-4 text-center">
        Mis Materias
      </h1>
      <div className="flex max-md:flex-col items-center md:items-start justify-center md:justify-between md:flex mx-4 gap-4">
        <h1 className="my-4 text-xl font-bold md:hidden">Mis Materias</h1>

        <Table
          isHeaderSticky
          bottomContent={loading ? null : <HistoricCourses />}
          aria-label="Materias"
        >
          <TableHeader>
            <TableColumn>Materia</TableColumn>
            <TableColumn className="hidden md:table-cell">Nivel</TableColumn>
            <TableColumn className="hidden md:table-cell">Plan</TableColumn>
            <TableColumn>Inscripto</TableColumn>
            <TableColumn>Faltas</TableColumn>
            <TableColumn>Notas</TableColumn>
          </TableHeader>
          <TableBody>
            {loading ? (
              [...Array(7)].map((_, i) => (
                <TableRow key={i} aria-label={i.toString()}>
                  <TableCell colSpan={6}>
                    <Skeleton className="w-full rounded-lg h-4" />
                  </TableCell>
                  {([...Array(5)] as any).map((_: any, i: number) => (
                    <TableCell key={i} hidden={true}>
                      haha
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : courses?.length ? (
              courses.map((course) => {
                return (
                  <TableRow
                    key={course.codigoMateria}
                    aria-label={course.codigoMateria}
                  >
                    <TableCell>
                      {course.nombreMateria} ({course.plan})
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {parseCourseLevel(course.nivel)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {course.plan}
                    </TableCell>
                    <TableCell>{course.anioCursado}</TableCell>
                    <TableCell>
                      <Popover placement="top">
                        <PopoverTrigger>
                          <Link color="primary" href="#">
                            {course.totalFaltas}
                          </Link>
                        </PopoverTrigger>
                        <PopoverContent>
                          {course.faltasInjustificadas?.length ||
                          course.faltasJustificadas?.length ? (
                            [
                              ...course.faltasInjustificadas,
                              ...course.faltasJustificadas,
                            ].map((date) => {
                              return (
                                <p
                                  key={date}
                                  className="text-sm text-foreground-500"
                                >
                                  {new Date(date).toLocaleDateString()}
                                </p>
                              );
                            })
                          ) : (
                            <p className="text-sm text-foreground-500">
                              No hay faltas registradas.
                            </p>
                          )}
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-center">
                      {course?.notas?.length ? (
                        <CurrentCourseGrades
                          name={course.nombreMateria}
                          grades={course.notas}
                        />
                      ) : (
                        <p className="text-light text-foreground-200">N/A</p>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <p className="text-center text-foreground-500">
                    Actualmente no estás cursando ninguna materia.
                  </p>
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

        <Card className="w-full md:w-[45%] lg:w-[35%]">
          <CardHeader>
            <h3 className="text-xl font-semibold">Totales</h3>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="flex justify-center gap-4 w-full">
              <div className="w-full text-center">
                <h4 className="text-md font-semibold">Faltas</h4>

                {loading && !courses?.length ? (
                  <Skeleton className="w-[15%] mx-auto my-2 rounded-lg h-4" />
                ) : (
                  <p className="text-sm font-light text-foreground-500">
                    {courses.reduce((acc, course) => {
                      return acc + course.totalFaltas;
                    }, 0)}
                  </p>
                )}
              </div>
              <div className="w-full text-center">
                <h4 className="text-md font-semibold">Materias</h4>

                {loading && !courses?.length ? (
                  <Skeleton className="w-[15%] mx-auto my-2 rounded-lg h-4" />
                ) : (
                  <p className="text-sm font-light text-foreground-500">
                    {courses.length}
                  </p>
                )}
              </div>
              <div className="w-full text-center">
                <h4 className="text-md font-semibold">Electivas</h4>
                {loading && !courses?.length ? (
                  <Skeleton className="w-[15%] mx-auto my-2 rounded-lg h-4" />
                ) : (
                  <p className="text-sm font-light text-foreground-500">
                    {
                      courses.filter((course) =>
                        /([E|e]lec\.?)/g.test(course.nombreMateria)
                      ).length
                    }
                  </p>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
