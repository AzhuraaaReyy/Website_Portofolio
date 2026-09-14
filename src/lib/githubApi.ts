const API_BASE = "https://api.github.com";
const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const MAX_ATTEMPTS = 3;

export interface GitHubRepo {
  name: string;
}

export interface RepoLanguages {
  name: string;
  languages: string[];
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function getRawText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return "";
  }
}

async function errorMessage(res: Response, context: string): Promise<string> {
  const raw = await getRawText(res);
  let detail = "";
  try {
    const body = JSON.parse(raw) as { message?: string };
    detail = body.message ? ` — ${body.message}` : "";
  } catch {
    // body bukan JSON; biarkan kosong
  }
  return `GitHub API ${context} gagal (${res.status})${detail}`;
}

function shouldRetry(status: number): boolean {
  return status === 403 || status === 429 || status >= 500;
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
): Promise<Response> {
  for (let attempt = 0; attempt <= MAX_ATTEMPTS; attempt++) {
    const res = await fetch(url, init);
    if (!shouldRetry(res.status) || attempt >= MAX_ATTEMPTS) {
      return res;
    }

    const retryAfter = Number(res.headers.get("Retry-After"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 1000 * 2 ** attempt;
    await sleep(Math.min(waitMs, 15000));
  }
  // Tidak dapat tercapai — guard untuk kepastian tipe.
  throw new Error("fetchWithRetry: retry berhenti tak terduga");
}

async function githubFetch(path: string): Promise<Response> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
  };
  return fetchWithRetry(`${API_BASE}${path}`, { headers });
}

/**
 * GET /users/{username}/repos — lapis REST publik (tanpa token).
 */
export async function fetchRepos(username: string): Promise<GitHubRepo[]> {
  const res = await githubFetch(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&type=all`,
  );
  if (!res.ok) {
    throw new Error(await errorMessage(res, "repos"));
  }
  const data: Array<{ name: string; fork: boolean; archived: boolean }> =
    await res.json();
  return data
    .filter((repo) => !repo.fork && !repo.archived)
    .map((repo) => ({ name: repo.name }));
}

/**
 * GET /repos/{username}/{repo}/languages — lapis REST publik.
 * Error TIDAK ditelan diam-diam: biarkan hook mengangkat error parsial
 * agar EXP bahasa tidak hilang tanpa pemberitahuan.
 */
export async function fetchRepoLanguages(
  username: string,
  repo: string,
): Promise<string[]> {
  const res = await githubFetch(
    `/repos/${encodeURIComponent(username)}/${encodeURIComponent(repo)}/languages`,
  );
  if (!res.ok) {
    throw new Error(await errorMessage(res, `languages:${repo}`));
  }
  const data: Record<string, number> = await res.json();
  return Object.keys(data);
}

/**
 * Lapis 3: REST publik, repos + languages per repo, dibatasi konkurensi.
 */
async function fetchRepoLanguagesREST(username: string): Promise<RepoLanguages[]> {
  const repos = await fetchRepos(username);
  return mapWithConcurrency(
    repos,
    4,
    async (repo): Promise<RepoLanguages> => ({
      name: repo.name,
      languages: await fetchRepoLanguages(username, repo.name),
    }),
  );
}

// ---------- GraphQL ----------

interface GraphQlLangNode {
  name: string;
}

interface GraphQlRepoNode {
  name: string;
  isArchived: boolean;
  languages: { nodes: GraphQlLangNode[] } | null;
}

interface GraphQlRepositories {
  nodes: GraphQlRepoNode[] | null;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

interface GraphQlUser {
  repositories: GraphQlRepositories;
}

interface GraphQlData {
  user: GraphQlUser | null;
  errors?: Array<{ message?: string }>;
}

const REPO_QUERY = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(
        first: 100
        isFork: false
        after: $cursor
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          name
          isArchived
          languages(first: 100) { nodes { name } }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

async function graphqlRequest(
  query: string,
  variables: Record<string, string | null>,
  token: string,
): Promise<GraphQlData> {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
  };
  const init: RequestInit = {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  };

  let res = await fetchWithRetry(GRAPHQL_ENDPOINT, init);

  // Token invalid? Jatuh ke akses publik REST (diputuskan pemanggil).
  if (res.status === 401) {
    throw new Error("GitHub token tidak valid (401)");
  }

  let body: GraphQlData;
  try {
    body = (await res.json()) as GraphQlData;
  } catch {
    throw new Error(`GraphQL respons bukan JSON (HTTP ${res.status})`);
  }

  if (body.errors?.length) {
    throw new Error(body.errors[0].message ?? "GraphQL mengembalikan error");
  }
  if (!res.ok) {
    throw new Error(`GraphQL gagal (HTTP ${res.status})`);
  }
  return body;
}

export function reposFromGraphQl(data: GraphQlData): RepoLanguages[] {
  const repos: RepoLanguages[] = [];
  for (const node of data.user?.repositories.nodes ?? []) {
    if (node.isArchived) continue;
    repos.push({
      name: node.name,
      languages: (node.languages?.nodes ?? []).map((l) => l.name),
    });
  }
  return repos;
}

/**
 * Lapis 2: GraphQL langsung dari klien memakai VITE_GITHUB_TOKEN.
 * (Token ikut ter-bundle ke JS — hanya dipakai bila proxy tak tersedia.)
 */
async function fetchRepoLanguagesGraphQl(
  username: string,
  token: string,
): Promise<RepoLanguages[]> {
  const repos: RepoLanguages[] = [];
  let cursor: string | null = null;
  for (let page = 0; page < 10; page++) {
    const data = await graphqlRequest(
      REPO_QUERY,
      { login: username, cursor },
      token,
    );
    const pageInfo = data.user?.repositories.pageInfo;
    repos.push(...reposFromGraphQl(data));
    if (!pageInfo?.hasNextPage || !pageInfo.endCursor) break;
    cursor = pageInfo.endCursor;
  }
  return repos;
}

// ---------- Entry point: 3 lapis ----------

/**
 * Lapis 1: Vercel Serverless proxy /api/leveling (token server-side).
 */
async function fetchRepoLanguagesProxy(username: string): Promise<RepoLanguages[] | null> {
  try {
    const res = await fetch(`/api/leveling?username=${encodeURIComponent(username)}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const raw = await getRawText(res);
      let detail = "";
      try {
        detail = (JSON.parse(raw) as { error?: string }).error ?? "";
      } catch {
        // biarkan kosong
      }
      if (res.status === 503) {
        // Fungsi serverless jalan tapi token belum di-set → coba lapis lain.
        return null;
      }
      throw new Error(`Proxy leveling gagal (${res.status})${detail ? ` — ${detail}` : ""}`);
    }
    const body = (await res.json()) as { repos?: RepoLanguages[] };
    return body.repos ?? null;
  } catch {
    // Proxy offline (local npm run dev / bukan di Vercel) → turun lapis 2/3.
    return null;
  }
}

export async function fetchReposWithLanguages(
  username: string,
): Promise<RepoLanguages[]> {
  // Lapis 1 — proxy Vercel (utama, token server-side). Satu-satunya di produksi.
  const viaProxy = await fetchRepoLanguagesProxy(username);
  if (viaProxy) return viaProxy;

  // Lapis 2 & 3 khusus DEVELOPMENT (npm run dev) — token VITE_* ter-bundle
  // ke JS. Vite mengganti import.meta.env.DEV → false saat production build
  // sehingga cabang ini (beserta referensi token) dibuang saat minify —
  // token tidak pernah lolos ke bundle produksi.
  if (import.meta.env.DEV) {
    // Lapis 2 — GraphQL klien (VITE_GITHUB_TOKEN).
    const clientToken = import.meta.env.VITE_GITHUB_TOKEN;
    if (clientToken) {
      try {
        return await fetchRepoLanguagesGraphQl(username, clientToken);
      } catch {
        // token invalid/expired → jatuh ke lapis 3.
      }
    }

    // Lapis 3 — REST publik (tanpa token).
    return fetchRepoLanguagesREST(username);
  }

  // Produksi: bila proxy gagal, tampilkan error jelas — jangan jatuh ke REST
  // publik yang dibatasi rate-limit 60 request/jam (sumber pesan "limit").
  throw new Error(
    "Proxy leveling tidak merespons — coba lagi beberapa saat lagi",
  );
}

// ---------- Helper ----------

export async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;
  const workerCount = Math.min(limit, items.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await mapper(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}