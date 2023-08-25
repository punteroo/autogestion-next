"use client";

import { Avatar, Card, CardBody, CardHeader, Divider } from "@nextui-org/react";

export default function SurveysPanel() {
  return (
    <div className="flex flex-col items-center justify-center mx-4 gap-4">
      <h1 className="my-4 text-xl font-bold">Encuestas Docentes</h1>
      <Card className="w-full">
        <CardHeader className="justify-between">
          <div className="flex gap-5">
            <Avatar isBordered radius="full" size="md" src="/avatar.jpg" />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">
                PEREYRA, ALEJANDRO
              </h4>
              <h5 className="text-small font-normal leading-none text-default-500">
                Economía - Titular
              </h5>
            </div>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>

        </CardBody>
      </Card>
    </div>
  );
}
