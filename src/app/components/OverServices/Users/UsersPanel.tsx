"use client";

import {
  getStudentsCount,
  searchStudents,
} from "@/lib/actions/student.actions";
import { Student } from "@/lib/models/student.model";
import {
  Card,
  CardBody,
  Pagination,
  Select,
  SelectItem,
  Spinner,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";
import { QuestionMarkIcon } from "../../Icons/QuestionMarkIcon";

export function UsersPanel() {
  /** States that control pagination properties. */
  /** Controls the current page the user is in. */
  const [page, setPage] = useState<number>(1);

  /** Controls how many students to fetch per call. */
  const [limit, setLimit] = useState<number>(100);

  /** Controls how many students are displayed on a single page. */
  const [perPage, setPerPage] = useState<number>(7);

  /** A list of students for the current page. */
  const [students, setStudents] = useState<Array<Partial<Student>>>([]);

  /** The total amount of students. */
  const [totalStudents, setTotalStudents] = useState<number>(0);

  /** Indicator for loading results. */
  const [loading, setLoading] = useState<boolean>(true);

  async function searchOverServiceStudents(page: number, limit: number) {
    setLoading(true);

    // Call for a list of all students on OverService based on criteria.
    const students = await searchStudents(
      undefined,
      limit,
      (page - 1) * perPage
    );

    // Set the students list to the state.
    setStudents(students);

    // Remove the loading state.
    setLoading(false);
  }

  /** Obtain the total amount of registered students at the start. */
  useEffect(() => {
    const obtainStudentCount = async () => {
      const count = await getStudentsCount();

      setTotalStudents(count ?? 0);
    };

    obtainStudentCount();
  }, []);

  /** Search again after any modifications are made to the page or the limit. */
  useEffect(() => {
    searchOverServiceStudents(page, limit);
  }, [page, limit]);

  return (
    <>
      <h1 className="hidden md:block text-3xl font-bold m-4 text-center">
        Índice de Usuarios
      </h1>
      <div className="flex max-md:flex-col items-center md:items-start justify-center md:justify-between md:flex mx-4 gap-4">
        <h1 className="my-4 text-xl font-bold md:hidden">Índice de Usuarios</h1>
        <Card className="w-full">
          <CardBody>
            <div className="flex flex-col gap-4">
              <div className="max-h-6xl">
                {loading ? (
                  <div className="flex flex-col gap-1 items-center w-full">
                    <Spinner />
                    <p className="text-foreground-400">Cargando usuarios...</p>
                  </div>
                ) : students?.length ? (
                  <div className="max-md:flex max-md:flex-col md:grid md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2">
                    {students.slice(0, perPage).map((student) => (
                      <UserCard user={student} key={student.academicId} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 items-center text-foreground-400">
                    <QuestionMarkIcon />
                    <p>No hay nadie aquí aún...</p>
                  </div>
                )}
              </div>
              {students?.length ? (
                <div className="w-full flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <Pagination
                      initialPage={1}
                      page={page}
                      total={Math.ceil(totalStudents / perPage)}
                      variant="light"
                      onChange={setPage}
                    />
                    <p className="text-sm text-foreground-300">
                      {totalStudents} alumnos
                    </p>
                  </div>
                  <div className="flex justify-between items-center gap-4">
                    <p className="text-sm text-foreground-300">
                      Mostrando {perPage} alumnos por página
                    </p>
                    <Select
                      className="w-lg"
                      size="sm"
                      radius="md"
                      onSelectionChange={(e) => {
                        const selection = (e as Set<any>).values().next().value;

                        // No selection? Use default.
                        if (!selection) return setPerPage(7);

                        const value = parseInt(selection);

                        // Is the value lower than the one set before? If so return to the 1st page.
                        if (value < perPage) setPage(1);

                        // Set the new perPage value.
                        setPerPage(value);
                      }}
                      selectedKeys={[`${perPage}`]}
                      value={perPage}
                    >
                      <SelectItem key={7} value={7}>
                        7
                      </SelectItem>
                      <SelectItem key={15} value={15}>
                        15
                      </SelectItem>
                      <SelectItem key={30} value={30}>
                        30
                      </SelectItem>
                      <SelectItem key={50} value={50}>
                        50
                      </SelectItem>
                    </Select>
                  </div>
                </div>
              ) : null}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
