import { Textarea } from "@nextui-org/react";
import { useState } from "react";

type SurveyQuestionTextProps = {
  handleCompletion: (value: string, type: "text") => void;
  defaultAnswer?: string;
};

export default function SurveyQuestionText({
  handleCompletion,
  defaultAnswer,
}: SurveyQuestionTextProps) {
  const [value, setValue] = useState(defaultAnswer);

  return (
    <Textarea
      variant="underlined"
      label="Respuesta"
      labelPlacement="outside"
      description="Presione ENTER para guardar la respuesta. Recuerda que no es obligatorio."
      value={value}
      onValueChange={setValue}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();

          handleCompletion(value ?? "", "text");
        }
      }}
    />
  );
}
