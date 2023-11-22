"use client";

import {
  PollAnswerFlowProvider,
  usePollAnswerFlow,
} from "@/app/context/PollAnswerContext";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import { PollEntry } from "autogestion-frvm/types";
import SurveyQuestionRadius from "./SurveyQuestionRadius";
import { motion } from "framer-motion";
import BackArrowIcon from "../../Icons/BackArrowIcon";
import SurveyQuestionText from "./SurveyQuestionText";
import RestartIcon from "../../Icons/RestartIcon";
import { redirect } from "next/navigation";

type SurveyFlowProps = {
  poll: PollEntry;
};

export default function MainSurveyFlow() {
  const {
    questions,
    academicInfo,
    currentQuestion,
    answerQuestion,
    previousQuestion,
  } = usePollAnswerFlow();

  if (!questions) return;

  const current = questions[currentQuestion];

  /**
   * Handler function that takes in a response from the user.
   *
   * @param {string} value The response from the user.
   * @param {'radius' | 'text'} type The type of question being answered.
   *
   * @returns {void}
   */
  function handleAnswer(value: string | number, type: "radius" | "text") {
    answerQuestion(current.id, type === "radius" ? +value : value);
  }

  return (
    <div className="w-full px-4">
      {questions?.length && academicInfo ? (
        <div className="w-full flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Card>
              <CardBody>
                <div className="grid grid-cols-3 gap-2 w-full">
                  <div className="flex flex-col gap-1 items-start justify-center col-span-2">
                    <h4 className="text-small font-semibold leading-none text-default-600">
                      {academicInfo.persona.apellido?.toUpperCase()},{" "}
                      {academicInfo.persona.nombre?.toUpperCase()}
                    </h4>
                    <h5 className="text-small font-normal leading-none text-default-500">
                      {academicInfo.asignatura.nombre}
                    </h5>
                  </div>
                  <div className="align-self-right">
                    <Button
                      color="danger"
                      variant="bordered"
                      startContent={<RestartIcon />}
                      onClick={() => {
                        window.location.href = "/surveys";
                      }}
                    >
                      Volver
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>

          <motion.div
            key={currentQuestion}
            initial={{
              opacity: 0,
              y: 100,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card>
              <CardHeader>
                <div className="w-full">
                  {currentQuestion > 0 ? (
                    <div className="w-min h-min text-slate-500 float-left absolute">
                      <span onClick={(e) => previousQuestion()}>
                        <BackArrowIcon />
                      </span>
                    </div>
                  ) : null}
                  <div className="w-full text-center flex flex-col gap-y-1">
                    <h2 className="text-slate-800 text-3xl">
                      #{current.order}
                    </h2>
                    <h3 className="font-semibold text-sm text-slate-500">
                      {current.question}
                    </h3>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-col mx-2">
                  <p className="text-sm text-slate-700 text-center">
                    {current.type === "radius"
                      ? "¿Qué tan eficiente fue el docente en este aspecto?"
                      : "Escribe con tus palabras lo que piensas sobre el docente en este aspecto."}
                  </p>
                  <div className="flex flex-col gap-2 py-4 w-full items-center">
                    {current.type === "text" ? (
                      <SurveyQuestionText
                        handleCompletion={handleAnswer}
                        defaultAnswer={
                          (current?.answer?.value as string) ?? undefined
                        }
                      />
                    ) : (
                      <SurveyQuestionRadius
                        handleSelection={handleAnswer}
                        defaultAnswer={
                          (current?.answer?.value as number) ?? undefined
                        }
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        </div>
      ) : (
        <Card className="w-[95%]">
          <CardBody>
            <div className="flex gap-x-2 items-center">
              <Spinner color="primary" />
              <h2 className="text-center font-semibold text-foreground-300">
                Cargando preguntas...
              </h2>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
