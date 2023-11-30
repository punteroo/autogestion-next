import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import Autogestion from "autogestion-frvm";
import {
  AcademicStatusEntry,
  AvailableExam,
} from "autogestion-frvm/dist/types";
import { AcademicEntry } from "types/academic.entry";
import * as cors from "cors";

const corsHandler = cors({ origin: true });

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
        const result =
          /^No (?:regularizó|aprobó ni está inscripto a) ((?:[A-Za-z0-9 áóéíú]+ \(Elec\.\)|[A-Za-z0-9 áóéíú]+))(?: \(Ord\. [0-9]+\))?$/gm.exec(
            item
          )!;

        const course = result?.[1];

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

/**
 * Builds a client to serve Autogestion requests.
 *
 * @param {string} username The student's unique ID.
 * @param {string} hash The student's unique hash.
 *
 * @returns {Promise<Autogestion>} An authenticated client.
 */
async function buildClient(
  username: string,
  hash: string
): Promise<Autogestion> {
  const client = new Autogestion(username);

  await client.authenticate(hash);

  return client;
}

/**
 * Takes in the authorization header and returns the username and hash.
 *
 * @param {string} authorization The authorization header.
 *
 * @returns {[string, string]} The username and hash.
 */
function decodeToken(authorization: string): [string, string] {
  const token = authorization.split("Bearer ")[1];

  const [username, hash] = Buffer.from(token, "base64").toString().split(":");

  return [username, hash];
}

/**
 * New Firebase function to fetch a student's academic information without timing out.
 */
export const academic = onRequest(async (request, response) => {
  if (!["GET", "OPTIONS"].includes(request.method)) {
    response.status(403).send(`${request.method} is not allowed`);
    return;
  }

  corsHandler(request, response, async () => {
    // Decode the authorization token.
    const [username, hash] = decodeToken(request.headers.authorization ?? "");

    if (!username || !hash) {
      response.status(403).send("Invalid token");
      return;
    }

    // Build the autogestion client.
    try {
      const client = await buildClient(username, hash);

      // Fetch academic information from the student.
      const { detalles: academic } =
        await client.courses.student.academic.fetch();

      // Format the academic data.
      const formatted = formatAcademicData(academic);

      response.status(200).send(formatted);
    } catch (e: any) {
      logger.error(e);
      response
        .status(403)
        .send(e?.response?.data?.message ?? "Invalid credentials");
      return;
    }
  });
});

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
          // CourseStatus.APROBADA && CourseStatus.PROMOCIONADA
          ["2", "4"].includes(course.estado)
      )
    );
  } catch (e) {
    console.error(e);
    throw e;
  }
}

/**
 * New Firebase function to fetch a student's available exams without timing out.
 */
export const exams = onRequest(async (request, response) => {
  if (!["GET", "OPTIONS"].includes(request.method)) {
    response.status(403).send(`${request.method} is not allowed`);
    return;
  }

  corsHandler(request, response, async () => {
    // Decode the authorization token.
    const [username, hash] = decodeToken(request.headers.authorization ?? "");

    if (!username || !hash) {
      response.status(403).send("Invalid token");
      return;
    }

    // Build the autogestion client.
    try {
      const client = await buildClient(username, hash);

      // Fetch available exams for the student to take.
      const { materias: availableExams } =
        await client.exams.inscriptions.fetchAvailableExams();

      // Filter the list of available exams to only include the ones the student can actually take.
      const filteredExams = await parseAvailableExams(client, availableExams);

      response.status(200).send(filteredExams);
    } catch (e: any) {
      logger.error(e);
      response.status(403).send(e?.response?.data?.message ?? "Unknown error");
      return;
    }
  });
});
