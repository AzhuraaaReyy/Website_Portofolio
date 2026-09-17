// Vercel Serverless Function: proxy GitHub GraphQL (1 request) untuk fitur leveling.
// Token server-side via env GITHUB_TOKEN — tidak pernah terpapar ke client.
// Kuota GraphQL terautentikasi: 5000 poin/jam (bukan 60 request/jam per IP).

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const MAX_PAGES = 10;
const UPSTREAM_TIMEOUT_MS = 15000;

// Rate limit ringan di sisi kode: membatasi panggilan per IP agar kuota
// GraphQL GitHub (5000 poin/jam) tidak habis karena request berulang.
// State disimpan globalThis (bertahan antar-invocation pada instance yang
// sama; bukan pengganti WAF Vercel, tapi lapisan pertahanan pertama).
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 15;

interface RateBucket {
  count: number;
  resetAt: number;
}

interface GlobalState {
  rate?: Record<string, RateBucket>;
}

function rateLimited(clientIp: string): boolean {
  const now = Date.now();
  const g = globalThis as unknown as GlobalState;
  g.rate ??= {};
  const bucket = g.rate[clientIp];
  if (!bucket || now >= bucket.resetAt) {
    g.rate[clientIp] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    return false;
  }
  bucket.count += 1;
  return bucket.count > RATE_LIMIT_MAX;
}

// Hanya username milik situs ini yang boleh disinkronkan.
// Nilai dari env GITHUB_USERNAME (bila di-set di Vercel), default ke pemilik.
const ALLOWED_USERNAME = (process.env.GITHUB_USERNAME || "AzhuraaaReyy").trim();

interface GraphQlLangNode {
  name: string;
}

interface GraphQlCommitNode {
  messageHeadline: string | null;
}

interface GraphQlHistory {
  nodes: GraphQlCommitNode[] | null;
}

interface GraphQlTarget {
  history: GraphQlHistory | null;
}

interface GraphQlDefaultBranch {
  target: GraphQlTarget | null;
}

interface GraphQlBlob {
  text: string | null;
}

interface GraphQlRepoNode {
  name: string;
  isArchived: boolean;
  languages: { nodes: GraphQlLangNode[] } | null;
  defaultBranchRef: GraphQlDefaultBranch | null;
  packageJson: GraphQlBlob | null;
  composerJson: GraphQlBlob | null;
  pubspecYaml: GraphQlBlob | null;
  pyprojectToml: GraphQlBlob | null;
  requirementsTxt: GraphQlBlob | null;
}

interface GraphQlRepositories {
  nodes: GraphQlRepoNode[] | null;
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
}

interface GraphQlUser {
  repositories: GraphQlRepositories;
}

interface GraphQlData {
  data: {
    user: GraphQlUser | null;
  } | null;
  errors?: Array<{ message?: string }>;
}

const REPO_QUERY = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(
        first: 100
        isFork: false
        privacy: PUBLIC
        after: $cursor
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          name
          isArchived
          languages(first: 100) { nodes { name } }
          defaultBranchRef {
            target {
              ... on Commit {
                history(first: 30) {
                  nodes { messageHeadline }
                }
              }
            }
          }
          packageJson: object(expression: "HEAD:package.json") {
            ... on Blob { text }
          }
          composerJson: object(expression: "HEAD:composer.json") {
            ... on Blob { text }
          }
          pubspecYaml: object(expression: "HEAD:pubspec.yaml") {
            ... on Blob { text }
          }
          pyprojectToml: object(expression: "HEAD:pyproject.toml") {
            ... on Blob { text }
          }
          requirementsTxt: object(expression: "HEAD:requirements.txt") {
            ... on Blob { text }
          }
        }
        pageInfo { hasNextPage endCursor }
      }
    }
  }
`;

interface RepoLanguages {
  name: string;
  languages: string[];
  commitMessages: string[];
  manifests: Record<string, string>;
}

async function fetchGraphQlPage(
  login: string,
  cursor: string | null,
  token: string,
): Promise<NonNullable<GraphQlData["data"]>> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        query: REPO_QUERY,
        variables: { login, cursor },
      }),
      signal: controller.signal,
    });
  } catch {
    clearTimeout(timer);
    throw new Error("GitHub GraphQL tidak merespons (timeout)");
  }
  clearTimeout(timer);

  let body: GraphQlData;
  try {
    body = (await res.json()) as GraphQlData;
  } catch {
    throw new Error(`GraphQL respons bukan JSON (HTTP ${res.status})`);
  }

  if (!res.ok) {
    const msg =
      body.errors?.[0]?.message ?? `GraphQL gagal (HTTP ${res.status})`;
    throw new Error(msg);
  }
  if (body.errors?.length) {
    throw new Error(body.errors[0].message ?? "GraphQL mengembalikan error");
  }
  if (!body.data?.user) {
    throw new Error("GitHub tidak menemukan pengguna tersebut");
  }
  return body.data;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "Method harus GET" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = process.env.GITHUB_TOKEN || "";
  if (!token) {
    return new Response(JSON.stringify({ error: "GITHUB_TOKEN belum di-set" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Rate limit per IP: Vercel meneruskan IP asli via header x-forwarded-for.
  const clientIp =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(clientIp)) {
    return new Response(
      JSON.stringify({ error: "terlalu banyak permintaan — coba lagi" }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
        },
      },
    );
  }

  // Authorization: hanya username situs sendiri yang boleh di-sync (anti abuse kuota).
  const url = new URL(req.url);
  const requested = (url.searchParams.get("username") ?? "").trim().replace(/^\//, "");
  const login = requested || ALLOWED_USERNAME;
  if (requested && requested !== ALLOWED_USERNAME) {
    return new Response(JSON.stringify({ error: "username tidak diizinkan" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!login || !/^[a-zA-Z0-9-]+$/.test(login)) {
    return new Response(JSON.stringify({ error: "username tidak valid" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const repos: RepoLanguages[] = [];
    let cursor: string | null = null;
    for (let page = 0; page < MAX_PAGES; page++) {
      const data = await fetchGraphQlPage(login, cursor, token);
      const user = data.user;
      if (!user?.repositories) break;
      for (const node of user.repositories.nodes ?? []) {
        if (node.isArchived) continue;
        const commitMessages = (
          node.defaultBranchRef?.target?.history?.nodes ?? []
        )
          .map((commit) => commit.messageHeadline ?? "")
          .filter((message) => message.length > 0);

        const manifests: Record<string, string> = {};
        if (node.packageJson?.text) manifests.packageJson = node.packageJson.text;
        if (node.composerJson?.text) manifests.composerJson = node.composerJson.text;
        if (node.pubspecYaml?.text) manifests.pubspecYaml = node.pubspecYaml.text;
        if (node.pyprojectToml?.text) manifests.pyprojectToml = node.pyprojectToml.text;
        if (node.requirementsTxt?.text) {
          manifests.requirementsTxt = node.requirementsTxt.text;
        }

        repos.push({
          name: node.name,
          languages: (node.languages?.nodes ?? []).map((l) => l.name),
          commitMessages,
          manifests,
        });
      }
      if (!user.repositories.pageInfo.hasNextPage) break;
      cursor = user.repositories.pageInfo.endCursor;
      if (!cursor) break;
    }

    return new Response(JSON.stringify({ repos }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    // Jangan meneruskan pesan error asli GitHub ke public (bocor detail kuota).
    console.error("[leveling] upstream error:", err);
    return new Response(
      JSON.stringify({ error: "Gagal mengambil data dari server" }),
      {
        status: 502,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}