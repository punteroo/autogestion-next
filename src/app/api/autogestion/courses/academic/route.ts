import { AcademicStatusEntry } from "autogestion-frvm/types";
import { auth } from "@/app/auth";
import { buildClient } from "../../client.wrapper";
import { NextResponse } from "next/server";
import { AcademicEntry } from "@/types/api/academic.entry";
import { UserSession } from "@/lib/types/auth.types";
import { StudentCourses } from "autogestion-frvm/courses";

// NOTE: This is PURELY for the Vercel deployment. Remove this when on development.
// export const runtime = 'edge';

/**
 * Splits the list of pending courses from the original string and exposes a list of names.
 *
 * @param {string} originalString The original string to parse.
 *
 * @returns {Array<string>} The list of pending courses in any of both contexts.
 */
function splitAndExtractCourseNames(originalString: string): string[] {
  // Split the original to obtain a list.
  const list = originalString.split("\n");

  // Match with regex each course name.
  if (list.length > 0) {
    const courses = [];
    for (const item of list) {
      if (
        /^No (?:regularizó|aprobó ni está inscripto a) ((?:[A-Za-z0-9 áóéíú]+ \(Elec\.\)|[A-Za-z0-9 áóéíú]+))(?: \(Ord\. [0-9]+\))?$/gm.test(
          item
        )
      ) {
        const [original, course] =
          /^No (?:regularizó|aprobó ni está inscripto a) ((?:[A-Za-z0-9 áóéíú]+ \(Elec\.\)|[A-Za-z0-9 áóéíú]+))(?: \(Ord\. [0-9]+\))?$/gm.exec(
            item
          )!;

        if (course) courses.push(course);
      }
    }

    return courses;
  }

  return [];
}

/**
 * Iterates over a list of course names and creates an academic entry for each one.
 *
 * @param {Array<AcademicStatusEntry>} academic The academic data from the student, in raw format.
 * @param {Array<string>} courses The list of courses to iterate over.
 *
 * @returns {Array<AcademicEntry>} The formatted academic data.
 */
function iterateOverCourses(
  academic: Array<AcademicStatusEntry>,
  courses: Array<string>
): Array<AcademicEntry> {
  // Create a new array to store the formatted academic data.
  const formatted: Array<AcademicEntry> = [];

  for (const course of courses) {
    // Search for each course name and map it to a new object with course data.
    const entry = academic.find((entry) => entry.nombreMateria === course);

    if (entry) {
      const {
        codigoMateria,
        nombreMateria,
        plan,
        nivel,
        nota,
        estadoMateria,
        faltasInjustificadas,
        faltasJustificadas,
      } = entry;

      formatted.push({
        id: parseInt(codigoMateria),
        name: nombreMateria,
        plan: parseInt(plan),
        level: parseInt(nivel),
        status: estadoMateria,
        grade: parseFloat(nota),
        abscenses: [...faltasInjustificadas, ...faltasJustificadas],
        passPending: [],
        regularizePending: [],
      });
    }
  }

  return formatted;
}

/**
 * Formats the academic data from the student to better suit the frontend.
 *
 * @param {Array<AcademicStatusEntry>} academic The academic data from the student.
 *
 * @returns {Array<AcademicEntry>} The formatted academic data.
 */
function formatAcademicData(
  academic: Array<AcademicStatusEntry>
): Array<AcademicEntry> {
  // Create a new array to store the formatted academic data.
  const formatted: Array<AcademicEntry> = [];

  for (const entry of academic) {
    // Destructure data from the entry.
    const {
      codigoMateria,
      nombreMateria,
      plan,
      nivel,
      nota,
      estadoMateria,
      estado,
      faltaReg,
      faltaAprobar,
      faltasInjustificadas,
      faltasJustificadas,
    } = entry;

    // Parse the list of pending courses for each entry.
    const passPendingList = faltaAprobar
        ? splitAndExtractCourseNames(faltaAprobar)
        : [],
      regularizePendingList = faltaReg
        ? splitAndExtractCourseNames(faltaReg)
        : [];

    // Search for each course name and map it to a new object with course data.
    const passPending = iterateOverCourses(academic, passPendingList),
      regularizePending = iterateOverCourses(academic, regularizePendingList);

    // Change the custom status for promotion if present within the entry's status string,
    const result = estado?.length
      ? /[A|a]p\. Directa en ([0-9]{4})/g.exec(estado)
      : [undefined, undefined];

    const isPromoted = result !== null && result?.[1]?.length;

    // Construct the formatted entry.
    const formattedEntry: AcademicEntry = {
      id: parseInt(codigoMateria),
      name: nombreMateria,
      plan: parseInt(plan),
      level: parseInt(nivel),
      status: isPromoted ? "PROMOCIONADA" : estadoMateria,
      grade: nota?.length ? parseFloat(nota) : -1,
      abscenses: [...faltasInjustificadas, ...faltasJustificadas],
      passPending,
      regularizePending,
    };

    // Push the formatted entry to the array.
    formatted.push(formattedEntry);
  }

  return formatted;
}

export async function GET(request: Request): Promise<NextResponse | Response> {
  try {
    // Fetch the user session.
    const session = await auth();

    if (session?.user) {
      // Build a new client and fetch current courses.
      const client = await buildClient(session?.user as UserSession);

      // Fetch the academic data from the student.
      const { detalles: academic } = await (
        client.courses.student as StudentCourses
      ).academic.fetch();

      // Format the academic data.
      const formatted = formatAcademicData(academic);

      // Return the academic data.
      return NextResponse.json([...formatted]);
    }
  } catch (e) {
    console.error(e);
  }

  return NextResponse.error();
}

export const dynamic = "force-dynamic";
