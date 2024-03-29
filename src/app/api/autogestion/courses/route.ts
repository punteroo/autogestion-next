import { UserSession } from "@/lib/types/auth.types";
import { buildClient } from "../client.wrapper";
import { NextResponse } from "next/server";
import { auth } from "@/app/auth";

export async function GET(request: Request): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Read the query parameters.
      const params = new URL(request.url).searchParams;

      switch (params.get("type")) {
        case "current": {
          const { detalles: courses } =
            await client.courses.student.fetchActive();

          return NextResponse.json([...courses]);
        }
        case "historic": {
          const { detalles: courses } =
            await client.courses.student.fetchHistoric();

          return NextResponse.json([...courses]);
        }
      }
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.error();
}

export const dynamic = "force-dynamic";
