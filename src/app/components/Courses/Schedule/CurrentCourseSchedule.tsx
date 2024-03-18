"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import { CourseCalendarEntry, StudentCourse } from "autogestion-frvm/courses";
import axios from "axios";
import { useEffect, useState } from "react";
import { createEvents, type EventAttributes } from "ics";
import CourseCalendar from "./CourseCalendar";

enum CalendarGenerationStatus {
  /** Currently fetching raw calendar data. */
  FETCHING_RAW_CALENDAR,

  /** Formatting raw calendar entries to iCalendar format. */
  FORMATTING_CALENDAR,

  /** Generating iCalendar file data. */
  GENERATING_ICAL,
}

export default function CurrentCourseSchedule() {
  // React state that holds all calendar data for the user.
  const [calendar, setCalendar] = useState<Array<CourseCalendarEntry>>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserCalendar() {
      setLoading(true);

      try {
        const { data: calendar } = await axios({
          method: "GET",
          url: "/api/autogestion/courses/schedule",
        });

        setLoading(false);

        return calendar as Array<CourseCalendarEntry>;
      } catch (e) {
        console.error("Error fetching user calendar", e);
        setLoading(false);

        return [];
      }
    }

    // Make a call for the student's calendar.
    fetchUserCalendar().then((calendar) => setCalendar(calendar));
  }, []);

  /** State that controls if the calendar is being generated. */
  const [generatingCalendar, setGeneratingCalendar] = useState(false);

  /** Calendar generation stage. */
  const [calendarGenerationStage, setCalendarGenerationStage] =
    useState<CalendarGenerationStatus>(
      CalendarGenerationStatus.FETCHING_RAW_CALENDAR
    );

  /**
   * Generates an iCalendar file from the student's calendar information.
   *
   * @param {Array<CourseCalendarEntry>} calendar The student's calendar.
   *
   * @returns
   */
  async function generateICalendar(calendar: Array<CourseCalendarEntry>) {
    setGeneratingCalendar(true);

    try {
      setCalendarGenerationStage(
        CalendarGenerationStatus.FETCHING_RAW_CALENDAR
      );

      // Obtain the raw calendar information.
      const { data: rawCalendar } = await axios<Array<CourseCalendarEntry>>({
        method: "GET",
        url: "/api/autogestion/courses/schedule",
        params: {
          raw: true,
        },
      });

      // Now parse the calendar events vs. the courses.
      const events: Array<EventAttributes> = [];

      const dateToDateArray = (
        date: Date
      ): [number, number, number, number, number] => {
        return [
          date.getFullYear(),
          // Add 1 always as JS months are 0-indexed.
          date.getMonth() + 1,
          date.getDate(),
          date.getHours(),
          date.getMinutes(),
        ];
      };

      setCalendarGenerationStage(CalendarGenerationStatus.FORMATTING_CALENDAR);

      for (const entry of rawCalendar) {
        // Obtain date objects from the start and end dates.
        const startDate = new Date(entry.fechaInicio),
          endDate = new Date(entry.fechaFin);

        // If the start date is before March, ignore.
        if (startDate.getMonth() < 2) continue;

        // Declare the start and end times for the event.
        events.push({
          calName: `Mis Clases ${new Date().getUTCFullYear()}`,
          title: entry.nombremateria,
          description: `Aula ${entry.aulaNombre}`,
          start: dateToDateArray(startDate),
          startInputType: "local",
          end: dateToDateArray(endDate),
          endInputType: "local",
          location: "UTN Facultad Regional Villa María",
          alarms: [
            {
              action: "audio",
              description: `${entry.nombremateria} comienza en 15 minutos.`,
              trigger: { minutes: 15, before: true },
              repeat: 1,
            },
          ],
          geo: {
            lat: -32.40918882335378,
            lon: -63.21693143203538,
          },
          url: "https://autogestion.puntero.dev/",
          organizer: {
            name: "Lucas 'puntero' Maza",
            email: "mazalucas@hotmail.com",
          },
        });
      }

      setCalendarGenerationStage(CalendarGenerationStatus.GENERATING_ICAL);

      // Create the ics file.
      const ics = await new Promise<string>((res, rej) => {
        createEvents(events, (err, val) => {
          if (err) rej(err);

          res(val);
        });
      });

      // Create a blob from the ics file.
      const blob = new Blob([ics], { type: "text/calendar" });

      // Create a URL from the blob.
      const url = URL.createObjectURL(blob);

      // Create a link to download the file.
      const link = document.createElement("a");

      link.href = url;
      link.download = `nexus-clases-${new Date().getTime()}.ics`;
      link.click();

      setGeneratingCalendar(false);
    } catch (e) {
      setGeneratingCalendar(false);
    }
  }

  return (
    <>
      <h1 className="hidden md:block text-3xl font-bold m-4 text-center">
        Horarios de Cursado
      </h1>
      <div className="flex max-md:flex-col items-center md:items-start justify-center md:justify-between md:flex mx-4 gap-4">
        <h1 className="my-4 text-xl font-bold md:hidden">
          Horarios de Cursado
        </h1>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-4 gap-y-4 text-center">
          <Spinner />
        </div>
      ) : generatingCalendar ? (
        <div className="flex flex-col gap-2 items-center">
          <Spinner color="secondary" />
          <p className="text-foreground-500 font-semibold">
            {calendarGenerationStage ===
            CalendarGenerationStatus.FETCHING_RAW_CALENDAR
              ? "Obteniendo información de tus clases..."
              : calendarGenerationStage ===
                CalendarGenerationStatus.FORMATTING_CALENDAR
              ? "Pasando a un calendario personal..."
              : "Generando archivo iCalendar..."}
          </p>
        </div>
      ) : (
        <div className="sm:mx-4">
          <Card>
            <CardHeader>
              <p className="text-foreground-400 text-center text-sm sm:w-full">
                Los horarios que visualizas aquí son para materias en las que
                estás actualmente inscripto. Es posible que veas materias ya
                aprobadas aquí, luego de que abran las inscripciones a cursado
                dejarás de visualizarlas.
              </p>
            </CardHeader>
            <CardBody>
              <CourseCalendar calendar={calendar} />
            </CardBody>
            {calendar.length > 0 ? (
              <CardFooter>
                <div className="flex flex-col gap-2 sm:w-full sm:items-center">
                  <p className="text-foreground-400 text-center text-sm">
                    Puedes exportar tus horarios de cursado a un calendario para
                    importar en Google, Outlook o el mismo calendario de tu
                    teléfono.
                  </p>
                  <Button
                    variant="bordered"
                    color="primary"
                    className="w-full sm:w-max"
                    onClick={() => generateICalendar(calendar)}
                  >
                    Exportar
                  </Button>
                </div>
              </CardFooter>
            ) : null}
          </Card>
        </div>
      )}
    </>
  );
}
