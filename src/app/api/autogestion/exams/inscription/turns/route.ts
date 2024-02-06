import { auth } from "@/app/auth";
import { buildClient } from "../../../client.wrapper";
import { NextRequest, NextResponse } from "next/server";
import { UserSession } from "@/lib/types/auth.types";

export async function GET(
  request: NextRequest
): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Parse the query parameters.
      const query = request.nextUrl.searchParams;
      const courseId = query.get("courseId");
      const specialty = query.get("specialty");
      const plan = query.get("plan");

      if (!courseId || !specialty || !plan)
        throw new Error("Missing query parameters.");

      console.log(`Fetching turns for ${courseId} ${specialty} ${plan}`);

      // Fetch available exams for the student to take.
      const { detalles: turns } =
        await client.exams.inscriptions.fetchTurnsForExam(
          specialty,
          plan,
          courseId
        );

      return NextResponse.json([...turns]);
    }
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message }, { status: 500 });
  }

  return NextResponse.error();
}

export const dynamic = "force-dynamic";
