"use client";

import {
  PollAcademicInfo,
  PollFlowData,
} from "@/types/autogestion/autogestion.poll.flow";
import { PollEntry, PollQuestions } from "autogestion-frvm/types";
import axios from "axios";
import {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type PollAnswerFlowType = {
  /** An array of sorted questions by group. */
  questions?: PollFlowData;

  /** State setter for the current flow's questions. */
  setQuestions: React.Dispatch<React.SetStateAction<PollFlowData>>;

  /** Answers a specific question by its ID. */
  answerQuestion: (questionId: number, answer: string | number) => void;

  /** Rolls back to the previous question. */
  previousQuestion: () => void;

  /** Resets the entire poll. */
  resetPoll: () => void;

  /** State that holds teacher and course information about the poll. */
  academicInfo?: PollAcademicInfo;

  /** State that indicates the current question being answered. */
  currentQuestion: number;
};

export const PollAnswerFlowContext = createContext<PollAnswerFlowType>({
  questions: [],
  setQuestions: (value: SetStateAction<PollFlowData>): void => {},
  answerQuestion: (questionId: number, answer: string | number) => {},
  previousQuestion: () => {},
  resetPoll: () => {},
  academicInfo: undefined,
  currentQuestion: 0,
});

export function usePollAnswerFlow() {
  return useContext(PollAnswerFlowContext);
}

export function PollAnswerFlowProvider({
  children,
  poll,
}: {
  children: React.ReactNode;
  poll: PollEntry;
}) {
  /** An array of sorted questions by group. */
  const [questions, setQuestions] = useState<PollFlowData>([]);

  const [currentQuestion, setCurrentQuestion] = useState<number>(0);

  const [academicInfo, setAcademicInfo] = useState<PollAcademicInfo>();

  function resetPoll() {
    // Go back to the initial question.
    setCurrentQuestion(0);

    // Reset the answers.
    for (const question of questions) delete question.answer;

    // Update the questions.
    setQuestions(questions);
  }

  function previousQuestion() {
    // Go back to the previous question.
    setCurrentQuestion(currentQuestion - 1);
  }

  function answerQuestion(questionId: number, answer: string | number) {
    // Update the question's answer.
    const question = questions.find((q) => q.id === questionId);

    if (!question) return;

    question["answer"] = {
      value: answer,
      lastModified: new Date().toISOString(),
    };

    // Update the questions.
    setQuestions(questions);

    // Go to the next question.
    setCurrentQuestion(currentQuestion + 1);
  }

  useEffect(() => {
    async function fetchAndFormatQuestions(): Promise<void> {
      try {
        // Search the API for the poll's questions.
        const { data } = await axios<PollQuestions>({
          method: "POST",
          url: `/api/autogestion/polls/questions`,
          data: poll,
        });

        console.log(data.detalles);

        // Extract academic information from teachers.
        const academicInfo: PollAcademicInfo = {
          persona: data.persona,
          asignatura: data.asignatura,
        };

        setAcademicInfo(academicInfo);

        // Format the questions.
        const questions: PollFlowData = [];

        // Sort all questions based on the `question.id.ordenPrecedencia` property.
        const sortedQuestions = data.detalles.sort(
          (a, b) => a.id.ordenPrecedencia - b.id.ordenPrecedencia
        );

        // Map the questions to the flow data style.
        for (const question of sortedQuestions) {
          const { pregunta } = question;

          questions.push({
            id: pregunta.id,
            type: pregunta.tipoPregunta.nombre,
            order: question.id.ordenPrecedencia,
            question: pregunta.pregunta,
          });
        }

        // Update the questions.
        setQuestions(questions);
      } catch (e) {
        console.error(
          `Failed to fetch questions for poll ${JSON.stringify(poll)}: ${e}`
        );
        throw e;
      }
    }

    if (!questions || !questions?.length) fetchAndFormatQuestions();
  }, [questions, poll]);

  return (
    <PollAnswerFlowContext.Provider
      value={{
        questions,
        setQuestions,
        answerQuestion,
        previousQuestion,
        resetPoll,
        academicInfo,
        currentQuestion,
      }}
    >
      {children}
    </PollAnswerFlowContext.Provider>
  );
}
