"use client";

import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { AvailableCourse } from "autogestion-frvm/types";

type EnrolledCoursesPanelProps = {
  isLoading: boolean;
  entries: Array<AvailableCourse>;
};

export default function EnrolledCoursesPanel({
  isLoading,
  entries,
}: EnrolledCoursesPanelProps) {
  return (
    <Accordion showDivider={false} selectionMode="single" variant="shadow">
      <AccordionItem title="Mis Inscripciones">
        {isLoading ? (
          <div className="flex flex-col items-center my-auto">
            <Spinner />
            <p className="text-foreground-400 text-sm">
              Anulando tu inscripción...
            </p>
          </div>
        ) : entries?.length ? (
          entries.map((enrolledCourse) => null)
        ) : (
          <p className="text-center text-foreground-400 text-sm mb-4">
            Actualmente no estás inscripto a ningún curso.
          </p>
        )}
      </AccordionItem>
    </Accordion>
  );
}
