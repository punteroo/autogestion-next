import { AvailableExam } from "autogestion-frvm/types";
import { UserSession, auth } from "../../../auth/[...nextauth]/route";
import { buildClient } from "../../client.wrapper";
import { NextRequest, NextResponse } from "next/server";
import Autogestion from "autogestion-frvm";
import { CourseStatus } from "autogestion-frvm/courses";
import {
  AutogestionError_InvalidRequest,
  AutogestionError_NotLoggedIn,
} from "@/objects/autogestion.api.constants";
import { ExamInscriptionRequest } from "@/types/api/exam.inscription.request";

/**
 * Takes the list of available exams and compares it with the list of exams the student can actually take.
 *
 * @param {Autogestion} client The client to use to fetch the list of exams the student can take.
 * @param {Array<AvailableExam>} availableExams The list of available exams.
 *
 * @returns {Array<AvailableExam>} The list of exams the student can actually take.
 */
async function parseAvailableExams(
  client: Autogestion,
  availableExams: Array<AvailableExam>
): Promise<Array<AvailableExam>> {
  try {
    // Search for the student's current courses.
    const { detalles } = await client.courses.student.fetchHistoric();

    // Compare the list of available exams with the list of courses the student had taken in the past.
    // If the student has taken the course, and the course's status is either "PROMOCIONADO" or "REGULAR" then the student can take the exam.
    return availableExams.filter((exam) =>
      detalles.find(
        (course) =>
          course.materia.codigoAcademico === exam.materia.codigoAcademico &&
          [CourseStatus.APROBADA, CourseStatus.PROMOCIONADA].includes(
            course.estado as CourseStatus
          )
      )
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function GET(request: Request): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Fetch available exams for the student to take.
      const { materias: availableExams } =
        await client.exams.inscriptions.fetchAvailableExams();

      // Filter the list of available exams to only include the ones the student can actually take.
      const filteredExams = await parseAvailableExams(client, availableExams);

      return NextResponse.json([...filteredExams]);
    }
  } catch (e) {
    console.error(e);
    throw e;
  }

  return NextResponse.error();
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Is this a logged in user?
    const session = await auth();

    if (!session?.user)
      return NextResponse.json(
        { message: AutogestionError_NotLoggedIn.message },
        { status: AutogestionError_NotLoggedIn.code }
      );

    // Build a new client and fetch current courses.
    const client = await buildClient(session?.user as UserSession);

    // Parse the request body.
    const body: ExamInscriptionRequest = await request.json();

    if (!body.exam || !body.turn || !body.turnTime)
      return NextResponse.json(
        { message: AutogestionError_InvalidRequest.message },
        { status: AutogestionError_InvalidRequest.code }
      );

    // Enroll the student to the exam.
    const enrollment = await client.exams.inscriptions.enroll(
      body.exam,
      body.turn,
      body.turnTime
    );

    return NextResponse.json(enrollment);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    // Is this a logged in user?
    const session = await auth();

    if (!session?.user)
      return NextResponse.json(
        { message: AutogestionError_NotLoggedIn.message },
        { status: AutogestionError_NotLoggedIn.code }
      );

    // Build a new client and fetch current courses.
    const client = await buildClient(session?.user as UserSession);

    // Parse the request body.
    const body: AvailableExam = await request.json();

    if (!body)
      return NextResponse.json(
        { message: AutogestionError_InvalidRequest.message },
        { status: AutogestionError_InvalidRequest.code }
      );

    // Unenroll the student from the exam.
    await client.exams.inscriptions.voidEnrollment(body);

    return NextResponse.json({ message: "OK" });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const dynamic = "force-dynamic";
