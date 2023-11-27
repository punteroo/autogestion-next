"use client";

import { Accordion, AccordionItem, Spinner } from "@nextui-org/react";
import { AvailableExam, ExamVoidResponse } from "autogestion-frvm/types";
import EnrolledExamEntry from "./EnrolledExamEntry";
import { Dispatch, SetStateAction, useState } from "react";
import axios from "axios";

type EnrolledExamsAccordionProps = {
  entries: Array<AvailableExam>;
  setEntries: Dispatch<SetStateAction<AvailableExam[]>>;
};

export default function EnrolledExamsAccordion({
  entries,
  setEntries,
}: EnrolledExamsAccordionProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function voidEnrollment(exam: AvailableExam): Promise<void> {
    setIsLoading(true);

    try {
      // Send the request.
      const { data } = await axios<ExamVoidResponse>({
        method: "DELETE",
        url: "/api/autogestion/exams/inscription",
        data: exam,
      });

      // Update the context.
      exam.inscripto = null;
      exam.fechaExamen = null;
      exam.horarioPractico = null;
      exam.horarioTeorico = null;
      exam.tribunal = null;
      exam.nombreTribunal = null;
      exam.turno = "0";

      // Set the parent context.
      setEntries((previous) => {
        const newEntries = [...previous];
        const index = newEntries.findIndex(
          (entry) => entry.codigoMateria === exam.codigoMateria
        );
        newEntries[index] = exam;
        return newEntries;
      });

      // Also set it on this context to clean it out.
      entries.find(
        (entry) => entry.codigoMateria === exam.codigoMateria
      )!.inscripto = null;

      setIsLoading(false);
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  }

  return (
    <Accordion showDivider={false} selectionMode="single">
      <AccordionItem title="Mis Inscripciones">
        {isLoading ? (
          <div className="flex flex-col items-center my-auto">
            <Spinner />
            <p className="text-foreground-400 text-sm">
              Anulando tu inscripción...
            </p>
          </div>
        ) : entries?.length ? (
          entries.map((enrolledExam) => (
            <EnrolledExamEntry
              key={enrolledExam.codigoMateria}
              exam={enrolledExam}
              voidEnrollment={voidEnrollment}
            />
          ))
        ) : (
          <p className="text-center text-foreground-400 text-sm">
            Actualmente no estás inscripto a ningún final.
          </p>
        )}
      </AccordionItem>
    </Accordion>
  );
}
