import {
  RadioGroup,
  Radio,
  useRadio,
  VisuallyHidden,
  cn,
} from "@nextui-org/react";
import { MultiStarIcon } from "../../Icons/StarIcon";
import { useState } from "react";

export const CustomRadio = (props: any) => {
  const {
    Component,
    children,
    isSelected,
    description,
    getBaseProps,
    getWrapperProps,
    getInputProps,
    getLabelProps,
    getLabelWrapperProps,
    getControlProps,
  } = useRadio(props);

  return (
    <Component
      {...getBaseProps()}
      className={cn(
        "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
        "max-w-[300px] cursor-pointer border-2 border-default rounded-lg gap-4 p-4",
        "data-[selected=true]:border-primary"
      )}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <span {...getWrapperProps()}>
        <span {...getControlProps()} />
      </span>
      <div {...getLabelWrapperProps()}>
        {children && <span {...getLabelProps()}>{children}</span>}
        {description && (
          <span className="text-small text-foreground opacity-70">
            {description}
          </span>
        )}
      </div>
    </Component>
  );
};

type SurveyQuestionRadius = {
  handleSelection: (value: string, type: "radius") => void;
  defaultAnswer?: number;
};

export default function SurveyQuestionRadius({
  handleSelection,
  defaultAnswer,
}: SurveyQuestionRadius) {
  const [disabled, setDisabled] = useState<boolean>(false);

  return (
    <RadioGroup
      onValueChange={(value) => {
        setDisabled(true);

        setTimeout(() => handleSelection(value, "radius"), 75);
      }}
      defaultValue={defaultAnswer?.toString()}
      isDisabled={disabled}
    >
      <CustomRadio description="Horrible" value="1">
        <MultiStarIcon amount={1} color="text-red-500" />
      </CustomRadio>
      <CustomRadio description="Malo" value="2">
        <MultiStarIcon amount={2} color="text-red-300" />
      </CustomRadio>
      <CustomRadio description="Regular" value="3">
        <MultiStarIcon amount={3} color="text-orange-300" />
      </CustomRadio>
      <CustomRadio description="Bueno" value="4">
        <MultiStarIcon amount={4} color="text-green-300" />
      </CustomRadio>
      <CustomRadio description="Excelente" value="5">
        <MultiStarIcon amount={5} color="text-green-500" />
      </CustomRadio>
    </RadioGroup>
  );
}
