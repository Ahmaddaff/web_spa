import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-jakarta)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        /* Neon Arcade / Synthwave palette — the reference for the whole UI.
           hexes are the ones from the mood board, exposed as a semantic group
           so components can name an intent instead of a random hue. */
        arcade: {
          bg: "#0D0B14",
          card: "#161320",
          line: "#2D2438",
          purple: "#A855F7",
          cyan: "#00E5FF",
          magenta: "#FF007F",
          green: "#00FF66",
          dim: "#4B5563",
          text: "#F8FAFC",
          muted: "#94A3B8",
        },
        /* cyan is now the arcade cyan, not Tailwind's default blue-cyan.
           Everything that already used cyan-* picks the neon colour up. */
        cyan: {
          50: "#E6FEFF",
          100: "#B8FBFF",
          200: "#8AF5FF",
          300: "#5CEFFF",
          400: "#00E5FF",
          500: "#00C7E0",
          600: "#00A3B8",
          700: "#007B8C",
          800: "#005C68",
          900: "#00414B",
          950: "#002B33",
        },
        /* violet is the electric purple accent */
        violet: {
          50: "#F5EDFF",
          100: "#EAD9FF",
          200: "#DDBBFF",
          300: "#C48CFF",
          400: "#A855F7",
          500: "#9333EA",
          600: "#7C3AED",
          700: "#6625C4",
          800: "#4F1D96",
          900: "#3A1670",
          950: "#251047",
        },
        /* emerald is the pixel-green "unlocked" status */
        emerald: {
          50: "#E6FFEE",
          100: "#B8FFD0",
          200: "#8AFFB4",
          300: "#4DFF92",
          400: "#00FF66",
          500: "#00DB57",
          600: "#00B346",
          700: "#008A36",
          800: "#006729",
          900: "#00491D",
          950: "#003313",
        },
        /* rose is the vivid magenta highlight */
        rose: {
          50: "#FFE6F0",
          100: "#FFB8D4",
          200: "#FF8AB8",
          300: "#FF5C9E",
          400: "#FF007F",
          500: "#DB0070",
          600: "#B3005C",
          700: "#8A0048",
          800: "#660035",
          900: "#4D0028",
          950: "#33001B",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        /* arcade rim light + outer bloom */
        "neon-purple":
          "0 0 0 1px rgba(168,85,247,0.35), 0 0 22px -4px rgba(168,85,247,0.55)",
        "neon-cyan":
          "0 0 0 1px rgba(0,229,255,0.35), 0 0 22px -4px rgba(0,229,255,0.55)",
        "neon-magenta":
          "0 0 0 1px rgba(255,0,127,0.35), 0 0 22px -4px rgba(255,0,127,0.55)",
        "neon-green":
          "0 0 0 1px rgba(0,255,102,0.35), 0 0 22px -4px rgba(0,255,102,0.55)",
        "arcade-card":
          "inset 0 1px 0 0 rgba(168,85,247,0.10), 0 12px 34px -14px rgba(0,0,0,0.9)",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          from: { transform: "translateX(-50%)" },
          to: { transform: "translateX(0)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "33%": { transform: "translate3d(6%, -4%, 0) scale(1.18)" },
          "66%": { transform: "translate3d(-5%, 5%, 0) scale(0.92)" },
        },
        grain: {
          "0%, 100%": { opacity: "0.045" },
          "50%": { opacity: "0.075" },
        },
        /* arcade extras: a breathing rim, a sweeping scanline, a CRT flicker */
        "neon-pulse": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        "neon-breathe": {
          "0%, 100%": { boxShadow: "0 0 0 1px rgba(0,229,255,0.20)" },
          "50%": { boxShadow: "0 0 0 1px rgba(168,85,247,0.45), 0 0 18px -2px rgba(168,85,247,0.45)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "42%": { opacity: "1" },
          "43%": { opacity: "0.35" },
          "45%": { opacity: "1" },
          "78%": { opacity: "1" },
          "79%": { opacity: "0.5" },
          "81%": { opacity: "1" },
        },
        "glitch-jitter": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "20%": { transform: "translate(-7px, 3px)" },
          "40%": { transform: "translate(6px, -4px)" },
          "60%": { transform: "translate(-4px, -2px)" },
          "80%": { transform: "translate(5px, 4px)" },
        },
        "glitch-chroma": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-14px)" },
          "50%": { transform: "translateX(10px)" },
          "75%": { transform: "translateX(-6px)" },
        },
        "glitch-scan": {
          "0%, 100%": { opacity: "0.15", backgroundPositionY: "0px" },
          "30%": { opacity: "0.7", backgroundPositionY: "6px" },
          "60%": { opacity: "0.25", backgroundPositionY: "-4px" },
        },
        "glitch-flash": {
          "0%, 100%": { opacity: "0" },
          "8%": { opacity: "0.75" },
          "16%": { opacity: "0" },
          "24%": { opacity: "0.55" },
          "32%": { opacity: "0" },
        },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 14s linear infinite",
        shimmer: "shimmer 2s infinite",
        marquee: "marquee 28s linear infinite",
        "marquee-reverse": "marquee-reverse 28s linear infinite",
        aurora: "aurora 26s ease-in-out infinite",
        grain: "grain 7s ease-in-out infinite",
        "neon-pulse": "neon-pulse 2.6s ease-in-out infinite",
        "neon-breathe": "neon-breathe 4s ease-in-out infinite",
        scanline: "scanline 3.5s linear infinite",
        flicker: "flicker 6s linear infinite",
        "glitch-jitter": "glitch-jitter 0.16s steps(2) infinite",
        "glitch-chroma": "glitch-chroma 0.3s steps(3) infinite",
        "glitch-scan": "glitch-scan 0.24s steps(2) infinite",
        "glitch-flash": "glitch-flash 1.7s steps(1) 1",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
