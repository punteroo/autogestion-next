import { UserSession, auth } from "../../../auth/[...nextauth]/route";
import { buildClient } from "../../client.wrapper";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();
  
    console.log(session);

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Fetch the academic data from the student.
      const { detalles: academic } =
        await client.courses.student.academic.fetch();

      // Return the academic data.
      return NextResponse.json([...academic]);
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.error();
}

export const dynamic = "force-dynamic";
