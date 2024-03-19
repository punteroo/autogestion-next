import { NextRequest, NextResponse } from "next/server";
import { buildClient } from "../../../client.wrapper";
import { auth } from "@/app/auth";
import { UserSession } from "@/lib/types/auth.types";
import { AvailableCourse } from "autogestion-frvm/types";

export async function GET(
  request: NextRequest
): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Obtain query parameters.
      const query = request.nextUrl.searchParams;
      const courseParam = query.get("course");

      if (!courseParam) throw new Error('Missing query parameter "course".');

      // Try to parse the course parameter from Base64
      const course: AvailableCourse = JSON.parse(
        Buffer.from(courseParam, "base64").toString()
      );

      // Fetch available commissions for provided course.
      const { comisiones } = await client.courses.inscription.fetchCommissions(
        course
      );

      return NextResponse.json([...comisiones]);
    }

    return NextResponse.json([]);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message }, { status: 500 });
  }
}
