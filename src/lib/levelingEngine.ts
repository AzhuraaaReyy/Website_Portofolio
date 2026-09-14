import { LEVELING_CONFIG } from "../data/levelingConfig";

export type LanguageCategory = "utama" | "programming" | "markup" | "unknown";

export interface RepoStat {
  name: string;
  languages: string[];
  exp: number;
}

export interface LanguageStat {
  name: string;
  category: LanguageCategory;
  expPerProject: number;
  usedInRepos: number;
  totalExp: number;
}

export interface LevelingSummary {
  level: number;
  currentExp: number;
  requiredExp: number;
  progress: number;
  totalExp: number;
  totalRepos: number;
  languageBreakdown: LanguageStat[];
  projectBreakdown: RepoStat[];
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

export function expToNext(level: number): number {
  if (level >= LEVELING_CONFIG.maxLevel) return 0;
  return Math.floor(
    LEVELING_CONFIG.curveBase *
      Math.pow(LEVELING_CONFIG.curveMultiplier, level - 1),
  );
}

export function progressFromExp(totalExp: number): {
  level: number;
  currentExp: number;
  requiredExp: number;
  progress: number;
} {
  let remaining = Math.max(0, totalExp);
  let level = 1;
  while (level < LEVELING_CONFIG.maxLevel) {
    const need = expToNext(level);
    if (remaining >= need) {
      remaining -= need;
      level += 1;
    } else {
      break;
    }
  }
  const requiredExp = expToNext(level);
  const progress = requiredExp > 0 ? remaining / requiredExp : 1;
  return { level, currentExp: remaining, requiredExp, progress };
}

export function summarize(repoStats: RepoStat[]): LevelingSummary {
  const totalExp = repoStats.reduce((sum, r) => sum + r.exp, 0);
  const { level, currentExp, requiredExp, progress } = progressFromExp(totalExp);

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

  return {
    level,
    currentExp,
    requiredExp,
    progress,
    totalExp,
    totalRepos: repoStats.length,
    languageBreakdown,
    projectBreakdown,
  };
}