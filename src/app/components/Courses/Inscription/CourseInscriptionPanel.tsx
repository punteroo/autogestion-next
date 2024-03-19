"use client";

import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import {
  AvailableCourse,
  AvailableCourseCommission,
  EnrollCourseResponse,
} from "autogestion-frvm/types";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import AvailableCourseEntry from "./AvailableCourseEntry";
import EnrolledCoursesPanel from "./EnrolledCoursesPanel";
import axios from "axios";
import { CheckIcon } from "../../Icons/CheckIcon";

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

  const {
    isOpen: isSuccessOpen,
    onOpen: openSuccess,
    onOpenChange: onSuccessOpenChange,
  } = useDisclosure({ id: "success" });

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

  /**
   * Function that parses an available course entry's date into a better format.
   *
   * @param {string} date The date to parse.
   *
   * @returns {string} The parsed date.
   */
  function parseDateFormat(date: string): string {
    // Is this a multi-date?
    const dates = date.split(",");

    const res: string[] = [];
    for (const date of dates) {
      // Use a specially crafted regex to obtain date parts.
      const result =
        /(C[0-9]{1}) ?([L|l]unes|[M|m]artes|[M|m]i[e|é]rcoles|[J|j]ueves|[V|v]iernes) ? ([0-9]{2}:[0-9]{2})-?([0-9]{2}:[0-9]{2})/g.exec(
          date
        );

      // Return the default date if no result was found.
      if (!result) {
        res.push(date);
        continue;
      }

      // Obtain its parts.
      const [original, commission, day, startsAt, endsAt] = result;

      // Map it.
      res.push(`${day} desde ${startsAt}hs hasta ${endsAt}hs`);
    }

    return res.join(" y ");
  }

  /** State that holds if the student is enrolling. */
  const [isEnrolling, setIsEnrolling] = useState<boolean>(false);

  /** State with the enrollment result. */
  const [enrollResult, setEnrollResult] = useState<EnrollCourseResponse>();

  /** State that holds a selected commission. */
  const [selectedCommission, setSelectedCommission] =
    useState<AvailableCourseCommission>();

  return (
    <>
      <h1 className="hidden md:block text-3xl font-bold m-4 text-center">
        Inscripción a Cursado
      </h1>
      <div className="flex max-md:flex-col items-center md:items-start justify-center md:justify-between md:flex mx-4 gap-4">
        <h1 className="my-4 text-xl font-bold md:hidden">
          Inscripción a Cursado
        </h1>

        <Modal
          isOpen={isSuccessOpen}
          onOpenChange={onSuccessOpenChange}
          size="lg"
          placement="top"
          backdrop="opaque"
          isDismissable={false}
          hideCloseButton={true}
        >
          <ModalContent>
            {(onSucessClose) => (
              <>
                <ModalHeader className="flex gap-2 items-center text-green-300">
                  <CheckIcon /> Inscripción exitosa
                </ModalHeader>
                <ModalBody>
                  <div className="flex flex-col my-4 mx-auto text-sm gap-4">
                    <p className="text-foreground">
                      Tu checksum de inscripción es{" "}
                      <span className="font-semibold">
                        {enrollResult?.cursado.checksum}
                      </span>
                      . Puedes usar este código ante un problema con tu
                      inscripción.
                    </p>
                    <p>
                      Cursarás tu materia con la comisión de{" "}
                      <span className="font-semibold">
                        {selectedCommission?.nombreEspecialidad}
                      </span>
                      . Tus horarios de cursado son lo(s){" "}
                      {parseDateFormat(enrollResult?.cursado.horario ?? "")} en
                      el edificio {selectedCommission?.edificio}.
                    </p>
                    <p className="text-foreground-500">
                      Si recién abren las inscripciones es posible que no
                      visualizes esta materia en tus horarios de cursado. No te
                      preocupes, la universidad publicará los horarios de
                      cursado en los próximos días.
                    </p>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button
                    color="primary"
                    variant="light"
                    onPress={() => onSucessClose()}
                  >
                    Entendido, gracias
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

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
                  setAvailableCourses={setAvailableCourses}
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
                    return (
                      <AvailableCourseEntry
                        course={course}
                        key={i}
                        setAvailableCourses={setAvailableCourses}
                        openSuccess={openSuccess}
                        isEnrolling={isEnrolling}
                        setIsEnrolling={setIsEnrolling}
                        setEnrollResult={setEnrollResult}
                        selectedCommission={selectedCommission}
                        setSelectedCommission={setSelectedCommission}
                      />
                    );
                  })}
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
