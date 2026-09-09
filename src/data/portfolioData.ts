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
  mediaUrl: string; // Placeholder path
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

export const profileData: Profile = {
  name: "Muhammad Rizal",
  avatar: "/assets/images/Foto1.jpeg",
  role: "Full-Stack Engineer",
  tagline:
    "Merancang arsitektur perangkat lunak scalable dan antarmuka presisi untuk performa optimal",
  bio: "Seorang Full-Stack Engineer dengan spesialisasi dalam rekayasa perangkat lunak modern. Memiliki keahlian mendalam dalam merancang arsitektur web modular, mengoptimalkan database relasional, dan menciptakan antarmuka interaktif. Berpengalaman mengeksekusi proyek kompleks dari fase perancangan sistem hingga deployment berskala produksi.",
  cvUrl: "/cv-placeholder.pdf",
  email: "mailto:muhammadrizal52@gmail.com",
  whatsapp: "https://wa.me/6283162253730", // Placeholder WA link
  github: "https://github.com/AzhuraaaReyy", // Placeholder Github link
  linkedin: "https://linkedin.com/in/aryazhur", // Placeholder Linkedin link
};

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
      { name: "Next.js", level: "Mahir" },
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
      { name: "PostgreSQL", level: "Mahir" },
      { name: "MySQL", level: "Mahir" },
    ],
  },
  {
    title: "Tools & Deployment",
    skills: [
      { name: "Git / GitHub", level: "Mahir" },
      { name: "Vercel / Netlify", level: "Mahir" },
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
      "Next.js (React)",
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
    mediaUrl: "",
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
      "Next.js",
      "TypeScript",
      "Supabase (BaaS)",
      "Row Level Security (RLS)",
      "Tailwind CSS",
      "MapLibre GL",
      "Framer Motion",
    ],
    demoUrl: "https://rotimulya.vercel.app/",
    githubUrl: "https://github.com/AzhuraaaReyy/Website_MulyaBakery", // Sesuaikan dengan repo Anda
    mediaType: "video", // Gunakan "image" jika ingin memasang screenshot halaman login/landingnya
    mediaUrl: "/assets/images/MulyaBakery.png", // Jalur absolut dari folder public Anda
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
      "Next.js (React)",
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
    title: "Full-Stack Developer Intern",
    institution: "Tech Solutions Nusantara",
    period: "Jul 2025 - Des 2025",
    points: [
      "Mengembangkan fitur dashboard analytics internal menggunakan Next.js dan TypeScript, mempercepat waktu rendering halaman sebesar 30%.",
      "Merancang ulang RESTful API krusial untuk pemrosesan pembayaran, mengurangi tingkat error transaksi bulanan dari 2.4% menjadi di bawah 0.2%.",
      "Menulis automated testing menggunakan Jest dan React Testing Library untuk cakupan kode sebesar 85%.",
    ],
  },
  {
    id: "time-2",
    type: "pengalaman",
    title: "Asisten Dosen Praktikum Pemrograman Web",
    institution: "Universitas Indonesia / IT Universitas",
    period: "Feb 2025 - Jun 2025",
    points: [
      "Mengajar dan membimbing kelas praktikum berisikan 40+ mahasiswa dalam mempelajari HTML5, CSS3, JavaScript, dan framework React.",
      "Merancang soal ujian praktikum dan menilai proyek akhir web responsif buatan mahasiswa.",
      "Membantu mahasiswa menguasai konsep dasar clean architecture dan pemanfaatan Git.",
    ],
  },
  {
    id: "time-3",
    type: "pendidikan",
    title: "Sarjana Komputer - Teknik Informatika",
    institution: "Universitas Komputer Unggulan",
    period: "2022 - Sekarang (Semester 8)",
    points: [
      "IPK Terakhir: 3.82 / 4.00.",
      "Fokus Penelitian / Tugas Akhir: Analisis Perbandingan Latency Sistem Microservices menggunakan gRPC vs REST API dalam Ekosistem Docker.",
      "Aktif dalam Himpunan Mahasiswa Informatika sebagai Kepala Divisi Riset & Teknologi.",
    ],
  },
];
