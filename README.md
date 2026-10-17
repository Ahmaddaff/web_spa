# Website Portfolio — Ahmad Dafanda Abdullah

Website personal branding single-page (SPA-style) yang modern, interaktif, dan high-converting — dibangun langsung dari data CV.

## Tech Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** — dark obsidian theme (`#0a0a0a`) dengan aksen neon cyan/violet
- **Shadcn-style UI components** — Button, Card, Badge, Input, Textarea
- **Aceternity-style effects** — grid background, spotlight card, tracing beam timeline, tech marquee, glowing photo frame
- **Framer Motion** — scroll-triggered animations & micro-interactions
- **React Three Fiber + Three.js** — 3D icosahedron + particle starfield di Hero
- **Lucide React** — icon set

## Requirements

- Node.js 18.18+ (disarankan 20+)
- npm 9+

## Setup & Menjalankan

```bash
# 1. Install dependencies
npm install

# 2. Jalankan development server
npm run dev
# buka http://localhost:3000
```

Build production:

```bash
npm run build
npm run start
```

Type-check saja:

```bash
npm run typecheck
```

## Struktur Folder

```
WebsiteSPA/
├── public/
│   ├── images/profile.jpg          # Foto profil
│   └── cv/                          # CV (PDF + JPG sumber)
├── src/
│   ├── app/
│   │   ├── globals.css              # Tema, CSS variables, glow effects
│   │   ├── layout.tsx               # Root layout + fonts (Inter, Plus Jakarta Sans)
│   │   ├── page.tsx                 # Komposisi semua section
│   │   └── icon.svg                 # Favicon
│   ├── components/
│   │   ├── ui/                      # Shadcn primitives (button, card, badge, input, textarea)
│   │   ├── layout/                  # Navbar + Footer
│   │   ├── sections/                # Hero, About, Skills, Experience, Projects, Contact
│   │   ├── effects/                 # GridBackground, TechMarquee, Typewriter, Counter,
│   │   │                            # SpotlightCard, TiltCard, BackToTop
│   │   ├── three/                   # HeroScene (R3F canvas)
│   │   └── section-heading.tsx      # Reusable section heading
│   ├── data/site-data.ts            # SEMUA data website (edit di sini)
│   ├── hooks/use-scroll-spy.ts      # Active nav link tracking
│   └── lib/utils.ts                 # cn() helper
├── tailwind.config.ts               # Tema warna, animasi (blink, marquee, dll)
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## Kustomisasi

1. **Semua konten** (profil, pengalaman, skill, proyek, sosial media, statistik) berada di
   `src/data/site-data.ts` — tinggal edit nilai di sana, tidak perlu menyentuh komponen.
2. **Ganti foto profil**: timpa `public/images/profile.jpg`.
3. **Ganti CV**: timpa `public/cv/CV-Ahmad-Dafanda-Abdullah-2026.pdf`.
4. **Warna tema**: `src/app/globals.css` (CSS variables) dan `src/tailwind.config.ts`.
5. **Konten email**: email diambil dari CV (`adnafaddamha@gmail.com`) — jika ada typo,
   perbarui di `src/data/site-data.ts`.

## Deploy

Push ke GitHub, lalu import repository di [Vercel](https://vercel.com) —
framework otomatis terdeteksi sebagai Next.js. Alternatif: `npx vercel deploy`.

## Fitur Interaktif

- Typing animation role di Hero (Student / Web Developer / IoT Engineer / Executive Leader)
- 3D icosahedron interaktif yang mengikuti kursor + particle starfield
- Animated counters pada statistik About
- Tracing beam timeline pada Experience (mengikuti scroll)
- Tilt 3D + spotlight glow pada project cards
- Smooth scroll navigation + scroll-spy active state di navbar
- Marquee tech stack, animated glowing photo frame, back-to-top button
