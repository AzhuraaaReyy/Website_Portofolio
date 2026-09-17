import {
  COMPLETION_KEYWORDS,
  LEVELING_CONFIG,
  LEVELING_TIERS,
  TECH_PATTERNS,
  type Tier,
} from "../data/levelingConfig";

export type { Tier } from "../data/levelingConfig";

export type LanguageCategory = "utama" | "programming" | "markup" | "unknown";

export interface RepoStat {
  name: string;
  languages: string[];
  stack: string[];
  completed: boolean;
  exp: number;
}

export interface LanguageStat {
  name: string;
  category: LanguageCategory;
  expPerProject: number;
  usedInRepos: number;
  totalExp: number;
}

export interface TechStat {
  name: string;
  usedInRepos: number;
  totalExp: number;
}

export interface LevelingSummary {
  level: number;
  tier: Tier;
  currentExp: number;
  requiredExp: number;
  progress: number;
  totalExp: number;
  totalRepos: number;
  completedRepos: number;
  technologyCount: number;
  languageCount: number;
  languageBreakdown: LanguageStat[];
  technologyBreakdown: TechStat[];
  projectBreakdown: RepoStat[];
}

export function detectCompleted(commitMessages: string[]): boolean {
  return commitMessages.some((message) =>
    COMPLETION_KEYWORDS.some((keyword) =>
      message.toLowerCase().includes(keyword),
    ),
  );
}

export function extractTechStack(manifests: Record<string, string>): string[] {
  const raw = Object.values(manifests).join("\n").toLowerCase();
  if (!raw) return [];
  const found = new Set<string>();
  for (const pattern of TECH_PATTERNS) {
    if (raw.includes(pattern.match)) found.add(pattern.label);
  }
  return [...found].sort();
}

export function classifyLanguage(name: string): LanguageCategory {
  if (Object.prototype.hasOwnProperty.call(LEVELING_CONFIG.languageExp, name)) {
    return "utama";
  }
  if (LEVELING_CONFIG.programmingLanguages.includes(name)) {
    return "programming";
  }
  if (LEVELING_CONFIG.markupDataLanguages.includes(name)) {
    return "markup";
  }
  return "unknown";
}

export function expByLanguage(name: string): number {
  const direct = LEVELING_CONFIG.languageExp[name];
  if (typeof direct === "number") return direct;
  const category = classifyLanguage(name);
  if (category === "programming") return 75;
  if (category === "markup") return 25;
  return 0;
}

export function expForRepo(languages: string[]): number {
  const unique = [...new Set(languages)];
  const languageExp = unique.reduce((sum, lang) => sum + expByLanguage(lang), 0);
  return LEVELING_CONFIG.baseProjectExp + languageExp;
}

/**
 * Target EXP kumulatif untuk MENCAPAI level `level` (rumus kuadratik):
 * targetExp(level) = 100 × level² → level 2 = 400, level 9 = 8.100,
 * max level 100 = 1.000.000.
 */
export function targetExpToLevel(level: number): number {
  return Math.floor(
    LEVELING_CONFIG.curveCoefficient *
      Math.pow(level, LEVELING_CONFIG.curveExponent),
  );
}

/**
 * EXP yang dibutuhkan untuk naik DARI level `level` ke level berikutnya
 * (selisih dua target kumulatif berurutan = 100 × (2·level + 1)).
 */
export function expToNext(level: number): number {
  if (level >= LEVELING_CONFIG.maxLevel) return 0;
  return targetExpToLevel(level + 1) - targetExpToLevel(level);
}

/**
 * Total EXP kumulatif yang dibutuhkan untuk MENCAPAI level `nextLevel`.
 * Dipakai UI agar progress = akumulasi nyata (mis. 12.000 PTS) terhadap
 * target level berikutnya — bukan sisa di dalam level yang membuat angka
 * terkesan "belum sesuai" dengan akumulasi.
 */
export function cumulativeExpToLevel(nextLevel: number): number {
  return targetExpToLevel(nextLevel);
}

/**
 * Gelar (tier) dari sebuah level — memetakan level ke rentang jabatan
 * pada `LEVELING_TIERS` (mis. level 30 → Mid-Level Full-Stack Engineer).
 */
export function tierFromLevel(level: number): Tier {
  for (const tier of LEVELING_TIERS) {
    if (level >= tier.minLevel && level <= tier.maxLevel) return tier;
  }
  return LEVELING_TIERS[LEVELING_TIERS.length - 1];
}

export function progressFromExp(totalExp: number): {
  level: number;
  currentExp: number;
  requiredExp: number;
  progress: number;
} {
  const raw = Math.max(0, totalExp);
  let level = 1;
  while (level < LEVELING_CONFIG.maxLevel) {
    if (raw >= targetExpToLevel(level + 1)) {
      level += 1;
    } else {
      break;
    }
  }
  // currentExp = total akumulasi nyata, requiredExp = target kumulatif menuju
  // level berikutnya, progress = akumulasi / target (persen menuju capaian).
  const currentExp = raw;
  const requiredExp =
    level >= LEVELING_CONFIG.maxLevel ? 0 : cumulativeExpToLevel(level + 1);
  const progress =
    requiredExp > 0 ? Math.min(1, currentExp / requiredExp) : 1;
  return { level, currentExp, requiredExp, progress };
}

export function summarize(repoStats: RepoStat[]): LevelingSummary {
  const totalExp = repoStats.reduce(
    (sum, r) => sum + (Number.isFinite(r.exp) ? r.exp : 0),
    0,
  );
  const { level, currentExp, requiredExp, progress } = progressFromExp(totalExp);
  const tier = tierFromLevel(level);

  const languageMap = new Map<
    string,
    { category: LanguageCategory; expPerProject: number; usedInRepos: number; totalExp: number }
  >();
  for (const repo of repoStats) {
    for (const lang of [...new Set(repo.languages)]) {
      const found = languageMap.get(lang);
      if (found) {
        found.usedInRepos += 1;
        found.totalExp += found.expPerProject;
      } else {
        languageMap.set(lang, {
          category: classifyLanguage(lang),
          expPerProject: expByLanguage(lang),
          usedInRepos: 1,
          totalExp: expByLanguage(lang),
        });
      }
    }
  }

  const languageBreakdown: LanguageStat[] = [...languageMap.entries()]
    .map(([name, stat]) => ({ name, ...stat }))
    .sort((a, b) => b.totalExp - a.totalExp);

  const projectBreakdown = [...repoStats].sort((a, b) => b.exp - a.exp);

  const completedRepos = repoStats.filter((repo) => repo.completed).length;
  const technologySet = new Set<string>();
  const techMap = new Map<
    string,
    { usedInRepos: number; totalExp: number }
  >();
  for (const repo of repoStats) {
    // Dedup per repo (cermin languageBreakdown) agar usedInRepos = jumlah repo.
    for (const tech of new Set(repo.stack)) {
      technologySet.add(tech);
      const found = techMap.get(tech);
      if (found) {
        found.usedInRepos += 1;
        found.totalExp += Number.isFinite(repo.exp) ? repo.exp : 0;
      } else {
        techMap.set(tech, {
          usedInRepos: 1,
          totalExp: Number.isFinite(repo.exp) ? repo.exp : 0,
        });
      }
    }
  }
  const technologyCount = technologySet.size;
  const technologyBreakdown: TechStat[] = [...techMap.entries()]
    .map(([name, stat]) => ({ name, ...stat }))
    .sort((a, b) => b.usedInRepos - a.usedInRepos || b.totalExp - a.totalExp);
  const languageCount = languageBreakdown.length;

  return {
    level,
    tier,
    currentExp,
    requiredExp,
    progress,
    totalExp,
    totalRepos: repoStats.length,
    completedRepos,
    technologyCount,
    languageCount,
    languageBreakdown,
    technologyBreakdown,
    projectBreakdown,
  };
}