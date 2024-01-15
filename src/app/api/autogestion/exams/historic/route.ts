import { UserSession } from "@/lib/types/auth.types";
import { auth } from "@/app/auth";
import { buildClient } from "../../client.wrapper";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Fetch the historic exams from the student.
      const { detalles: exams } = await client.exams.taken.fetch();

      return NextResponse.json([...exams]);
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.error();
}

export const dynamic = "force-dynamic";
