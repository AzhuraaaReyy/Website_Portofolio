import { createContext, useContext, type ReactNode } from "react";
import { useGithubStats, type GithubStatsState } from "../hooks/useGithubStats";

const GithubStatsContext = createContext<GithubStatsState | null>(null);

export function GithubStatsProvider({ children }: { children: ReactNode }) {
  const state = useGithubStats();
  return (
    <GithubStatsContext.Provider value={state}>
      {children}
    </GithubStatsContext.Provider>
  );
}

export function useGithubStatsContext(): GithubStatsState {
  const ctx = useContext(GithubStatsContext);
  if (!ctx) {
    throw new Error(
      "useGithubStatsContext harus dipakai di dalam GithubStatsProvider",
    );
  }
  return ctx;
}