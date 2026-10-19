import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ahmad Dafanda Abdullah — Information Technology Student & Web Developer",
    template: "%s | Ahmad Dafanda Abdullah",
  },
  description:
    "Personal portfolio of Ahmad Dafanda Abdullah — Information Technology student at Universitas Amikom Purwokerto, web developer, IoT engineer, and legislative leader.",
  keywords: [
    "Ahmad Dafanda Abdullah",
    "Portfolio",
    "Web Developer",
    "IoT Engineer",
    "Amikom Purwokerto",
    "Teknologi Informasi",
    "Personal Branding",
  ],
  authors: [{ name: "Ahmad Dafanda Abdullah" }],
  openGraph: {
    title: "Ahmad Dafanda Abdullah — Information Technology Student",
    description:
      "Web developer, IoT engineer, and legislative leader. Information Technology student at Universitas Amikom Purwokerto.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D0B14",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body className="font-sans">{children}</body>
    </html>
  );
}
