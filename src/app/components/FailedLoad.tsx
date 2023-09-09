"use client";

import { Chip, Button } from "@nextui-org/react";

type FailedLoadProps = {
  message: string;

  /** State change functions for loading and failed controllers. */
  stateChanges: {
    isLoading: (value: boolean) => void;
    hasFailed: (value: boolean) => void;
  };
};

export default function FailedLoad({ message, stateChanges }: FailedLoadProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 gap-y-4 text-center">
      <Chip color="danger" className="text-sm">
        ¡Oops!
      </Chip>
      <h3 className="text-sm font-semibold text-foreground-300">{message}</h3>
      <Button
        variant="flat"
        color="secondary"
        onClick={() => {
          stateChanges.isLoading(true);
          stateChanges.hasFailed(false);
        }}
      >
        Reintentar
      </Button>
    </div>
  );
}
