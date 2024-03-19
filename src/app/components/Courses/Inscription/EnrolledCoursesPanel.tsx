"use client";

import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { AvailableCourse } from "autogestion-frvm/types";
import { EnrolledCourseEntry } from "./EnrolledCourseEntry";
import { Dispatch, SetStateAction } from "react";

type EnrolledCoursesPanelProps = {
  isLoading: boolean;
  entries: Array<AvailableCourse>;
  setAvailableCourses: Dispatch<SetStateAction<AvailableCourse[]>>;
};

export default function EnrolledCoursesPanel({
  isLoading,
  entries,
  setAvailableCourses,
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
          <div className="flex flex-col gap-3 lg:grid lg:grid-cols-2 2xl:grid-cols-4">
            {entries.map((enrolledCourse, i) => (
              <EnrolledCourseEntry
                key={i}
                course={enrolledCourse}
                setAvailableCourses={setAvailableCourses}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-foreground-400 text-sm mb-4">
            Actualmente no estás inscripto a ningún curso.
          </p>
        )}
      </AccordionItem>
    </Accordion>
  );
}
