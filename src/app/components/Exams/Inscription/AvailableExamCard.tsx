"use client";

import { Button, Card, CardBody, useDisclosure } from "@nextui-org/react";
import { AvailableExam } from "autogestion-frvm/types";
import { AcademicIcon } from "../../Icons/AcademicIcon";
import AvailableExamTurnModal from "./AvailableExamTurnsModal";
import { Dispatch, SetStateAction } from "react";

type AvailableExamCardProps = {
  exam: AvailableExam;
  setAvailableExams: Dispatch<SetStateAction<AvailableExam[]>>;
};

/**
 * Parses the provided level into a readable string.
 *
 * @param {string} level The level to parse.
 *
 * @returns {string} The parsed level.
 */
export function parseCourseLevel(level: string): string {
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

export default function AvailableExamCard({
  exam,
  setAvailableExams,
}: AvailableExamCardProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <AvailableExamTurnModal
        exam={exam}
        setAvailableExams={setAvailableExams}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
      />

      <Card>
        <CardBody>
          <div className="flex justify-between gap-4 items-center">
            <div className="w-[75%]">
              <div className="flex gap-3 items-center">
                <div className="float-left text-foreground-200">
                  <span className="relative flex h-6 w-6">
                    <AcademicIcon className="animate-ping absolute inline-flex h-full w-full text-green-400 opacity-75" />
                    <AcademicIcon className="relative inline-flex h-6 w-6 text-green-500" />
                  </span>
                </div>
                <div className="flex gap-4 items-center">
                  <h2 className="text-md font-semibold">
                    {exam.nombreMateriaLargo}
                  </h2>
                </div>
              </div>
              <div className="flex gap-2 mt-2 items-center">
                <p className="text-sm text-default-500">
                  <span className="font-semibold">Plan</span> {exam.plan}
                </p>
                <span className="w-4 h-0.5 bg-default-500"></span>
                <p className="text-sm text-default-500 font-semibold">
                  {parseCourseLevel(exam.anioMateria)}
                </p>
              </div>
            </div>
            <div>
              <Button
                color="success"
                variant="bordered"
                onClick={(e) => onOpen()}
              >
                Ver Turnos
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
