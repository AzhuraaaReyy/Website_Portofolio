/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Fallback token GitHub GraphQL (kedua, setelah proxy Vercel).
   * ⚠️ VITE_* ikut ter-bundle ke JS client — jangan pakai scope yang bisa
   * menulis apapun. Sebaiknya hanya untuk pengembangan lokal.
   */
  readonly VITE_GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}