import { useEffect, useState } from "react";
import { profileData } from "../data/portfolioData";
import { fetchReposWithLanguages } from "../lib/githubApi";
import {
  expForRepo,
  summarize,
  type LevelingSummary,
  type RepoStat,
} from "../lib/levelingEngine";

interface GithubStatsState {
  summary: LevelingSummary | null;
  loading: boolean;
  error: string | null;
  hasStaleData: boolean;
  retry: () => void;
}

const CACHE_KEY = "github-leveling-summary";
const CACHE_TTL_MS = 30 * 60 * 1000; // 30 menit

function readCache(): LevelingSummary | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry = JSON.parse(raw) as {
      cachedAt: number;
      summary: LevelingSummary;
    };
    if (Date.now() - entry.cachedAt > CACHE_TTL_MS) return null;
    return entry.summary;
  } catch {
    return null;
  }
}

function writeCache(summary: LevelingSummary): void {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ cachedAt: Date.now(), summary }),
    );
  } catch {
    // storage penuh / dinonaktifkan — abaikan
  }
}

export function useGithubStats(): GithubStatsState {
  const [summary, setSummary] = useState<LevelingSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hasStaleData, setHasStaleData] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<number>(0);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      setHasStaleData(false);

      const url = new URL(profileData.github);
      const username = url.pathname.replace(/^\//, "");

      // Langsung tampilkan cache yang masih segar kalau ada.
      const cached = readCache();
      if (cached) setSummary(cached);

      try {
        const repos = await fetchReposWithLanguages(username);
        if (cancelled) return;
        const repoStats: RepoStat[] = repos.map((repo) => ({
          name: repo.name,
          languages: repo.languages,
          exp: expForRepo(repo.languages),
        }));
        const fresh = summarize(repoStats);
        writeCache(fresh);
        setSummary(fresh);
      } catch (err) {
        if (cancelled) return;
        // Data lama tetap ditampilkan saat sync gagal — jangan ditelan diam-diam.
        setHasStaleData(Boolean(cached));
        setError(
          err instanceof Error ? err.message : "Gagal memuat data GitHub",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    // Defer refresh jaringan sampai browser idle agar tidak menahan first paint.
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    const schedule = () => run();

    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(schedule);
    } else {
      timeoutId = setTimeout(schedule, 0);
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof window.cancelIdleCallback === "function") {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, [attempt]);

  return {
    summary,
    loading,
    error,
    hasStaleData,
    retry: () => setAttempt((a) => a + 1),
  };
}