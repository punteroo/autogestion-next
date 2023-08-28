"use client";

import { Card, Spinner } from "@nextui-org/react";
import { AcademicStatusEntry } from "autogestion-frvm/types";
import axios from "axios";
import { useEffect, useState } from "react";
import AcademicStatusYearEntry from "./AcademicStatusYearEntry";

export default function AcademicStatusPanel() {
  const [loading, isLoading] = useState<boolean>(true);

  /** Holds all academic status data for the student to check. */
  const [academicStatus, setAcademicStatus] = useState<
    Array<AcademicStatusEntry>
  >([]);

  /** An object whose keys represent each career's year. */
  const [academicStatusByYear, setAcademicStatusByYear] = useState<
    Record<string, Array<AcademicStatusEntry>>
  >({});

  useEffect(() => {
    async function fetchAcademicData() {
      isLoading(true);

      try {
        const { data } = await axios<AcademicStatusEntry[]>({
          method: "GET",
          url: "/api/autogestion/courses/academic",
        });

        setAcademicStatus(data);

        // Format data to classify each course by their corresponding year.
        const courseByYear: Record<
          string,
          (Omit<AcademicStatusEntry, "anioCursado"> & { anioCursado: null })[]
        > = {};
        for (const course of data) {
          if (courseByYear[course.nivel])
            courseByYear[course.nivel].push(course);
          else courseByYear[course.nivel] = [course];
        }

        setAcademicStatusByYear(courseByYear);
        isLoading(false);

        isLoading(false);
      } catch (e) {
        console.error(e);
        isLoading(false);
      }
    }

    if (academicStatus?.length < 1) fetchAcademicData();
  });

  return (
    <div className="flex flex-col items-center justify-center mx-4 gap-4">
      <h1 className="my-4 text-xl font-bold">Mi Estado Academico</h1>

      <Card className="w-full flex flex-col items-center justify-center mx-4 px-2 gap-y-2">
        {loading || Object.keys(academicStatusByYear)?.length < 1 ? (
          <div className="flex flex-col items-center justify-center p-4 gap-y-4 text-center">
            <Spinner />
            <h3 className="text-sm font-semibold text-foreground-300">
              Cargando estado academico, esto puede tomar un tiempo...
            </h3>
          </div>
        ) : (
          Object.keys(academicStatusByYear).map((year) => {
            return (
              <AcademicStatusYearEntry
                key={year}
                year={parseInt(year)}
                courses={academicStatusByYear[year]}
              />
            );
          })
        )}
      </Card>
    </div>
  );
}
