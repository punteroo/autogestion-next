import { auth } from "@/app/auth";
import { NextResponse } from "next/server";
import { buildClient } from "../../client.wrapper";
import { UserSession } from "@/lib/types/auth.types";

export async function GET(req: Request): Promise<NextResponse | Response> {
  // Fetch the user session.
  const session = await auth();

  if (!session || !session.user) return NextResponse.redirect("/login");

  // Fetch the course calendar from the client.
  const client = await buildClient(session?.user as UserSession);

  try {
    const schedule = await client.calendar.fetch();

    // Has the raw parameter been passed?
    const params = new URL(req.url).searchParams;

    if (params.has("raw", "true")) return NextResponse.json(schedule);

    // Format the entries and return them back.
    const uniqueEntries = schedule.filter((entry, index, self) => {
      const date = new Date(entry.fechaInicio);
      const day = date.getDay();

      // Is this entry from this year?
      //if (date.getFullYear() < new Date().getFullYear()) return false;

      return (
        self.findIndex(
          (e) =>
            e.nombremateria === entry.nombremateria &&
            new Date(e.fechaInicio).getDay() === day
        ) === index
      );
    });

    // Sort the entries by course name.
    uniqueEntries.sort((a, b) =>
      a.nombremateria.localeCompare(b.nombremateria)
    );

    // Use fechaInicio and fechaFin to get the day and time the course takes place.
    uniqueEntries.forEach((entry: any) => {
      const date = new Date(entry.fechaInicio);

      entry["day"] = date.getDay();

      // Force the time to be in GMT-3.
      entry["time"] = {
        starts: new Date(entry.fechaInicio).toLocaleTimeString("es-AR", {
          timeZone: "America/Argentina/Cordoba",
        }),
        ends: new Date(entry.fechaFin).toLocaleTimeString("es-AR", {
          timeZone: "America/Argentina/Cordoba",
        }),
      };

      delete entry.fechaInicio;
      delete entry.fechaFin;
    });

    return NextResponse.json(uniqueEntries);
  } catch (e) {
    console.error(e);
  }

  return NextResponse.error();
}
