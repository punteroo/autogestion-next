import { CourseStatus } from "autogestion-frvm/courses";
import { AcademicStatusEntry } from "autogestion-frvm/types";

/**
 * A better formatted academic entry for consumption within the app.
 *
 * @interface
 */
export interface AcademicEntry {
  id: number;

  name: string;

  plan: number;

  level: number;

  status: AcademicStatusEntry["estadoMateria"] | "PROMOCIONADA";

  grade: number;

  abscenses: Array<string>;

  passPending: Array<Omit<AcademicEntry, "passPending" | "regularizePending">>;

  regularizePending: Array<
    Omit<AcademicEntry, "passPending" | "regularizePending">
  >;
}
