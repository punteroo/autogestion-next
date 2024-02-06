import { UserSession } from "@/lib/types/auth.types";
import { auth } from "@/app/auth";
import { buildClient } from "../client.wrapper";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Fetch available polls.
      const polls = await client.polling.available.fetch();

      // Redact sensitive information about the teachers.
      for (const poll of polls) {
        delete poll.persona.email;
        delete poll.persona.telefono;
        delete poll.persona.telefonoInternacional;
        poll.persona.documento = 0;
        poll.persona.docente = null;
      }

      return NextResponse.json([...polls]);
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.error();
}

export const dynamic = "force-dynamic";
