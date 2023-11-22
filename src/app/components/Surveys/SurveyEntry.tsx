"use client";

import {
  Card,
  CardHeader,
  Avatar,
  Divider,
  CardBody,
  Button,
} from "@nextui-org/react";
import { DocumentCheckIcon } from "../Icons/DocumentCheckIcon";
import { WriteIcon } from "../Icons/WriteIcon";
import { CheckIcon } from "../Icons/CheckIcon";
import Link from "next/link";
import NextLinkWrapper from "../Utility/NextLinkWrapper";
import { PollEntry } from "autogestion-frvm/types";

type SurveyEntryProps = {
  firstName: string;
  lastName: string;
  course: string;
  role: string;
  isDone: boolean;
  entry?: PollEntry;
};

export default function SurveyEntry({
  firstName,
  lastName,
  course,
  role,
  isDone,
  entry,
}: SurveyEntryProps) {
  return (
    <Card className="w-full">
      <CardHeader className="justify-between">
        <div className="flex gap-5">
          <Avatar isBordered radius="full" size="md" src="/avatar.jpg" />
          <div className="flex flex-col gap-1 items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {lastName?.toUpperCase()}, {firstName?.toUpperCase()}
            </h4>
            <h5 className="text-small font-normal leading-none text-default-500">
              {course} - {role}
            </h5>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        {isDone ? (
          <Button
            color="success"
            variant="bordered"
            isDisabled
            startContent={<CheckIcon />}
          >
            Encuesta Realizada
          </Button>
        ) : (
          <NextLinkWrapper disabled={isDone} href="/surveys/flow" data={entry}>
            <Button
              className="w-full"
              color="primary"
              variant="bordered"
              isDisabled={isDone}
              startContent={<WriteIcon />}
            >
              Realizar Encuesta
            </Button>
          </NextLinkWrapper>
        )}
      </CardBody>
    </Card>
  );
}
