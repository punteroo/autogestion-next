"use client";

import { searchStudents } from "@/lib/actions/student.actions";
import { Student } from "@/lib/models/student.model";
import { Card, CardBody, Pagination, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { UserCard } from "./UserCard";

export function UsersPanel() {
  /** States that control pagination properties. */
  /** Controls the current page the user is in. */
  const [page, setPage] = useState<number>(1);

  /** Controls how many students to fetch per call. */
  const [limit, setLimit] = useState<number>(8);

  /** A list of students in OverService. */
  const [students, setStudents] = useState<Array<Partial<Student>>>([]);

  /** Indicator for loading results. */
  const [loading, setLoading] = useState<boolean>(true);

  async function searchOverServiceStudents(page: number, limit: number) {
    setLoading(true);

    // Call for a list of all students on OverService based on criteria.
    const students = await searchStudents(undefined, limit, (page - 1) * limit);

    // Set the students list to the state.
    setStudents(students);

    // Remove the loading state.
    setLoading(false);
  }

  /** Search again after any modifications are made to the page or the limit. */
  /* useEffect(() => {
    searchOverServiceStudents(page, limit);
  }, [page, limit]); */

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
                    {/* <Spinner />
                    <p className="text-slate-500">Cargando usuarios...</p> */}
                    <p className="text-slate-500">
                      Esta sección está en mantenimiento. ¡Gracias!
                    </p>
                  </div>
                ) : students?.length ? (
                  <div className="flex flex-col gap-2">
                    {students.slice(0, limit).map((student) => {
                      return (
                        <UserCard user={student} key={student.academicId} />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-slate-500">No se encontraron usuarios.</p>
                )}
              </div>
              <div className="w-full">
                <Pagination
                  initialPage={1}
                  total={Math.floor(
                    (students?.length ?? 0) > limit
                      ? students?.length / limit
                      : 1
                  )}
                  variant="light"
                />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
