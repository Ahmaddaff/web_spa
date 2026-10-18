import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Minigame } from "@/components/sections/minigame";
import { GatedSections } from "@/components/sections/gated-sections";
import { GridBackground } from "@/components/effects/grid-background";
import { TechMarquee } from "@/components/effects/tech-marquee";
import { StatementMarquee } from "@/components/effects/statement-marquee";
import { Preloader } from "@/components/effects/preloader";
import { BackToTop } from "@/components/effects/back-to-top";
import { CursorGlow } from "@/components/effects/cursor-glow";
import { NoiseOverlay } from "@/components/effects/noise-overlay";
import { RouteTransition } from "@/components/effects/route-transition";
import { UnlockProvider } from "@/components/providers/unlock-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function Home() {
  return (
    <UnlockProvider>
      {/* the page shell owns the base colour so no section can ever expose the
          browser's white canvas through a gap, a repaint or a scroll jump */}
      <main className="relative min-h-screen overflow-x-hidden bg-background">
        <Preloader />
        <GridBackground />
        <Navbar />
        <Hero />
        <TechMarquee />
        {/* the game is the second page: it has to be reached before anything
            it guards, and the guarded sections stay sealed until it is won */}
        <Minigame />
        <GatedSections />
        <StatementMarquee />
        <Contact />
        <Footer />
        <BackToTop />
        <RouteTransition />
        <CursorGlow />
        <NoiseOverlay />
      </main>
    </UnlockProvider>
  );
}
