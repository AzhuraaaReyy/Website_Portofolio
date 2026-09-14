import { writeFile } from "node:fs/promises";

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";
const MAX_PAGES = 10;
const PAGE_SIZE = 100;

const REPO_QUERY = `
  query($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(
        first: ${PAGE_SIZE}
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

function outputUrl() {
  return new URL("../public/github-stats.json", import.meta.url);
}

function resolveOwner(argv) {
  const flagIndex = argv.indexOf("--user");
  if (flagIndex !== -1 && argv[flagIndex + 1]) {
    return argv[flagIndex + 1];
  }
  return process.env.GITHUB_OWNER ?? process.env.GITHUB_USER ?? null;
}

async function graphqlRequest(owner, cursor, token) {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({
      query: REPO_QUERY,
      variables: { login: owner, cursor },
    }),
  });

  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error(`Respons GraphQL bukan JSON (HTTP ${res.status})`);
  }
  if (body.errors?.length) {
    throw new Error(body.errors[0].message ?? "GraphQL mengembalikan error");
  }
  if (!res.ok) {
    throw new Error(`GraphQL gagal (HTTP ${res.status})`);
  }
  return body;
}

async function fetchRepos(owner, token) {
  const repos = [];
  let cursor = null;
  for (let page = 0; page < MAX_PAGES; page++) {
    const data = await graphqlRequest(owner, cursor, token);
    const connection = data.user?.repositories;
    for (const node of connection?.nodes ?? []) {
      if (node.isArchived) continue;
      const languages = [
        ...new Set((node.languages?.nodes ?? []).map((lang) => lang.name)),
      ].sort();
      repos.push({ name: node.name, languages });
    }
    if (!connection?.pageInfo?.hasNextPage || !connection.pageInfo.endCursor) {
      break;
    }
    cursor = connection.pageInfo.endCursor;
  }
  return repos;
}

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("Env GITHUB_TOKEN wajib diisi untuk memanggil GitHub API");
  }
  const owner = resolveOwner(process.argv.slice(2));
  if (!owner) {
    throw new Error(
      "Owner tidak ditemukan — pakai --user <owner> atau env GITHUB_OWNER",
    );
  }

  const repos = await fetchRepos(owner, token);
  repos.sort((a, b) => a.name.localeCompare(b.name));

  const payload = {
    repos,
  };

  await writeFile(outputUrl(), JSON.stringify(payload), "utf8");
  console.log(
    `github-stats.json diperbarui: ${repos.length} repositori untuk @${owner}`,
  );
}

main().catch((err) => {
  console.error(`GAGAL: ${err.message}`);
  process.exitCode = 1;
});