"use client";

import { ClientSection } from "autogestion-frvm/client";
import { createContext, useContext, useState } from "react";

type DashboardContextType = {
  /** Available sections fetched at the apps' init. */
  sections: Array<ClientSection>;

  /** A state setter for updating the sections list. */
  setSections: React.Dispatch<React.SetStateAction<Array<ClientSection>>>;

  /** Checks if the specified section name exists and is enabled. */
  isSectionEnabled: (sectionName: string) => boolean;
};

export const DashboardContext = createContext<DashboardContextType>({
  sections: [],
  setSections: () => {},
  isSectionEnabled: () => false,
});

export function useDashboard() {
  return useContext(DashboardContext);
}

export function DashboardContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sections, setSections] = useState<Array<ClientSection>>([]);

  function isSectionEnabled(sectionName: string): boolean {
    // Find the specified section.
    const section = sections.find(
      (section) => section.nombreSeccion === sectionName
    );

    if (!section) return false;

    // If found, return wether or not it was enabled.
    return section.habilitada;
  }

  return (
    <DashboardContext.Provider
      value={{ sections, setSections, isSectionEnabled }}
    >
      {children}
    </DashboardContext.Provider>
  );
}
