import { UserSession, auth } from "../../auth/[...nextauth]/route";
import { buildClient } from "../client.wrapper";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and send sections.
      const client = await buildClient(session?.user as UserSession);

      const sections = await client.sections.fetchAll();

      return NextResponse.json(sections);
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.error();
}

export const dynamic = "force-dynamic";
