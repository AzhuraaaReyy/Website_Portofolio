/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Fallback token GitHub khsus dev lokal (Layer 2, hanya dipakai saat
   * import.meta.env.DEV true). JANGAN di-set di dashboard Vercel: VITE_*
   * ter-bundle ke JS client saat production build, walau cabang DEV-nya
   * dibuang saat minify. Scope fine-grained PAT: Public repositories (read-only).
   */
  readonly VITE_GITHUB_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}