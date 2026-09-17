import { createContext, useContext, useState, type ReactNode } from "react";

interface ActiveSectionValue {
  active: string;
  setActive: (id: string) => void;
}

const ActiveSectionContext = createContext<ActiveSectionValue | null>(null);

export function ActiveSectionProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState("home");
  return (
    <ActiveSectionContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveSectionContext.Provider>
  );
}

export function useActiveSection(): ActiveSectionValue {
  const ctx = useContext(ActiveSectionContext);
  if (!ctx) {
    throw new Error(
      "useActiveSection harus dipakai di dalam ActiveSectionProvider",
    );
  }
  return ctx;
}