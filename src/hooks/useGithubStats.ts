import { useCallback, useEffect, useRef, useState } from "react";
import { fetchReposWithLanguages } from "../lib/githubApi";
import { profileData } from "../data/portfolioData";
import {
  expForRepo,
  summarize,
  detectCompleted,
  extractTechStack,
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
  repos: Array<{
    name: string;
    languages: string[];
    commitMessages?: string[];
    manifests?: Record<string, string>;
  }>;
}

export type GithubRepoData = GithubStatsFile["repos"];

const CACHE_KEY = "github-stats-cache-v2";
// 30 menit: cukup lama untuk hemat kuota, cukup baru agar data tidak basi.
const CACHE_TTL_MS = 30 * 60 * 1000;

const GITHUB_USERNAME = (() => {
  try {
    const url = new URL(profileData.github);
    return url.pathname.replace(/^\//, "").replace(/\/$/, "");
  } catch {
    return "";
  }
})();

interface StatsCache {
  fetchedAt: number;
  repos: GithubRepoData;
}

function readCache(): StatsCache | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StatsCache;
    if (!Array.isArray(parsed.repos)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(repos: GithubRepoData): void {
  try {
    const payload: StatsCache = { fetchedAt: Date.now(), repos };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    // localStorage penuh / tidak tersedia — abaikan, cache bersifat opsional.
  }
}

function toRepoStats(repos: GithubRepoData): RepoStat[] {
  return repos.map((repo) => ({
    name: repo.name,
    languages: repo.languages,
    stack: extractTechStack(repo.manifests ?? {}),
    completed: detectCompleted(repo.commitMessages ?? []),
    exp: expForRepo(repo.languages),
  }));
}

async function fetchStatic(): Promise<GithubRepoData> {
  const res = await fetch("/github-stats.json");
  if (!res.ok) {
    throw new Error(
      `File github-stats.json tidak ditemukan (HTTP ${res.status})`,
    );
  }
  const data = (await res.json()) as GithubStatsFile;
  return data.repos;
}

export function useGithubStats(): GithubStatsState {
  const [summary, setSummary] = useState<LevelingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const forceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      const force = forceRef.current;
      forceRef.current = false;

      // Cache fresh → langsung pakai tanpa menyentuh GitHub (hemat kuota).
      const cached = force ? null : readCache();
      if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        if (!cancelled) {
          setSummary(summarize(toRepoStats(cached.repos)));
          setLoading(false);
        }
        return;
      }

      try {
        const repos = await fetchReposWithLanguages(GITHUB_USERNAME);
        if (cancelled) return;
        if (repos.length === 0) {
          throw new Error("Tidak ada repositori yang ditemukan");
        }
        writeCache(repos);
        setSummary(summarize(toRepoStats(repos)));
      } catch (err) {
        if (cancelled) return;
        // API gagal (proxy mati / rate limit / token salah) → cari cadangan.
        let staticRepos: GithubRepoData | null = null;
        try {
          staticRepos = await fetchStatic();
          if (staticRepos.length === 0) staticRepos = null;
        } catch {
          staticRepos = null;
        }
        if (staticRepos && !cancelled) {
          setSummary(summarize(toRepoStats(staticRepos)));
        } else if (cached && cached.repos.length > 0 && !cancelled) {
          setSummary(summarize(toRepoStats(cached.repos)));
        } else if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Gagal memuat data GitHub",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    forceRef.current = true;
    setAttempt((a) => a + 1);
  }, []);

  return { summary, loading, error, retry };
}