"use client";

import { Accordion, AccordionItem } from "@nextui-org/react";
import {
  AvailableExam,
  ExamEnrollResponse,
  ExamTurn,
} from "autogestion-frvm/types";
import { Key, useEffect, useState } from "react";
import AvailableExamTurnEntries from "./AvailableExamTurnEntries";
import axios from "axios";

type AvailableExamEntryProps = {
  entries: Array<AvailableExam>;
  setEntries: (entries: Array<AvailableExam>) => void;
};

export default function AvailableExamsAccordion({
  entries,
  setEntries,
}: AvailableExamEntryProps) {
  const itemClasses = {
    base: "py-0 w-full bg-success-50",
    trigger: "px-4 py-1 rounded-lg h-14 flex items-center",
    content: "text-small px-2",
  };

  /** An array that holds available turns for a selected exam. */
  const [availableTurns, setAvailableTurns] = useState<Array<ExamTurn>>([]);

  /** The selected course entry. */
  const [selectedEntry, setSelectedEntry] = useState<{
    courseId?: string;
    plan?: string;
    specialty?: string;
  } | null>(null);

  /** Wether it's loading turns or not. Expanding other exams is not allowed when loading turns. */
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  /**
   * Enrolls a student into an exam, and updates the context with the new inscription details.
   *
   * @param {AvailableExam} exam The exam to enroll into.
   * @param {ExamTurn} turn The turn to enroll into.
   *
   * @returns {Promise<void>}
   */
  async function enrollIntoExam(
    exam: AvailableExam,
    turn: ExamTurn
  ): Promise<void> {
    if (!turn.horarioSeleccionado)
      return alert("No se ha seleccionado un horario para el examen.");

    try {
      setIsLoading(true);
      setErrorMessage("");

      const { data } = await axios<ExamEnrollResponse>({
        method: "POST",
        url: "/api/autogestion/exams/inscription",
        data: {
          exam,
          turn,
          turnTime: turn.horarioSeleccionado,
        },
      });

      // Search for the available exam entry and update its properties to reflect the inscription.
      const { dato: enrollment, fecha: selectedTurn } = data;

      const updatedEntries = entries.map((entry) => {
        if (entry.codigoMateria === data.materia.codigoMateria) {
          // Extract only what's important from the turn (it's missing on the other metadata)
          const mappedTurn: Partial<AvailableExam> = {
            turno: selectedTurn.turno,
            tribunal: selectedTurn.tribunal,
            nombreTribunal: selectedTurn.nombreTribunal,
          };

          entry = { ...entry, ...enrollment, ...mappedTurn };
        }

        console.log(entry);

        return entry;
      });

      setEntries(updatedEntries);
      setIsLoading(false);
    } catch (e: any) {
      console.error(e);
      setIsLoading(false);
      setErrorMessage(e?.response?.data?.message);
    }
  }

  /**
   * Detect when expanding the accordion.
   */
  function onExpand(expanded: Set<Key>) {
    if (expanded?.size === 0) {
      setSelectedEntry(null);
      if (isLoading) setIsLoading(false);
      return;
    }

    // Fire a search for available turns.
    const [courseId, specialty, plan] = expanded
      .values()
      .next()
      .value.split("-");

    setSelectedEntry({
      courseId,
      plan,
      specialty,
    });
    setIsLoading(true);
  }

  useEffect(() => {
    async function fetchAvailableTurns() {
      setAvailableTurns([]);
      setErrorMessage("");

      try {
        // Fetch turns.
        const { data } = await axios<ExamTurn[]>({
          method: "GET",
          url: "/api/autogestion/exams/inscription/turns",
          params: {
            ...selectedEntry,
          },
          timeout: 30000,
        });

        setAvailableTurns(data);
        setIsLoading(false);
      } catch (e: any) {
        console.error(e?.response?.data?.message);
        setIsLoading(false);
        setErrorMessage(e?.response?.data?.message);
      }
    }

    if (isLoading) fetchAvailableTurns();
  }, [isLoading, selectedEntry]);

  return (
    <Accordion
      showDivider={false}
      className="px-0 gap-y-1 flex max-md:flex-col md:gap-4 w-full"
      itemClasses={{
        base: "py-0 w-full bg-success-50",
        trigger: "px-4 py-1 rounded-lg h-14 flex items-center",
        content: "text-small px-2",
      }}
      selectionBehavior="replace"
      selectionMode="single"
      onSelectionChange={(keys) => onExpand(keys as Set<Key>)}
      isDisabled={isLoading}
    >
      {entries?.length ? (
        entries
          // Do not show exams that are already enrolled, at least on this accordion.
          .filter((entry) => entry.inscripto === null)
          .map((entry) => (
            <AccordionItem
              key={`${entry.codigoMateria}-${entry.especialidad}-${entry.plan}`}
              subtitle={<p className="text-xs text-success">Habilitado</p>}
              title={<p className="text-sm">{entry.nombreMateria}</p>}
              startContent={
                <div className="w-3 h-3 rounded-full bg-success"></div>
              }
              hideIndicator
            >
              <div className="flex flex-col gap-2">
                <AvailableExamTurnEntries
                  turns={availableTurns}
                  exam={entry}
                  isLoading={isLoading}
                  errorMessage={errorMessage}
                  enrollFunction={enrollIntoExam}
                />
              </div>
            </AccordionItem>
          ))
      ) : (
        <p className="text-center text-foreground-400 text-sm">
          Actualmente no tienes exámenes finales disponibles, o te has inscripto
          a todos.
        </p>
      )}
    </Accordion>
  );
}
