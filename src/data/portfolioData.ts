import videobengkelmotor from "../../public/assets/bengkelmotor.mp4";

export interface Profile {
  name: string;
  avatar: string;
  role: string;
  tagline: string;
  bio: string;
  cvUrl: string;
  email: string;
  whatsapp: string;
  github: string;
  linkedin: string;
}

export interface Skill {
  name: string;
  level: "Mahir" | "Menengah" | "Dasar";
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  tech: string[];
  demoUrl: string;
  githubUrl: string;
  mediaType: "image" | "video";
  mediaUrl: string;
  featured: boolean;
}

export interface TimelineItem {
  id: string;
  type: "pendidikan" | "pengalaman";
  title: string;
  institution: string;
  period: string;
  points: string[];
}

export interface HighlightItem {
  iconKey: "target" | "award" | "cpu" | "rocket";
  label: string;
  value: string;
}

export interface AboutOverviewData {
  highlights: HighlightItem[];
  callouts: string[];
  location: string;
  certifications: string[];
}

export interface ArsenalItem {
  name: string;
  level: "Mahir" | "Menengah" | "Dasar";
  icon: string;
}

export interface ArsenalGroupData {
  category: string;
  iconKey: "code" | "cpu" | "cloud" | "database";
  items: ArsenalItem[];
}

export const profileData: Profile = {
  name: "Muhammad Rizal",
  avatar: "/assets/images/Foto1.jpeg",
  role: "Full-Stack Engineer",
  tagline:
    "Full-Stack Web Developer yang berfokus pada efisiensi alur bisnis dan kualitas antarmuka web.",
  bio: "Fresh Graduate Software Engineer lulusan S1 Teknik Informatika UDINUS (IPK 3,80/4.00, Cumlaude) dengan spesialisasi pengembangan web fullstack. Berpengalaman membangun solusi perangkat lunak secara end-to-end mulai dari perancangan UI/UX yang responsif menggunakan React dan Tailwind CSS, hingga pengembangan backend & basis data berbasis Laravel, Supabase, dan PostgreSQL. Memiliki pengalaman nyata mengintegrasikan RESTful API, sistem pakar berbasis logika komputasi (rule-based system), serta otomatisasi alur bisnis pada berbagai proyek web.",
  cvUrl: "/cv-placeholder.pdf",
  email: "muhammadrizal52@gmail.com",
  whatsapp: "https://wa.me/6283162253730",
  github: "https://github.com/AzhuraaaReyy",
  linkedin: "https://www.linkedin.com/in/muhammad-rizal-0495b63a0/",
};

export const aboutOverviewData: AboutOverviewData = {
  highlights: [
    {
      iconKey: "target",
      label: "Peran Utama",
      value: "Fullstack Developer",
    },
    {
      iconKey: "award",
      label: "Latar Belakang",
      value: "Fresh Graduate",
    },
    {
      iconKey: "cpu",
      label: "Stack Utama",
      value: "React · Laravel · Supabase",
    },
    {
      iconKey: "rocket",
      label: "Status",
      value: "Siap Bekerja / Freelance",
    },
  ],
  callouts: [
    profileData.tagline,
    "Terbiasa membangun antarmuka web yang responsif, mengintegrasikan RESTful API, dan mengelola logika basis data di sisi server.",
  ],
  location: "Ungaran Barat, Kabupaten Semarang, Jawa Tengah",
  certifications: [
    "Dicoding Indonesia",
    "IDCamp 2024",
    "Coding Camp DBS Foundation",
    "React & Web Development",
  ],
};

export const arsenalData: ArsenalGroupData[] = [
  {
    category: "Frontend_Dev",
    iconKey: "code",
    items: [
      {
        name: "React Vite",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      },
      {
        name: "TypeScript",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
      },
      {
        name: "Tailwind CSS",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
      },
      {
        name: "Bootstrap",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
      },
      {
        name: "HTML",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      },
    ],
  },
  {
    category: "Backend_Dev",
    iconKey: "cpu",
    items: [
      {
        name: "Laravel",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg",
      },
      {
        name: "PHP",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg",
      },
      {
        name: "RESTful API",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
      },
      {
        name: "JavaScript",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      },
    ],
  },
  {
    category: "Cloud_Database",
    iconKey: "cloud",
    items: [
      {
        name: "MySQL",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
      },
      {
        name: "PostgreSQL",
        level: "Menengah",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
      },
      {
        name: "Supabase",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
      },
      {
        name: "Docker",
        level: "Dasar",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
      },
    ],
  },
  {
    category: "Deploy_Ops",
    iconKey: "database",
    items: [
      {
        name: "Git / GitHub",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
      },
      {
        name: "Vercel",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
      },
      {
        name: "Railway",
        level: "Mahir",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/railway/railway-original.svg",
      },
      {
        name: "Linux / Bash",
        level: "Menengah",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
      },
    ],
  },
];

export const skillsData: SkillCategory[] = [
  {
    title: "Bahasa Pemrograman",
    skills: [
      { name: "HTML,CSS", level: "Mahir" },
      { name: "PHP", level: "Mahir" },
      { name: "JavaScript", level: "Mahir" },
      { name: "TypeScript", level: "Menengah" },
    ],
  },
  {
    title: "Frontend Development",
    skills: [
      { name: "React Vite", level: "Mahir" },
      { name: "Tailwind CSS", level: "Mahir" },
      { name: "Bootstrap", level: "Mahir" },
      { name: "Three.js / React Three Fiber", level: "Dasar" },
    ],
  },
  {
    title: "Backend Development",
    skills: [
      { name: "Laravel", level: "Mahir" },
      { name: "RESTful API / GraphQL", level: "Mahir" },
      { name: "BaaS / SUPABASE", level: "Mahir" },
      { name: "BaaS / FIREBASE", level: "Mahir" },
    ],
  },
  {
    title: "Database Systems",
    skills: [
      { name: "MySQL", level: "Mahir" },
      { name: "PostgreSQL", level: "Menengah" },
    ],
  },
  {
    title: "Tools & Deployment",
    skills: [
      { name: "Git / GitHub", level: "Mahir" },
      { name: "Postman", level: "Mahir" },
      { name: "Vercel", level: "Mahir" },
      { name: "Railway", level: "Mahir" },
      { name: "Linux / Bash", level: "Menengah" },
      { name: "Docker", level: "Dasar" },
    ],
  },
];

export const projectsData: Project[] = [
  {
    id: "project-pos-bengkel",
    title: "Sistem POS & Manajemen Bengkel Motor Berbasis Web",
    shortDesc:
      "Aplikasi Full-Stack ERP & Point-of-Sale (POS) modular yang dirancang untuk digitalisasi operasional, pembayaran online, dan manajemen inventaris UMKM bengkel motor.",
    longDesc:
      "Solusi digital end-to-end yang saya bangun dari awal untuk mengatasi kendala pencatatan manual pada UMKM bengkel. Sistem ini memisahkan hak akses secara dinamis: Owner dapat memantau laporan omzet real-time melalui dashboard analitik, sedangkan Kasir fokus pada transaksi penjualan cepat di menu POS. Dilengkapi dengan fitur pemantauan stok otomatis, integrasi Payment Gateway untuk pembayaran online, serta sistem booking servis yang terintegrasi langsung dengan notifikasi WhatsApp.",
    tech: [
      "React Vite + TypeScript",
      "Laravel",
      "MySQL",
      "Tailwind CSS",
      "Payment Gateway API",
      "WhatsApp Business API",
    ],
    demoUrl: "https://sistem-manajemen-pos-bengkel-motor.vercel.app",
    githubUrl:
      "https://github.com/AzhuraaaReyy/Sistem-Manajemen-POS-BengkelMotor",
    mediaType: "video",
    mediaUrl: videobengkelmotor,
    featured: true,
  },
  {
    id: "project-2",
    title: "Website Landing Page & Manejemen Admin UMKM Mulya Bakery",
    shortDesc:
      "Sistem e-commerce dan internal untuk modernisasi Mulya Bakery. Dilengkapi fitur ongkir otomatis berbasis jarak (Haversine), manajemen inventaris, moderasi ulasan, dan dashboard analitik penjualan terpusat.",
    longDesc:
      "Aplikasi web end-to-end yang dirancang untuk digitalisasi bisnis bakery. Menyediakan landing page publik dengan fitur keranjang belanja interaktif yang langsung terhubung ke WhatsApp Checkout (termasuk kalkulasi jarak otomatis menggunakan Haversine & Nominatim). Di sisi manajemen, sistem ini dilengkapi panel Admin (/admin) tangguh untuk mengelola inventaris produk, moderasi ulasan berfoto, penyesuaian biaya pengiriman pesanan, serta visualisasi laporan penjualan berkala.",
    tech: [
      "React Vite + TypeScript",
      "Supabase (BaaS)",
      "Row Level Security (RLS)",
      "Tailwind CSS",
      "MapLibre GL",
      "Framer Motion",
      "PostgreSQL",
    ],
    demoUrl: "https://rotimulya.vercel.app/",
    githubUrl: "https://github.com/AzhuraaaReyy/Website_MulyaBakery",
    mediaType: "video",
    mediaUrl: "/assets/images/MulyaBakery.png",
    featured: true,
  },
  {
    id: "project-stunting-detection",
    title:
      "GrowthChildCare — Sistem Deteksi & Monitoring Stunting Anak Berbasis Rule-Based Berbasis Web",
    shortDesc:
      "Aplikasi Full-Stack rekam medis digital untuk deteksi dini stunting anak menggunakan mesin inferensi Rule-Based yang divalidasi dengan standar antropometri WHO.",
    longDesc:
      "Sistem berbasis riset yang saya bangun sebagai Proyek Tugas Akhir Universitas, bekerja sama dengan Puskesmas setempat untuk digitalisasi penanganan stunting. Mengembangkan mesin inferensi berbasis aturan (Rule-Based) yang mengintegrasikan data klinis riil Puskesmas dengan standar pertumbuhan anak World Health Organization (WHO) untuk menjamin akurasi diagnosis status gizi secara real-time. Dilengkapi dengan Dasbor Orang Tua interaktif untuk pemantauan kurva tumbuh kembang anak, serta modul generator otomatis yang memberikan rekomendasi intervensi gizi berbasis indikator stunting.",
    tech: [
      "React Vite + TypeScript",
      "Laravel (REST API)",
      "MySQL",
      "Tailwind CSS",
      "Rule-Based Inference Engine",
      "React Leaflet ",
      "Framer Motion",
      "React Recharts",
    ],
    demoUrl: "https://tugas-akhir-web-rho.vercel.app",
    githubUrl: "https://github.com/AzhuraaaReyy/Website-Stunting-Anak",
    mediaType: "video",
    mediaUrl: "/assets/images/StuntingDashboard.png",
    featured: true,
  },
  {
    id: "project-poliklinik-laravel12",
    title: "Sistem Informasi & Manajemen Pendaftaran Poliklinik",
    shortDesc:
      "Aplikasi manajemen layanan poliklinik berbasis web untuk digitalisasi sistem pendaftaran, konsultasi medis, dan pengelolaan rekam medis pasien secara terintegrasi.",
    longDesc:
      "Sistem manajemen poliklinik terpadu yang dirancang untuk memodernisasi layanan kesehatan konvensional. Menggunakan Laravel 12 dan Blade engine, sistem ini memfasilitasi pembuatan janji temu mandiri oleh pasien berdasarkan jadwal praktik dokter yang dinamis. Di sisi operasional, aplikasi ini menyediakan panel khusus bagi dokter untuk mengelola rekam medis (pencatatan keluhan dan diagnosis) serta memantau antrean konsultasi secara terorganisir.",
    tech: ["Laravel 12", "Blade", "MySQL", "Bootstrap", "JavaScript", "php"],
    demoUrl: "https://poliklinik-demo.com",
    githubUrl: "https://github.com/AzhuraaaReyy/Sistem-Poliklinik",
    mediaType: "video",
    mediaUrl: "https://unsplash.com",
    featured: false,
  },
  {
    id: "project-ticketing-platform",
    title: "TickeTiers — Sistem Penjualan Tiket Multi-Tier Berbasis Web",
    shortDesc:
      "Aplikasi full-stack manajemen dan retribusi e-ticket dengan sistem pemisahan membership (Premium & Non-Premium) serta pelacakan invoice checkout pelanggan.",
    longDesc:
      "Sistem e-commerce penjualan tiket yang saya bangun dari awal sebagai proyek sertifikasi Uji Pelatihan Kelulusan Universitas. Aplikasi ini mengimplementasikan logika segmentasi pengguna untuk memisahkan fitur serta aksesibilitas tiket kategori Premium dan Non-Premium. Dilengkapi dengan Dasbor Admin terpusat untuk operasi manajemen data (CRUD) inventaris tiket secara dinamis, serta halaman transaksi pelanggan yang menyajikan rincian lembar kontrol (Checkout Invoice) secara komprehensif pasca-pembelian.",
    tech: ["Laravel 12", "Blade", "MySQL", "Tailwind CSS", "JavaScript", "php"],
    demoUrl: "https://ticketiers-app.vercel.app",
    githubUrl: "https://github.com/AzhuraaaReyy/Website-Penjualan-Tiket",
    mediaType: "video",
    mediaUrl: "/assets/images/TicketingDashboard.png",
    featured: true,
  },
  {
    id: "project-pdam-desa",
    title: "SwadayaApps — Sistem Manajemen & Payment Gateway Billing PDAM Desa",
    shortDesc:
      "Aplikasi Smart-Utility full-stack untuk otomatisasi kalkulasi volume air, manajemen meteran warga, dan integrasi sistem pembayaran online (Payment Gateway) berskala desa.",
    longDesc:
      "Solusi infrastruktur digital nyata yang saya rancang dari nol untuk modernisasi sistem pengelolaan air bersih (PDAM) tingkat desa. Aplikasi ini mengotomatisasi konversi volume angka meteran fisik warga menjadi tagihan nominal secara presisi untuk meminimalkan salah hitung manual. Dilengkapi dengan panel manajemen data pelanggan, laporan komparatif rekap riwayat pembayaran berperiode, serta integrasi Payment Gateway komersial guna memfasilitasi transaksi tagihan bulanan warga secara online, aman, dan instan.",
    tech: [
      "React + TypeScript + Vite",
      "Laravel 12",
      "MySQL",
      "Tailwind CSS",
      "Payment Gateway Integration",
      "Automated Billing Engine",
    ],
    demoUrl: "https://vercel.app",
    githubUrl: "https://github.com/AzhuraaaReyy/Website-PDAM",
    mediaType: "video",
    mediaUrl: "/assets/images/PdamDashboard.png",
    featured: true,
  },
];

export const timelineData: TimelineItem[] = [
  {
    id: "time-1",
    type: "pengalaman",
    title: "Pengembang Frontend",
    institution: "Young Bloom Studio Media Creative - Semarang, Jawa Tengah",
    period: "Feb 2025 - Apr 2025",
    points: [
      "Pengalaman magang 2 bulan di Young Bloom Studio ini jadi kesempatan pertama saya terjun langsung ke industri sebagai Frontend Developer.",
      "Mengembangkan antarmuka (frontend) situs web perusahaan menggunakan React dan Tailwind CSS selama masa magang 2 bulan.",
      "Membangun 2 modul utama, yaitu halaman profil perusahaan dan panel admin sesuai dengan kebutuhan fitur.",
      "Memastikan tampilan halaman profil 100% responsif agar nyaman diakses di layar desktop, tablet, maupun mobile.",
      "Bekerja sama dengan tim untuk menyesuaikan tampilan web agar sesuai dengan kebutuhan desain dan fungsi yang ditentukan.",
    ],
  },
  {
    id: "time-2",
    type: "pengalaman",
    title: "Full-Stack Developer — Sistem POS & Manajemen Bengkel Motor",
    institution:
      "Bengkel Putra Motor - Ungaran Barat, Kabupaten Semarang, Jawa Tengah",
    period: "Agu 2026 - Sep 2026",
    points: [
      "Proyek ini saya kerjakan untuk membantu Bengkel Putra Motor merapikan operasional bengkel, mulai dari kasir POS hingga manajemen stok otomatis.",
      "Merancang dan mengembangkan aplikasi Full-Stack ERP & Point-of-Sale (POS) modular untuk otomatisasi operasional dan stok barang menggunakan React Vite, TypeScript, dan Laravel.",
      "Mengimplementasikan sistem hak akses berbasis peran (RBAC) yang memisahkan dashboard analitik untuk Owner dan menu kasir transaksi cepat.",
      "Mengintegrasikan Payment Gateway untuk transaksi online serta notifikasi otomatis jadwal servis berbasis WhatsApp Business API.",
      "Membuat sistem pelacak stok barang otomatis berbasis basis data MySQL untuk mencegah kekosongan inventaris.",
    ],
  },
  {
    id: "time-3",
    type: "pengalaman",
    title:
      "Full-Stack Developer — Website Landing Page & Manajemen Admin Mulya Bakery",
    institution:
      "Mulya Bakery - Ungaran Barat, Kabupaten Semarang, Jawa Tengah",
    period: "Jul 2026 - Agus 2026",
    points: [
      "Saya membangun platform web dan sistem admin internal Mulya Bakery untuk memudahkan penjualan produk online serta pencatatan stok UMKM.",
      "Membangun platform e-commerce dan sistem manajemen internal UMKM menggunakan React Vite, TypeScript, dan Supabase (BaaS).",
      "Mengembangkan fitur kalkulasi ongkos kirim otomatis berbasis jarak riil menggunakan algoritma Haversine, MapLibre GL, dan Nominatim.",
      "Membangun landing page publik interaktif dengan keranjang belanja yang terintegrasi langsung ke pemesanan via WhatsApp Checkout.",
      "Merancang dashboard admin terpusat untuk kelola produk, moderasi ulasan berfoto, dan visualisasi laporan penjualan dengan tingkat keamanan Row Level Security (RLS) PostgreSQL.",
    ],
  },
  {
    id: "time-4",
    type: "pengalaman",
    title:
      "Full-Stack Developer — GrowthChildCare, Sistem Deteksi & Monitoring Stunting Anak",
    institution:
      "Proyek Tugas Akhir Universitas (bekerja sama dengan Puskesmas)",
    period: "Mar 2026 - Mei 2026",
    points: [
      "Aplikasi Tugas Akhir ini saya kembangkan bersama pihak Puskesmas untuk membantu tenaga medis mendeteksi dini kondisi stunting pada anak.",
      "Mengembangkan sistem rekam medis digital dan mesin inferensi berbasis aturan (Rule-Based) untuk deteksi dini stunting sesuai standar antropometri WHO.",
      "Membangun Dasbor Orang Tua interaktif berbasis React Recharts untuk memantau grafik tumbuh kembang anak secara visual.",
      "Membuat modul otomatis generator rekomendasi gizi berbasis indikator hasil deteksi kondisi fisik anak.",
      "Membuat arsitektur RESTful API dengan Laravel dan MySQL serta integrasi peta wilayah menggunakan React Leaflet.",
    ],
  },
  {
    id: "time-5",
    type: "pengalaman",
    title:
      "Full-Stack Developer — SwadayaApps, Sistem Manajemen & Payment Gateway Billing PDAM Desa",
    institution:
      "Swadaya Air Desa Soka Lerep - Ungaran Barat, Kabupaten Semarang, Jawa Tengah",
    period: "Mei 2026 - Jun 2026",
    points: [
      "Saya merancang aplikasi ini untuk mempermudah petugas dan warga Desa Soka Lerep dalam pencatatan meteran air hingga pembayaran tagihan bulanan.",
      "Merancang aplikasi Smart-Utility untuk otomatisasi konversi angka meteran air fisik warga menjadi nilai tagihan pembayaran secara akurat.",
      "Membangun panel kontrol manajemen data pelanggan serta laporan komparatif riwayat pembayaran bulanan.",
      "Mengintegrasikan Payment Gateway untuk memfasilitasi transaksi pembayaran tagihan air bulanan secara instan dan aman.",
      "Mengembangkan arsitektur aplikasi menggunakan React, TypeScript, Vite, Laravel 12, dan basis data MySQL.",
    ],
  },
  {
    id: "time-6",
    type: "pendidikan",
    title: "S1 Teknik Informatika",
    institution: "Universitas Dian Nuswantoro",
    period: "Agu 2022 - Sep 2026",
    points: [
      "Selama kuliah S1 Teknik Informatika di UDINUS, saya fokus mendalami rekayasa perangkat lunak, pemrograman web, dan manajemen basis data.",
      "Menjalani kuliah S1 Teknik Informatika dengan capaian IPK 3,80 dari skala 4.00 (predikat Cumlaude).",
      "Mempelajari materi utama berupa rekayasa perangkat lunak, pemograman web, basis data, dan struktur data.",
      "Mengikuti pelatihan dan kursus mandiri di luar jam kuliah untuk menambah keterampilan pembuatan aplikasi.",
      "Menjadi anggota komunitas Jaringan Komputer di kampus untuk mempelajari dasar-dasar infrastruktur jaringan dan IT.",
    ],
  },
  {
    id: "time-7",
    type: "pendidikan",
    title: "SMA, Jurusan MIPA",
    institution: "SMAN 2 Ungaran",
    period: "Jul 2018 - Mei 2021",
    points: [
      "Pendidikan MIPA di SMAN 2 Ungaran menjadi tempat saya melatih logika matematika, analitis, dan problem solving dasar.",
      "Menyelesaikan pendidikan jurusan MIPA dengan nilai rata-rata Ujian Sekolah 85,00 dari skala 100.",
      "Memperoleh nilai tertinggi pada mata pelajaran Sejarah Indonesia (89), Matematika (88), dan Kimia (88).",
      "Mempertahankan nilai yang stabil pada seluruh mata pelajaran kelompok IPA dan mata pelajaran umum.",
      "Mempelajari dasar-dasar logika dan pemecahan masalah melalui mata pelajaran matematika dan sains.",
    ],
  },
];
