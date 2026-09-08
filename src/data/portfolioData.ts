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
  tagline: "Merancang arsitektur perangkat lunak scalable dan antarmuka presisi untuk performa optimal",
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
      { name: "HTML", level: "Mahir" },
      { name: "PHP", level: "Mahir" },
      { name: "TypeScript", level: "Mahir" },
      { name: "JavaScript", level: "Mahir" },
      { name: "Python", level: "Dasar" },
      { name: "C++", level: "Dasar" }
    ]
  },
  {
    title: "Frontend Development",
    skills: [
      { name: "React.js", level: "Mahir" },
      { name: "Next.js", level: "Mahir" },
      { name: "Tailwind CSS", level: "Mahir" },
      { name: "Bootstrap", level: "Mahir" },
      { name: "Three.js / React Three Fiber", level: "Dasar" }
    ]
  },
  {
    title: "Backend Development",
    skills: [
      { name: "Laravel", level: "Mahir" },
      { name: "RESTful API / GraphQL", level: "Mahir" },
    ]
  },
  {
    title: "Database Systems",
    skills: [
      { name: "PostgreSQL", level: "Mahir" },
      { name: "MongoDB", level: "Mahir" },
      { name: "Redis (Caching)", level: "Menengah" },
      { name: "MySQL", level: "Menengah" }
    ]
  },
  {
    title: "Tools & Deployment",
    skills: [
      { name: "Docker", level: "Mahir" },
      { name: "Git / GitHub Actions", level: "Mahir" },
      { name: "AWS (S3 / EC2)", level: "Menengah" },
      { name: "Vercel / Netlify", level: "Mahir" },
      { name: "Linux / Bash", level: "Menengah" }
    ]
  }
];

export const projectsData: Project[] = [
  {
    id: "project-1",
    title: "Skyline ERP System",
    shortDesc: "Sistem ERP modular komprehensif untuk optimasi inventaris dan pelaporan keuangan real-time perusahaan retail.",
    longDesc: "Skyline ERP menyelesaikan masalah mismanajemen stok dan pelaporan keuangan retail. Dibangun dengan backend Go berkinerja tinggi, caching Redis, dan frontend React. Sistem ini menangani sinkronisasi stok real-time melalui WebSocket dan menyajikan analitik data inventaris masif dengan dashboard grafik yang responsif.",
    tech: ["Go", "React.js", "PostgreSQL", "Redis", "Tailwind CSS", "WebSockets"],
    demoUrl: "https://skyline-demo.vercel.app",
    githubUrl: "https://github.com/aryazhur/skyline-erp",
    mediaType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34287-large.mp4", // Free stock video placeholder
    featured: true
  },
  {
    id: "project-2",
    title: "Nova Collaborative Workspace",
    shortDesc: "Platform kolaborasi tim mirip Notion dengan editor rich-text, papan kanban interaktif, dan voice call terintegrasi.",
    longDesc: "Nova mempermudah koordinasi tim jarak jauh. Fitur unggulannya adalah editor dokumen real-time kolaboratif (menggunakan CRDTs / Yjs) dan manajemen tugas drag-and-drop. Terintegrasi dengan WebRTC untuk voice/video channel instan tanpa perlu beralih ke aplikasi komunikasi pihak ketiga.",
    tech: ["Next.js", "TypeScript", "Node.js", "Socket.io", "MongoDB", "Tailwind CSS"],
    demoUrl: "https://nova-workspace.vercel.app",
    githubUrl: "https://github.com/aryazhur/nova-workspace",
    mediaType: "video",
    mediaUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-typing-on-a-computer-keyboard-40048-large.mp4", // Free stock video placeholder
    featured: true
  },
  {
    id: "project-3",
    title: "Aura 3D Music Visualizer",
    shortDesc: "Audio visualizer 3D berbasis web interaktif dengan partikel yang bereaksi terhadap frekuensi audio.",
    longDesc: "Visualizer audio 3D real-time yang memproses file audio pengguna melalui Web Audio API dan memanipulasi ratusan ribu partikel 3D di layar menggunakan WebGL shaders. Memberikan pengalaman visual yang imersif dan terikat kuat dengan bit, melodi, serta frekuensi bass lagu.",
    tech: ["React Three Fiber", "Three.js", "Web Audio API", "GLSL Shaders", "Tailwind CSS"],
    demoUrl: "https://aura-3d-visualizer.vercel.app",
    githubUrl: "https://github.com/aryazhur/aura-3d",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "project-4",
    title: "Apex E-Commerce Engine",
    shortDesc: "Headless e-commerce engine berkinerja tinggi dengan multi-payment gateway dan sistem manajemen promo dinamis.",
    longDesc: "Menyediakan API backend belanja yang sangat cepat dan aman. Mendukung integrasi Payment Gateway Midtrans, kalkulasi ongkos kirim otomatis RajaOngkir, serta caching katalog produk sensitif untuk menurunkan latency server di bawah 50ms dalam kondisi load tinggi.",
    tech: ["NestJS", "TypeScript", "PostgreSQL", "Midtrans API", "Docker", "Redis"],
    demoUrl: "https://apex-store-demo.vercel.app",
    githubUrl: "https://github.com/aryazhur/apex-ecommerce",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80",
    featured: false
  },
  {
    id: "project-5",
    title: "EcoSphere IoT Dashboard",
    shortDesc: "Dashboard monitoring sensor kelembapan tanah dan suhu lingkungan pertanian pintar berbasis protokol MQTT.",
    longDesc: "Dirancang untuk sektor agritech, EcoSphere menerima data telemetri dari mikrokontroler ESP32 melalui protokol MQTT. Dashboard menyajikan data sensor secara real-time dan memberikan notifikasi otomatis jika kelembapan tanah turun di bawah batas kritis.",
    tech: ["React.js", "Node.js", "MQTT Broker", "InfluxDB", "ChartJS", "Tailwind CSS"],
    demoUrl: "https://ecosphere-iot.vercel.app",
    githubUrl: "https://github.com/aryazhur/ecosphere-iot",
    mediaType: "image",
    mediaUrl: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80",
    featured: false
  }
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
      "Menulis automated testing menggunakan Jest dan React Testing Library untuk cakupan kode sebesar 85%."
    ]
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
      "Membantu mahasiswa menguasai konsep dasar clean architecture dan pemanfaatan Git."
    ]
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
      "Aktif dalam Himpunan Mahasiswa Informatika sebagai Kepala Divisi Riset & Teknologi."
    ]
  }
];
