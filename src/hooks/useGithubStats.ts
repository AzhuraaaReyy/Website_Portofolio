import { useCallback, useEffect, useState } from "react";
import {
  expForRepo,
  summarize,
  type LevelingSummary,
  type RepoStat,
} from "../lib/levelingEngine";

export interface GithubStatsState {
  summary: LevelingSummary | null;
  loading: boolean;
  error: string | null;
  retry: () => void;
}

export interface GithubStatsFile {
  repos: Array<{ name: string; languages: string[] }>;
}

export function useGithubStats(): GithubStatsState {
  const [summary, setSummary] = useState<LevelingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/github-stats.json");
        if (!res.ok) {
          throw new Error(
            `File github-stats.json tidak ditemukan (HTTP ${res.status})`,
          );
        }
        const data = (await res.json()) as GithubStatsFile;
        if (cancelled) return;
        const repoStats: RepoStat[] = data.repos.map((repo) => ({
          name: repo.name,
          languages: repo.languages,
          exp: expForRepo(repo.languages),
        }));
        setSummary(summarize(repoStats));
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Gagal memuat data GitHub");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { summary, loading, error, retry };
}