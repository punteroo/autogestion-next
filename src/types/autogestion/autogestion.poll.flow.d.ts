import { PollQuestions } from "autogestion-frvm/types";

export type PollFlowData = Array<PollFlowQuestion>;

export type PollFlowQuestion = {
  /** An unique identifier for this question. */
  id: number;

  /** The type of response field this question has. */
  type: "text" | "radius";

  /** Specific question order index. */
  order: number;

  /** The specific question being asked. */
  question: string;

  /** An object that stores metadata about the provided answer. */
  answer?: {
    /** The answer's value. */
    value: string | number;

    /** ISO8601 timestamp for when it was last modified. */
    lastModified: string;
  };
};

export type PollAcademicInfo = Pick<PollQuestions, "persona" | "asignatura">;
