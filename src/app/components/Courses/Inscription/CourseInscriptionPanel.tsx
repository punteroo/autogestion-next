"use client";

import { Button, Card, CardBody, Spinner } from "@nextui-org/react";
import { AvailableCourse } from "autogestion-frvm/types";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import AvailableCourseEntry from "./AvailableCourseEntry";
import EnrolledCoursesPanel from "./EnrolledCoursesPanel";
import axios from "axios";

export default function CourseInscriptionPanel() {
  const { data: session } = useSession();

  if (!session) redirect("/");

  /** State that controls if the available courses are loading. */
  const [loading, isLoading] = useState<boolean>(false);

  /** State that indicates if loading the available courses took too long. */
  const [loadingTimeout, hasLoadingTimeout] = useState<boolean>(false);

  /** State that controls if the search for available courses has failed. */
  const [failed, hasFailed] = useState<boolean>(false);

  /** If the fetch failed, an error message. */
  const [errorMessage, setErrorMessage] = useState<string>("");

  /** State that holds all available courses at the moment. */
  const [availableCourses, setAvailableCourses] = useState<
    Array<AvailableCourse>
  >([]);

  useEffect(() => {
    async function searchCourses() {
      if (!session?.user) return;

      if (loading) return;

      if (failed) return;

      isLoading(true);

      try {
        // Search for courses and set them.
        const { data: courses } = await axios<Array<AvailableCourse>>({
          method: "GET",
          url: "/api/autogestion/courses/inscription",
        });

        setAvailableCourses(courses);

        isLoading(false);
      } catch (e: any) {
        console.log(e);

        if (e?.message) {
          const error = e?.response?.data?.message
            ? `${e.message}: ${e.response.data.message}`
            : e.message;
          setErrorMessage(error);
        }

        // Set the failed state to true.
        hasFailed(true);
        isLoading(false);
      }
    }

    if (!failed) searchCourses();
  }, [failed]);

  useEffect(() => {
    if (loading) {
      setTimeout(() => {
        if (loading) {
          // Indicate a long time has passed, and allow the user to retry.
          hasLoadingTimeout(true);
        }

        hasLoadingTimeout(false);
      }, 35000);
    }
  }, [loading, loadingTimeout]);

  return (
    <>
      <h1 className="hidden md:block text-3xl font-bold m-4 text-center">
        Inscripción a Cursado
      </h1>
      <div className="flex max-md:flex-col items-center md:items-start justify-center md:justify-between md:flex mx-4 gap-4">
        <h1 className="my-4 text-xl font-bold md:hidden">
          Inscripción a Cursado
        </h1>

        <motion.div
          className="w-full"
          initial={{
            opacity: 0,
            y: -10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.5,
          }}
        >
          {loading ? (
            <div className="flex flex-col gap-y-3">
              <Spinner />
              {loadingTimeout ? (
                <div className="flex flex-col gap-2">
                  <p className="text-foreground-400 text-sm text-center my-auto">
                    Esto está tomando demasiado. Es posible que el sistema de la
                    universidad esté fallando, ¿deseas reintentar?
                  </p>
                  <Button
                    color="secondary"
                    onClick={() => {
                      // Reset the timeout.
                      hasLoadingTimeout(false);
                      hasFailed(false);
                    }}
                  >
                    Reintentar
                  </Button>
                </div>
              ) : (
                <p className="text-foreground-400 text-sm text-center my-auto">
                  Cargando cursos disponibles...
                </p>
              )}
            </div>
          ) : failed ? (
            <div className="flex flex-col gap-2">
              <p className="text-foreground-400 text-sm text-center my-auto">
                Algo falló al buscar los cursos disponibles:{" "}
                {errorMessage ?? "Error Desconocido"}
              </p>
              <Button
                color="secondary"
                onClick={() => {
                  hasFailed(false);
                }}
              >
                Reintentar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="">
                <EnrolledCoursesPanel
                  isLoading={loading}
                  entries={availableCourses.filter(
                    (course) => course.especialidadHomogenea !== "0"
                  )}
                />
              </div>
              <motion.div
                key={
                  availableCourses.filter(
                    (course) => course.especialidadHomogenea === "0"
                  ).length
                }
                initial={{
                  opacity: 0,
                  y: -10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.5,
                }}
                className="w-full flex flex-col lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-3 px-2 p-0 m-0"
              >
                {availableCourses
                  .filter((course) => course.especialidadHomogenea === "0")
                  .map((course, i) => {
                    return <AvailableCourseEntry course={course} key={i} />;
                  })}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
