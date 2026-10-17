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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
