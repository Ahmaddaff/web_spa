import {
  Github,
  Globe,
  Instagram,
  Linkedin,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";

export const profile = {
  name: "Ahmad Dafanda Abdullah",
  shortName: "Dafanda",
  initials: "AD",
  title: "Information Technology Student",
  tagline:
    "Information Technology student who loves building digital products, exploring IoT, and leading organizations that create real impact.",
  roles: [
    "Information Technology Student",
    "Web Developer",
    "IoT Engineer",
    "Legislative Leader",
    "Public Relations Specialist",
  ],
  location: "Purbalingga, Jawa Tengah, Indonesia",
  address: "Toyareka 002/001, Kemangkon, Purbalingga, Jawa Tengah",
  email: "adnafaddamha@gmail.com",
  phone: "+62 895 4211 69504",
  phoneRaw: "628954211695094",
  university: "Universitas Amikom Purwokerto",
  major: "S1 Teknologi Informasi",
  photo: "/images/profile-v9.png",
  resumeUrl: "/cv/CV-Ahmad-Dafanda-Abdullah-2026.pdf",
  bio: "Mahasiswa Program Studi Teknologi Informasi yang memiliki minat tinggi dalam pengembangan diri, kepemimpinan, dan organisasi. Terbiasa bekerja secara kolaboratif maupun mandiri, serta memiliki kemampuan komunikasi yang baik dan bertanggung jawab dalam menjalankan tugas. Aktif berkontribusi dalam berbagai kegiatan kemahasiswaan dan kepanitiaan, dengan fokus pada peningkatan keterampilan manajerial, problem solving, dan pengambilan keputusan. Siap belajar hal baru serta beradaptasi dengan lingkungan kerja yang dinamis.",
  motivation:
    "Memiliki motivasi tinggi untuk terus belajar, berkembang, dan berkontribusi secara aktif dengan penuh tanggung jawab serta kerja sama yang baik dalam mencapai tujuan bersama.",
} as const;

export type Social = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const socials: Social[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/siamatcuyy",
    icon: Instagram,
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/ahmad-da-b1a960357",
    icon: Linkedin,
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/628954211695094",
    icon: MessageCircle,
  },
  { name: "GitHub", href: "https://github.com/Ahmaddaff", icon: Github },
  { name: "Website", href: "https://aboutdafanda.vercel.app", icon: Globe },
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Play", href: "#minigame" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export const stats = [
  { label: "Tahun pengalaman organisasi", value: 2, suffix: "+" },
  { label: "Event & proyek", value: 10, suffix: "+" },
  { label: "Skill & teknologi", value: 30, suffix: "+" },
  { label: "Peran kepemimpinan", value: 4, suffix: "+" },
  { label: "Pengalaman & kepanitiaan", value: 7, suffix: "+" },
  { label: "Ketua Umum Senat Mahasiswa", value: 2026, suffix: "" },
];

export const education = [
  {
    school: "Universitas Amikom Purwokerto",
    degree: "S1 Teknologi Informasi",
    period: "2024 — sekarang",
    current: true,
  },
  {
    school: "SMA N 1 Bukateja",
    degree: "Sekolah Menengah Atas — MIPA",
    period: "2020 — 2023",
    current: false,
  },
];

export const languages = [
  { name: "Bahasa Indonesia", level: "Native", percent: 100 },
  { name: "English", level: "Intermediate", percent: 80 },
];

export type ExperienceItem = {
  org: string;
  role: string;
  period: string;
  bullets: string[];
  tags: string[];
};

export const experiences: ExperienceItem[] = [
  {
    org: "Senat Mahasiswa Universitas Amikom Purwokerto",
    role: "Ketua Umum",
    period: "2026 — sekarang",
    bullets: [
      "Memimpin keseluruhan kegiatan legislatif dan penyaluran aspirasi mahasiswa FIK.",
      "Mengoordinasikan komisi serta badan legislatif mahasiswa.",
      "Menjembatani komunikasi antara mahasiswa dan pimpinan universitas.",
    ],
    tags: ["Leadership", "Legislatif", "Public Speaking"],
  },
  {
    org: "TECH4FEST",
    role: "Chief Field Coordinator",
    period: "2026",
    bullets: [
      "Mengoordinasikan seluruh petugas lapangan dan jalannya acara di venue.",
      "Memastikan kelancaran teknis dan operasional setiap sesi festival.",
    ],
    tags: ["Event Management", "Koordinasi Lapangan"],
  },
  {
    org: "Expo Kampus Berdampak FIK",
    role: "Wakil Ketua Expo",
    period: "2025",
    bullets: [
      "Mendampingi ketua dalam perencanaan dan eksekusi pameran kampus.",
      "Mengoordinasikan divisi panitia dan para ekshibitor.",
    ],
    tags: ["Event Management", "Leadership"],
  },
  {
    org: "Pemira 2025",
    role: "Sekretaris Panitia Pengawas",
    period: "2025",
    bullets: [
      "Mengelola administrasi dan dokumentasi lengkap proses pemilihan.",
      "Mengawasi pemungutan dan penghitungan suara agar berjalan jujur dan adil.",
      "Menyusun laporan hasil pengawasan pemilihan.",
    ],
    tags: ["Administrasi", "Pengawasan", "Dokumentasi"],
  },
  {
    org: "FIK Got Talent",
    role: "Ketua Pelaksana",
    period: "2025",
    bullets: [
      "Memimpin keseluruhan pelaksanaan ajang pencarian bakat tingkat FIK.",
      "Mengoordinasikan juri, peserta, dan teknis pementasan.",
    ],
    tags: ["Event Management", "Leadership"],
  },
  {
    org: "Senat Mahasiswa Universitas Amikom Purwokerto",
    role: "Legislatif Muda Komisi B",
    period: "2025",
    bullets: [
      "Menampung dan menyalurkan aspirasi mahasiswa melalui forum Komisi B SEMA.",
      "Terlibat dalam penyusunan produk legislasi (kebijakan) senat mahasiswa.",
      "Mengoordinasikan jalannya diskusi legislasi dan aspirasi di komisi.",
    ],
    tags: ["Legislasi", "Aspirasi", "Kolaborasi"],
  },
  {
    org: "HMPS Teknologi Informasi",
    role: "Kepala Departemen Public Relations",
    period: "2024 — 2025",
    bullets: [
      "Menjabat sebagai Penanggung Jawab Kepanitiaan Serutek.",
      "Berperan sebagai Koordinator Humas Kepanitiaan Technofest.",
      "Menjabat sebagai Penanggung Jawab Kepanitiaan Connextion.",
    ],
    tags: ["Public Relations", "Humas", "Networking"],
  },
];

export const skillCategories = [
  {
    title: "Frontend",
    icon: "layout",
    skills: [
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Tailwind CSS",
    ],
  },
  {
    title: "Backend",
    icon: "server",
    skills: ["Node.js", "PHP", "MySQL", "REST API", "Firebase"],
  },
  {
    title: "IoT & Embedded",
    icon: "cpu",
    skills: ["Arduino", "ESP32", "Sensor Integration", "MQTT", "IoT Dashboard"],
  },
  {
    title: "Tools",
    icon: "wrench",
    skills: ["Git", "GitHub", "VS Code", "Figma", "Vercel", "Postman"],
  },
  {
    title: "Creative & Motion",
    icon: "sparkles",
    skills: ["Framer Motion", "Three.js", "WebGL", "UI Animation"],
  },
  {
    title: "Soft Skills",
    icon: "users",
    skills: [
      "Leadership",
      "Discipline",
      "Responsibility",
      "Teamwork",
      "Time Management",
      "Critical Thinking",
      "Communication",
      "Mental & Physical Endurance",
    ],
  },
];

export type Project = {
  title: string;
  category: string;
  description: string;
  tags: string[];
  icon: string;
  demo: string | null;
  demoLabel?: string;
  demo2?: string | null;
  demo2Label?: string;
  repo: string | null;
  featured: boolean;
};

export const projects: Project[] = [
  {
    title: "Smart Spirometry",
    category: "IoT & Health Tech",
    description:
      "Proyek IoT pengukur kapasitas paru-paru berbasis mikrokontroler dan sensor aliran air (waterflow sensor) yang mengukur volume serta laju tiupan napas secara real-time. Tersedia dua web: halaman pengujian tiupan napas dan halaman penjelasan perangkat.",
    tags: ["IoT", "Mikrokontroler", "Waterflow Sensor", "Telemetri"],
    icon: "activity",
    demo: "https://ungu.in/smartspirometry",
    demoLabel: "Live Test",
    demo2: "https://ungu.in/profilesmartspirometry",
    demo2Label: "Device Profile",
    repo: "https://github.com/Ahmaddaff/smart-spirometry-web",
    featured: true,
  },
  {
    title: "AmikomMart — SisTer",
    category: "Web Development",
    description:
      "Aplikasi web marketplace kampus untuk upload dan mengelola produk jual beli antar mahasiswa Universitas Amikom, dengan frontend berbasis JavaScript.",
    tags: ["JavaScript", "Node.js", "Frontend", "Marketplace"],
    icon: "shopping",
    demo: null,
    repo: "https://github.com/Ahmaddaff/AmikomMart-SisTer-",
    featured: false,
  },
  {
    title:
      "Peningkatan Literasi IoT Melalui Simulasi Wokwi Bagi Siswa SMP Muhammadiyah 1 Purwokerto",
    category: "Publikasi · Jurnal Pengabdian",
    description:
      "Pelatihan IoT untuk 30 siswa menggunakan simulator Wokwi, termasuk praktik membuat simulasi lampu lalu lintas dengan mikrokontroler. Hasilnya menunjukkan Wokwi membantu pembelajaran IoT di sekolah dengan keterbatasan perangkat keras. Ahmad Dafanda Abdullah et al. — Aksi Kolektif: Jurnal Pengabdian, 2025 · Vol. 2 No. 1 · Hal. 51–57.",
    tags: ["IoT", "Wokwi", "Pengabdian", "Publikasi"],
    icon: "book",
    demo: "https://glonus.org/index.php/aksikolektif/article/view/331",
    demoLabel: "Baca Artikel",
    repo: null,
    featured: false,
  },
  {
    title:
      "Sistem Pelaporan Kerusakan Fasilitas Kampus Berbasis Identitas Terverifikasi dan Agregasi Data untuk Prioritas Perbaikan",
    category: "Publikasi · Jurnal Riset",
    description:
      "Penelitian ini merancang sistem pelaporan kerusakan fasilitas kampus dengan identitas pelapor terverifikasi dan dashboard data agregat. Abstrak melaporkan formulir laporan terstruktur, ringkasan tren per lokasi, serta dukungan untuk verifikasi, privasi, transparansi, dan penentuan prioritas perbaikan. Ahmad Dafanda Abdullah et al. — Indonesian Journal of Multidisciplinary Scientific Studies, 2026 · Vol. 4 No. 4 · DOI: 10.33151/ijomss.v4i4.959.",
    tags: ["Riset", "Sistem Informasi", "Dashboard", "Publikasi"],
    icon: "book",
    demo: "https://ojs.staira.ac.id/index.php/IJOMSS/article/view/959",
    demoLabel: "Baca Artikel",
    repo: null,
    featured: false,
  },
];

export const marqueeItems = [
  "React",
  "Next.js",
  "TypeScript",
  "JavaScript",
  "Tailwind CSS",
  "Node.js",
  "MySQL",
  "Arduino",
  "ESP32",
  "IoT",
  "Git",
  "GitHub",
  "Figma",
  "Framer Motion",
  "Three.js",
  "Vercel",
];
