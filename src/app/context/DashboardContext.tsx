'use client';

import { ClientSection } from "autogestion-frvm/client";
import { createContext, useState } from "react";

type DashboardContextType = {
  /** Available sections fetched at the apps' init. */
  sections: Array<ClientSection>;

  /** A state setter for updating the sections list. */
  setSections: React.Dispatch<React.SetStateAction<Array<ClientSection>>>;
};

export const DashboardContext = createContext<DashboardContextType>({
  sections: [],
  setSections: () => {},
});

export function DashboardContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState<Array<ClientSection>>([]);

  return (
    <DashboardContext.Provider value={{ sections, setSections }}>
      {children}
    </DashboardContext.Provider>
  );
}
