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
    <Card className="w-full p-4">
      <h2 className="my-4 text-base font-semibold text-center">
        {name}
      </h2>
      <div className="flex flex-col items-center justify-center gap-4">
        {children}
      </div>
    </Card>
  );
}
