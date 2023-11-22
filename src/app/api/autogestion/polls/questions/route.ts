import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { buildClient } from "../../client.wrapper";
import { PollEntry } from "autogestion-frvm/types";

export async function POST(req: NextRequest): Promise<any> {
  // Is the user authenticated?
  const session = await auth();

  if (!session.user) return NextResponse.error();

  // Build the client.
  const client = await buildClient(session.user);

  // Fetch the poll's questions.
  const entry: PollEntry = await req.json();

  const questions = await client.polling.available.questions(entry);

  // Redact sensitive information about the teachers.
  delete questions.persona.email;
  delete questions.persona.telefono;
  delete questions.persona.telefonoInternacional;
  questions.persona.documento = 0;

  return NextResponse.json(questions);
}
