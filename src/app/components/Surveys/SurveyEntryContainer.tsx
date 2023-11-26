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
    <Card className="w-full md:mx-auto p-4">
      <h2 className="my-4 text-base font-semibold text-center">
        {name}
      </h2>
      <div className="items-center justify-center flex max-md:flex-col md:grid xl:grid-cols-3 md:grid-cols-2 gap-4">
        {children}
      </div>
    </Card>
  );
}
