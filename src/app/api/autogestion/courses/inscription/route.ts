import {
  AvailableCourse,
  AvailableCourseCommission,
} from "autogestion-frvm/types";
import { auth } from "@/app/auth";
import { buildClient } from "../../client.wrapper";
import { NextRequest, NextResponse } from "next/server";
import {
  AutogestionError_InvalidRequest,
  AutogestionError_NotLoggedIn,
} from "@/objects/autogestion.api.constants";
import { UserSession } from "@/lib/types/auth.types";

export async function GET(request: Request): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Fetch available courses for the student to enroll in.
      const { materias } = await client.courses.inscription.fetchAvailable();

      return NextResponse.json([...materias]);
    }

    return NextResponse.json([]);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message }, { status: 500 });
  }
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

    // Build a new client.
    const client = await buildClient(session?.user as UserSession);

    // Parse the request body.
    const body: {
      course: AvailableCourse;
      commission: AvailableCourseCommission;
    } = await request.json();

    if (!body.course || !body.commission)
      return NextResponse.json(
        { message: AutogestionError_InvalidRequest.message },
        { status: AutogestionError_InvalidRequest.code }
      );

    // Enroll the student to the course.
    const enrollment = await client.courses.inscription.enroll(
      body.course,
      body.commission
    );

    // Map the enrollment data to the old course payload.
    const course: Partial<AvailableCourse> = { ...body.course };
    course.especialidadHomogenea = body.commission.especialidad;
    course.materiaHomogenea = body.commission.materia;
    course.planHomogenea = body.commission.plan;
    course.comisionActual = body.commission.comision;
    course.cursoActual = body.commission.curso;
    course.horarioCursado = enrollment.cursado.horario;
    course.checksum = enrollment.cursado.checksum;
    course.edificio = enrollment.cursado.edificio;

    return NextResponse.json({ enrollment, course });
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
    const body: AvailableCourse = await request.json();

    if (!body)
      return NextResponse.json(
        { message: AutogestionError_InvalidRequest.message },
        { status: AutogestionError_InvalidRequest.code }
      );

    // Unenroll the student from the course.
    await client.courses.inscription.unenroll(body);

    // Remove inscription data from the original course.
    const course: Partial<AvailableCourse> = { ...body };
    course.especialidadHomogenea = "0";
    course.materiaHomogenea = "0";
    course.planHomogenea = "0";
    course.comisionActual = "";
    course.cursoActual = null;
    course.horarioCursado = null;
    course.checksum = null;
    course.edificio = null;

    return NextResponse.json({ message: "OK", course });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ message: e?.message }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
