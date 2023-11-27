"use client";

import { usePollAnswerFlow } from "@/app/context/PollAnswerContext";
import { Button, Card, CardBody, CardHeader, Spinner } from "@nextui-org/react";
import SurveyQuestionRadius from "./SurveyQuestionRadius";
import { motion } from "framer-motion";
import { BackArrowIcon } from "../../Icons/BackArrowIcon";
import SurveyQuestionText from "./SurveyQuestionText";
import { RestartIcon } from "../../Icons/RestartIcon";
import { CheckIcon } from "../../Icons/CheckIcon";
import { useState } from "react";
import { AutogestionResponse } from "@/types/api/autogestion.http.wrapper";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

export default function MainSurveyFlow() {
  const {
    questions,
    originalQuestions,
    academicInfo,
    currentQuestion,
    answerQuestion,
    previousQuestion,
  } = usePollAnswerFlow();

  const current =
    currentQuestion !== -1 && questions ? questions[currentQuestion] : null;

  /**
   * Handler function that takes in a response from the user.
   *
   * @param {string} value The response from the user.
   * @param {'radius' | 'text'} type The type of question being answered.
   *
   * @returns {void}
   */
  function handleAnswer(value: string | number, type: "radius" | "text") {
    if (current === null) return;

    answerQuestion(current.id, type === "radius" ? +value : value);
  }

  /** State that controls if the survey is being submitted or not. */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /** If present, the error returned by the API. */
  const [submitError, setSubmitError] = useState<
    AutogestionResponse | undefined
  >(undefined);

  /**
   * Submits the entire poll to the server.
   *
   * @returns {void}
   */
  async function submitPoll(): Promise<void> {
    if (!originalQuestions) return;

    // Retrieve all the answers from the questions and map them to the original poll.
    const questionsCopy = { ...originalQuestions };
    for (const entry of questionsCopy.detalles) {
      // Search the answered question to copy their answer value.
      const answer = questions?.find((q) => q.id === entry.pregunta.id);

      if (!answer) continue;

      // Set the answer value.
      // If radius, set the numeric value minus 1 as per requisite on the API.
      entry["respuesta"] =
        answer.type === "radius" ? +answer.answer?.value! - 1 : 0;
      if (answer.type === "text")
        entry["opinion"] = (answer.answer?.value as string) ?? "";
    }

    // Set the loading state.
    setIsSubmitting(true);

    // Submit the poll.
    toast.promise(
      new Promise(async (res, rej) => {
        try {
          const { data } = await axios<any>({
            method: "PATCH",
            url: "/api/autogestion/polls/questions",
            data: questionsCopy,
          });

          res(data);
        } catch (e) {
          rej(e);
        }
      }),
      {
        pending: "Estamos enviando tus respuestas...",
        success: {
          render: ({ data }) => {
            // Redirect to the main page.
            setTimeout(() => {
              window.location.href = "/surveys";
            }, 1500);

            return "¡Gracias por participar!";
          },
        },
        error: {
          render: ({ data }) => {
            setIsSubmitting(false);
            setSubmitError(data as AutogestionResponse);

            return (data as AutogestionResponse).message;
          },
        },
      }
    );
  }

  return (
    <div className="w-full md:w-max md:m-auto px-4">
      <ToastContainer
        position="bottom-center"
        autoClose={3500}
        limit={2}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {questions?.length && academicInfo ? (
        <div className="w-full md:w-max flex flex-col gap-2">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Card>
              <CardBody>
                <div className="grid max-sm:grid-cols-3 md:flex md:justify-between gap-2">
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
            {current !== null ? (
              <Card>
                <CardHeader>
                  <div className="w-full">
                    {currentQuestion > 0 ? (
                      <div className="w-min h-min float-left absolute">
                        <span
                          className="cursor-pointer text-slate-500 md:hover:text-slate-300"
                          onClick={(e) => previousQuestion()}
                        >
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
            ) : (
              <Card>
                <CardBody>
                  <div className="flex flex-col gap-y-2 items-center mx-2">
                    <h2 className="text-center font-semibold text-foreground-600">
                      Estás casi terminando...
                    </h2>
                    <p className="text-center text-foreground-400">
                      Si estás conforme con tus respuestas, presiona el
                      siguiente botón para subir tu respuesta. Recuerda que una
                      vez confirmes tu encuesta <b>no puedes modificarla</b>.
                    </p>
                    <div className="flex gap-2 justify-between w-full">
                      <Button
                        color="danger"
                        variant="bordered"
                        startContent={<BackArrowIcon />}
                        onClick={() => previousQuestion()}
                      >
                        Volver
                      </Button>

                      <Button
                        color="success"
                        variant="bordered"
                        endContent={<CheckIcon />}
                        onClick={() => submitPoll()}
                      >
                        Finalizar
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
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
