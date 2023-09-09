import { AvailableExam, ExamTurn, ExamTurnTime } from "autogestion-frvm/types";

export interface ExamInscriptionRequest {
  /** The exam the student is trying to enroll. */
  exam: AvailableExam;

  /** The turn the student is trying to enroll to. */
  turn: ExamTurn;

  /** The turn selected by the student. */
  turnTime: ExamTurnTime;
}
