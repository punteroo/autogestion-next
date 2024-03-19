"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure,
} from "@nextui-org/react";
import { AvailableCourse } from "autogestion-frvm/types";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";

type EnrolledCourseEntryProps = {
  course: AvailableCourse;
  setAvailableCourses: Dispatch<SetStateAction<AvailableCourse[]>>;
};

export function EnrolledCourseEntry({
  course,
  setAvailableCourses,
}: EnrolledCourseEntryProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /** State that controls if the unenrollment is being processed. */
  const [unenrolling, isUnenrolling] = useState<boolean>(false);

  async function unenrollFromCourse(): Promise<void> {
    if (unenrolling) return;

    isUnenrolling(true);

    try {
      const { data } = await axios({
        method: "DELETE",
        url: "/api/autogestion/courses/inscription",
        data: course,
      });

      // Extract the course payload from the response.
      const { course: payload } = data;

      // Find the course in the available courses list, and change it for the new one.
      setAvailableCourses((prevCourses) => {
        const index = prevCourses.findIndex(
          (c) => c.codigoMateria === payload.codigoMateria
        );

        if (index === -1) return prevCourses;

        const newCourses = [...prevCourses];

        newCourses[index] = payload;

        return newCourses;
      });

      onOpenChange();
      isUnenrolling(false);
    } catch (e) {
      console.error(e);
      isUnenrolling(false);
    }
  }

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        isDismissable={!unenrolling}
        hideCloseButton={unenrolling}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {unenrolling ? (
                  "Anulando inscripción..."
                ) : (
                  <>
                    Anular inscripción a{" "}
                    <span className="font-bold">{course.nombreLargo}</span>
                  </>
                )}
              </ModalHeader>
              {unenrolling ? (
                <ModalBody>
                  <div className="flex flex-col gap-2">
                    <Spinner />
                    <p className="text-foreground-400 text-sm">
                      Por favor, espera un momento mientras anulamos tu
                      inscripción...
                    </p>
                  </div>
                </ModalBody>
              ) : (
                <>
                  <ModalBody>
                    <p>
                      Estás por anular tu inscripción a cursado de la materia.
                    </p>
                    <p>
                      Recuerda que siempre puedes volver a inscribirte dentro
                      del rango de días de inscripción a cursado.
                    </p>
                    <p>¿Estás seguro que deseas anular tu inscripción?</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" variant="light" onClick={onClose}>
                      No quiero anular
                    </Button>
                    <Button color="danger" onClick={() => unenrollFromCourse()}>
                      Sí, anula mi inscripción
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>

      <Card>
        <CardBody>
          <h1 className="text-foreground-600 font-bold">
            {course.nombreLargo}
          </h1>
          <div className="flex justify-between items-center">
            <div className="flex flex-col gap-2 max-w-[65%]">
              <p className="text-foreground-500 text-sm">
                <span className="font-semibold">
                  <span className="font-bold">{course.anio}</span>° Año - Plan
                </span>{" "}
                {course.plan}
              </p>
              <p className="text-foreground-500 text-sm">
                <span className="font-semibold">Comisión</span>{" "}
                {course.comisionActual}
              </p>
            </div>
            <div className="w-max">
              <Button color="danger" variant="ghost" onClick={() => onOpen()}>
                Anular
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
