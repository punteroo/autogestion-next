"use client";

import { CourseCalendarEntry } from "autogestion-frvm/courses";
import { v4 } from "uuid";
import { Card, CardBody, CardHeader, Tab, Tabs } from "@nextui-org/react";
import { useState } from "react";
import { AcademicIcon } from "../../Icons/AcademicIcon";

type CourseCalendarProps = {
  calendar: Array<CourseCalendarEntry>;
};

export default function CourseCalendar({ calendar }: CourseCalendarProps) {
  /**
   * Function that looks through the calendar items' and returns those who match the given day.
   *
   * @param {number} day The day to look for, from 0 to 6 where 0 is Sunday and 6 is Saturday.
   *
   * @returns {Array<CourseCalendarEntry>} The events that match the given day.
   */
  function getEventsForDay(day: number): Array<CourseCalendarEntry> {
    return calendar.filter((event) => event.day === day);
  }

  /**
   * Formats an entry's times to be displayed in a better format.
   *
   * @param {CourseCalendarEntry} entry The entry to format.
   *
   * @returns {string} The formatted time.
   */
  function formatTime(entry: CourseCalendarEntry): string {
    if (!entry?.time) return "Desconocido";

    // Eliminate the seconds from the time.
    const starts = entry.time?.starts.split(":").slice(0, 2).join(":");
    const ends = entry.time?.ends.split(":").slice(0, 2).join(":");

    return `${starts} - ${ends}`;
  }

  /** Array that holds week days. */
  const weekDays = [
    {
      name: "Lunes",
      day: 1,
    },
    {
      name: "Martes",
      day: 2,
    },
    {
      name: "Miércoles",
      day: 3,
    },
    {
      name: "Jueves",
      day: 4,
    },
    {
      name: "Viernes",
      day: 5,
    },
  ];

  const [selectedDay, setSelectedDay] = useState(1);

  return (
    <Tabs
      variant="underlined"
      onSelectionChange={setSelectedDay as any}
      selectedKey={selectedDay}
      className="w-full"
    >
      {weekDays.map((day) => {
        // Fetch all events for the current day.
        const events = getEventsForDay(day.day);

        if (!events.length)
          return (
            <Tab key={day.day} title={day.name}>
              <h1 className="text-center text-foreground-300">
                No tienes clases este día.
              </h1>
            </Tab>
          );

        // Sort events by their starting time.
        events.sort((a, b) => {
          const aStarts = a.time!.starts.split(":")[0];
          const bStarts = b.time!.starts.split(":")[0];

          return parseInt(aStarts) - parseInt(bStarts);
        });

        return (
          <Tab key={day.day} title={day.name}>
            <div className="flex flex-col gap-2 sm:grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
              {events.map((event) => (
                <Card key={v4()}>
                  <CardHeader>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-2 items-center">
                        <AcademicIcon />
                        <h3 className="text-foreground">
                          {event.nombremateria}
                        </h3>
                      </div>
                      <h4 className="text-foreground-500 text-sm">
                        {event.docente}
                      </h4>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <div className="flex justify-between">
                      <h2 className="text-foreground-500 text-sm">
                        {formatTime(event)}
                      </h2>
                      <h2 className="text-foreground-500 text-sm">
                        Aula{" "}
                        <span className="font-semibold">
                          {event.aulaNombre}
                        </span>
                      </h2>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Tab>
        );
      })}
    </Tabs>
  );
}
