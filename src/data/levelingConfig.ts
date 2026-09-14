export interface LevelingConfig {
  baseProjectExp: number;
  maxLevel: number;
  curveBase: number;
  curveMultiplier: number;
  languageExp: Record<string, number>;
  programmingLanguages: string[];
  markupDataLanguages: string[];
}

export const LEVELING_CONFIG: LevelingConfig = {
  baseProjectExp: 200,
  maxLevel: 100,
  curveBase: 1000,
  curveMultiplier: 1.15,
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