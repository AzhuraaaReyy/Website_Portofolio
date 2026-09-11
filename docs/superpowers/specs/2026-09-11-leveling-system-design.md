# Desain: Sistem Leveling (EXP & Level) Berbasis GitHub API

**Tanggal:** 2026-09-11
**Status:** Disetujui (menunggu review)
**Repositori:** WebsitePortofolio (React 19 + TypeScript + Vite SPA)

## Ringkasan

Menambahkan sistem leveling bergaya game ke portfolio website. Setiap repositori
GitHub publik milik pengguna dihitung sebagai "proyek" yang memberikan EXP dasar,
plus EXP tambahan dari bahasa pemrograman yang digunakan. Total EXP menentukan
level pemain (1–100) dengan kurva eksponensial. Data diambil langsung dari GitHub
API sehingga selalu mencerminkan kemampuan riil pengguna tanpa manipulasi.

## Tujuan

- Level naik otomatis setiap ada proyek baru di GitHub.
- Kenaikan EXP disesuaikan dengan bahasa pemrograman yang dipakai di proyek.
- Menampilkan level, progress EXP, breakdown bahasa, dan breakdown proyek.
- Menggantikan placeholder dekoratif "LVL 99 / RANK S+ / PING" yang saat ini
  hardcoded di Navbar dengan data nyata.
- Menambah section baru "Stats" untuk detail leveling.
- Tidak ada kebohongan — semua angka bersumber dari GitHub API.

## Sumber Data

- **Username GitHub:** `AzhuraaaReyy` (dibaca dari `profileData.github`, ekstrak path)
- **Endpoint yang dipakai:**
  1. `GET /users/{username}/repos?per_page=100&type=all` — daftar repositori
  2. `GET /repos/{username}/{repo}/languages` — rincian bahasa per repositori
- **Token:** Personal Access Token di-hardcode di frontend (keputusan pengguna),
  dimasukkan sebagai header `Authorization: Bearer`.
- **Fallback:** Jika token invalid/401, fallback ke fetching tanpa token (rate
  limit publik 60 req/jam — cukup untuk ±6 repositori saat ini).

## Aturan Perhitungan EXP

### EXP per Proyek (Repositori)

- Setiap repositori non-fork: **+200 EXP**.
- Repositori fork dan archived di-skip.
- Repositori tanpa bahasa (empty repo) tetap mendapat +200 base.

### EXP per Bahasa

Setiap bahasa unik dalam satu repositori dihitung **sekali** (tidak proporsional
berdasarkan byte). Bobot:

| Bahasa | EXP | Kategori |
|---|---|---|
| HTML | +50 | Daftar utama |
| Python | +100 | Daftar utama |
| PHP | +125 | Daftar utama |
| JavaScript | +150 | Daftar utama |
| TypeScript | +200 | Daftar utama |
| C# | +250 | Daftar utama |
| Java | +275 | Daftar utama |
| Go | +300 | Daftar utama |
| Shell | +350 | Daftar utama |
| C++ | +500 | Daftar utama |
| Bahasa pemrograman lain (Lua, Dart, Rust, dll.) | +75 | Programming |
| Markup/Data (CSS, SCSS, Markdown, JSON, YAML, dll.) | +25 | Markup/Data |
| Tidak dikenal | +0 | Unknown |

**Cara klasifikasi:** `levelingConfig.ts` memuat daftar kedua (curated):
- `programmingLanguages`: bahasa pemrograman lain di luar daftar utama (mis. Lua, Dart, Rust, Kotlin, Swift) → +75.
- `markupDataLanguages`: CSS, SCSS, Less, Markdown, JSON, YAML, XML, dll. → +25.
- Selain itu (nama yang tidak dikenali GitHub, bahasa eksotik) → +0.

### Total EXP

```
totalExp = Σ (repoExp)
repoExp  = 200 (base) + Σ (expPerLanguage untuk bahasa unik di repo)
```

## Kurva Leveling (Eksponensial)

- Level berkisar **1–100**.
- `expToNext(level) = floor(base × multiplier^(level−1))`
- Konstanta awal: `base = 1000`, `multiplier = 1.15`.
- Level 1→2 = 1000, 2→3 = 1150, 3→4 = 1323, dst.
- Level ditentukan sebagai level tertinggi L di mana `Σ expToNext(1..L−1) <= totalExp`.
- Progress bar = `(totalExp − expKumulatif(level)) / expToNext(level)`.
- Konstanta ini disimpan di `levelingConfig.ts` agar mudah di-tune.

## Arsitektur

```
App.tsx
 └─ useGithubStats()                ← custom hook: fetch + state + retry
     ├─ lib/levelingEngine.ts       ← PURE: klasifikasi bahasa, bobot, kurva
     ├─ lib/githubApi.ts            ← PURE: endpoint + parsing respons
     └─ data/levelingConfig.ts      ← konstanta: token, bobot, kurva, maxLevel
 ├─ Navbar.tsx                      ← HUD dengan data nyata
 └─ Stats.tsx                       ← section baru (antara Projects & Experience)
     └─ ui/ExpBar.tsx               ← progress bar reusable (juga di Navbar)
```

Prinsip:

- **Fungsi murni terpisah dari fetching.** `levelingEngine.ts` dan `githubApi.ts`
  agnostik React sehingga angka deterministik dan mudah diverifikasi.
- **Tanpa state management baru.** `App.tsx` memanggil hook sekali dan mengirim
  data via props ke `Navbar` dan `Stats` — konsisten dengan pola `activeSection`
  yang sudah ada.
- **Fit non-blocking.** Error API tidak men-core crash si halaman; fallback ke
  status offline/hide.

## Komponen & File

### File Baru

| File | Tujuan |
|---|---|
| `src/data/levelingConfig.ts` | Token GitHub, map bobot bahasa, konstanta kurva (`base`, `multiplier`, `maxLevel`), konstanta EXP dasar per proyek |
| `src/lib/levelingEngine.ts` | Fungsi murni: `classifyLanguage`, `expByLanguage`, `repoExp`, `levelFromExp`, `progressFromExp`, `expToNext` |
| `src/lib/githubApi.ts` | `fetchRepos(username, token)`, `fetchRepoLanguages(username, repo, token)` dengan parsing + guard rate-limit |
| `src/hooks/useGithubStats.ts` | State `loading / error / data`, fungsi `retry`, memanggil engine untuk derive level |
| `src/components/Stats.tsx` | Section baru: kartu level & EXP, language breakdown, project breakdown |
| `src/components/ui/ExpBar.tsx` | Progress bar animasi (Framer Motion) yang respect `useReducedMotion`, dipakai Navbar & Stats |

### File Diubah

| File | Perubahan |
|---|---|
| `src/App.tsx` | Panggil `useGithubStats`, pass props, sisipkan `<Stats/>` di antara Projects & Experience |
| `src/components/Navbar.tsx` | Ganti LVL/RANK/PING hardcode dengan data nyata + skeleton/offline fallback |

## Detail UI

### Navbar HUD

- Tampilkan `LVL {n}` dari data nyata.
- XP bar sesuai progress (menggunakan `ExpBar`).
- Teks `{xp} / {next}` EXP.
- Loading → skeleton shimmer.
- Error → "LVL -- / OFFLINE" (tetap dekoratif, tidak merusak layout).
- Pertahankan estetika skew/gaming, font mono, dan warna amber/teal yang ada.

### Section "Stats"

- **Kartu Level & EXP:** angka level besar, progress bar animasi, total EXP,
  EXP menuju level berikutnya.
- **Language breakdown:** daftar bahasa + ikon (devicon, pola seperti
  `arsenalData`), bobot EXP, EXP kumulatif per bahasa.
- **Project breakdown:** daftar repo, +200 base, daftar bahasa, total EXP per proyek.
- Semua teks UI dalam Bahasa Indonesia, konsisten dengan section lain.
- Judul bergaya gaming menyesuaikan konvensi "QUEST CHRONICLES" / "CO-OP LOBBY".

## Penanganan Error & Kasus Tepi

- **Rate limit / error API:** try/catch; status "SYNC_FAILED" + tombol retry;
  halaman lain tetap berfungsi.
- **401 (token invalid):** fallback ke fetching publik (tanpa token) otomatis.
- **Repo fork & archived:** di-skip.
- **Repo tanpa bahasa:** +200 base, language breakdown kosong.
- **Bahasa tak dikenal:** classifier menentukan kategori (daftar utama → bobot
  asli; programming lain → +75; markup/data → +25; selain itu → 0).
- **`prefers-reduced-motion`:** animasi progress menggunakan `useReducedMotion`
  (tampil langsung tanpa animasi).
- **Banyak hitungan per hari:** hasil fetch tidak di-cache ke localStorage pada
  milestone ini (YAGNI); cukup 1–7 request per load.

## Verifikasi

- `npm run build` — tsc type-check + production build.
- `npm run lint` — oxlint.
- Manual: `npm run dev`, pastikan Navbar HUD & Stats tampil dengan data nyata,
  skeleton saat loading, fallback saat error.

## Non-Tujuan (YAGNI)

- Tidak ada localStorage cache.
- Tidak ada sistem autentikasi/login.
- Tidak ada perhitungan proporsional byte bahasa.
- Tidak mengubah section Projects yang sudah ada (hanya menambah section Stats).
- Tidak ada branch baru atau commit — seluruhnya dilakukan manual oleh pemilik repo.