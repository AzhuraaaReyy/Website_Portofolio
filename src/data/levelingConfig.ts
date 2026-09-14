export interface Tier {
  tier: number;
  title: string;
  minLevel: number;
  maxLevel: number;
}

export interface LevelingConfig {
  baseProjectExp: number;
  maxLevel: number;
  curveCoefficient: number;
  curveExponent: number;
  languageExp: Record<string, number>;
  programmingLanguages: string[];
  markupDataLanguages: string[];
}

export const LEVELING_CONFIG: LevelingConfig = {
  baseProjectExp: 200,
  maxLevel: 100,
  curveCoefficient: 100,
  curveExponent: 2,
  languageExp: {
    HTML: 50,
    Python: 100,
    PHP: 125,
    JavaScript: 150,
    TypeScript: 200,
    "C#": 250,
    Java: 275,
    Go: 300,
    Shell: 350,
    "C++": 500,
  },
  programmingLanguages: [
    "Lua", "Dart", "Rust", "Kotlin", "Swift", "Ruby", "Perl", "Scala",
    "Haskell", "Elixir", "Erlang", "R", "Solidity", "Zig", "Nim",
    "Objective-C", "C", "Assembly", "Julia", "Clojure",
    "Batchfile", "Hack", "PLpgSQL",
  ],
  markupDataLanguages: [
    "CSS", "SCSS", "Sass", "Less", "Stylus", "Markdown", "JSON", "YAML",
    "XML", "TeX", "Dockerfile", "CSV",
    "Blade", "Jinja", "Procfile",
  ],
};

// ⚠️  JANGAN isi token di sini. File ini dibundel ke JavaScript klien →
//    siapa saja bisa melihat dan mencurinya.  GitHub token hanya boleh
//    dipakai di environment server / edge function.
//    Karena token kosong (""), API dipanggil tanpa autentikasi (limit 60/jam/IP).

// Peta gelar (tier) berdasarkan rentang level.
// Rumus target EXP (kumulatif capai level): targetExp(L) = 100 × L².
export const LEVELING_TIERS: Tier[] = [
  { tier: 1, title: "Junior Full-Stack Intern", minLevel: 1, maxLevel: 10 },
  { tier: 2, title: "Junior Full-Stack Developer", minLevel: 11, maxLevel: 25 },
  { tier: 3, title: "Mid-Level Full-Stack Engineer", minLevel: 26, maxLevel: 45 },
  { tier: 4, title: "Senior Full-Stack Engineer", minLevel: 46, maxLevel: 65 },
  { tier: 5, title: "Full-Stack Tech Lead / Engineering Manager", minLevel: 66, maxLevel: 80 },
  { tier: 6, title: "Principal Engineer / System Architect", minLevel: 81, maxLevel: 95 },
  { tier: 7, title: "Chief Technology Officer (CTO) / VP of Engineering", minLevel: 96, maxLevel: 100 },
];