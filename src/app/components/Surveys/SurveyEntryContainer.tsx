"use client";

import { Card } from "@nextui-org/react";

export default function SurveyEntryContainer({
  name,
  children,
}: {
  name: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="w-full md:w-[65%] p-4">
      <h2 className="my-4 text-base font-semibold text-center">
        {name}
      </h2>
      <div className="items-center justify-center flex flex-col md:grid md:grid-flow-col md:auto-cols-max gap-4">
        {children}
      </div>
    </Card>
  );
}
