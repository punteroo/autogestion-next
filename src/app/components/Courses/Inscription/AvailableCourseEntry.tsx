"use client";

import {
  Card,
  CardBody,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Spinner,
  RadioGroup,
  Radio,
} from "@nextui-org/react";
import {
  AvailableCourse,
  AvailableCourseCommission,
} from "autogestion-frvm/types";
import { AcademicIcon } from "../../Icons/AcademicIcon";
import { parseCourseLevel } from "../../Exams/Inscription/AvailableExamCard";
import { useState } from "react";
import axios from "axios";

type AvailableCourseProps = {
  course: AvailableCourse;
};

export default function AvailableCourseEntry({ course }: AvailableCourseProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  /** State that controls if a commission search is loading. */
  const [loading, isLoading] = useState<boolean>(false);

  /** State that holds available commissions for the specified course. */
  const [commissions, setCommissions] = useState<
    Array<AvailableCourseCommission>
  >([]);

  /** State that indicates an error when looking up commissions. */
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const handleModalOpen = async () => {
    onOpen();

    // If already loading, do not execute.
    if (loading) return;

    // Set the loading state on true.
    isLoading(true);
    setHasFailed(false);

    try {
      const { data } = await axios<Array<AvailableCourseCommission>>({
        method: "GET",
        url: "/api/autogestion/courses/inscription/commissions",
        params: {
          course: Buffer.from(JSON.stringify(course), "utf-8").toString(
            "base64"
          ),
        },
      });

      setCommissions(data);
      isLoading(false);
    } catch (e: any) {
      console.error(e);

      if (e?.response?.data?.message) setError(e.response.data.message);

      isLoading(false);
      setHasFailed(true);
    }
  };

  /**
   * Enrolls the student to the selected commission.
   */
  async function enrollToCommission(): Promise<void> {
    if (!selectedCommission) return;

    try {
      const { data } = await axios({
        method: "POST",
        url: "/api/autogestion/courses/inscription",
        data: {
          course,
          commission: selectedCommission,
        },
      });

      console.log(data);
    } catch (e) {}
  }

  /** State that holds a selected commission. */
  const [selectedCommission, setSelectedCommission] =
    useState<AvailableCourseCommission>();

  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        isDismissable={!loading}
        hideCloseButton={loading}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Inscribirse a {course.nombreLargo}
              </ModalHeader>
              <ModalBody>
                {loading ? (
                  <div className="flex flex-col gap-2 items-center">
                    <Spinner />
                    <p className="text-foreground-300">
                      Cargando comisiones disponibles...
                    </p>
                  </div>
                ) : hasFailed ? (
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-foreground-300">
                      <span className="text-red-700">
                        Ocurrió un error al buscar comisiones para{" "}
                        <span className="font-bold">{course.nombreLargo}</span>:
                      </span>{" "}
                      {error?.length
                        ? error
                        : "Error desconocido, intente con otra materia."}
                    </p>
                  </div>
                ) : (
                  <RadioGroup
                    label="Selecciona una comisión"
                    description="Elige la comisión con la que deseas cursar la materia."
                    onValueChange={(value) => {
                      // Split out both codes.
                      const [materia, especialidad] = value.split("-");

                      // Find the commission.
                      setSelectedCommission(
                        commissions.find(
                          (commision) =>
                            commision.materia === materia &&
                            commision.especialidad === especialidad
                        )
                      );
                    }}
                  >
                    {commissions?.map((commision, i) => (
                      <Radio
                        key={i}
                        value={`${commision.materia}-${commision.especialidad}`}
                      >
                        <div className="flex flex-col items-start">
                          <h2 className="font-bold">
                            {commision.nombreEspecialidad}
                          </h2>
                          <div className="flex flex-col gap-1 items-start text-foreground-500 text-xs">
                            <p>{commision.horario}</p>
                            <p>Edificio {commision.edificio}</p>
                          </div>
                        </div>
                      </Radio>
                    ))}
                  </RadioGroup>
                )}
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  isDisabled={loading}
                  onPress={onClose}
                >
                  Cerrar
                </Button>
                <Button
                  color="primary"
                  onPress={onClose}
                  isDisabled={loading || !selectedCommission}
                  onClick={() => enrollToCommission()}
                >
                  Inscribirme
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Card>
        <CardBody>
          <div className="gap-4 items-center">
            <div className="">
              <div className="flex gap-3 items-center">
                <div className="float-left text-foreground-200">
                  <span className="relative flex h-6 w-6">
                    <AcademicIcon className="animate-ping absolute inline-flex h-full w-full text-green-400 opacity-75" />
                    <AcademicIcon className="relative inline-flex h-6 w-6 text-green-500" />
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <h2 className="text-md font-semibold">
                    {course.nombreLargo}
                  </h2>
                </div>
              </div>
              <div className="flex gap-2 mt-2 justify-between items-end">
                <div className="flex gap-2 items-center">
                  <p className="text-sm text-default-500">
                    <span className="font-semibold">Plan</span> {course.plan}
                  </p>
                  <span className="w-4 h-0.5 bg-default-500"></span>
                  <p className="text-sm text-default-500 font-semibold">
                    {parseCourseLevel(course.anio)}
                  </p>
                </div>
                <div>
                  <Button
                    color="success"
                    variant="bordered"
                    onClick={() => handleModalOpen()}
                  >
                    Ver Comisiones
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
