import { useLang } from "@/i18n/LanguageContext";
import { heroArtwork } from "@/data/artworks";

export function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative min-h-screen pt-32 pb-20 md:pb-32 px-6 md:px-12 overflow-hidden grain">
      <div className="mx-auto max-w-[1600px] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        <div className="lg:col-span-5 lg:pb-16 z-10 parallax-text">
          <p className="eyebrow reveal">{t.hero.eyebrow}</p>
          <h1 className="mt-8 font-serif text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[4.25rem] leading-[1.05] text-foreground reveal reveal-delay-1">
            {t.hero.tagline.split(" ").map((w, i, arr) => {
              const isAccent = w.toLowerCase() === "color" || w === "اللّون" || w === "couleur" || w === "Farbe";
              return (
                <span key={i} className={isAccent ? "italic text-gold" : ""}>
                  {w}{i < arr.length - 1 ? " " : ""}
                </span>
              );
            })}
          </h1>
          <p className="mt-8 max-w-[42ch] font-serif italic text-lg md:text-xl text-ink-soft leading-relaxed reveal reveal-delay-2">
            {t.hero.sub}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-5 reveal reveal-delay-3">
            <a
              href="#works"
              className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-gold transition-colors duration-500"
            >
              {t.hero.ctaPortfolio}
            </a>
            <a
              href="#commissions"
              className="inline-flex items-center justify-center px-8 py-4 border border-foreground text-[10px] uppercase tracking-[0.3em] hover:bg-foreground hover:text-background transition-colors duration-500"
            >
              {t.hero.ctaCommission}
            </a>
          </div>
        </div>

        <div className="lg:col-span-7 relative">
          <div className="relative aspect-[4/5] lg:aspect-[5/6] overflow-hidden bg-bone shadow-frame art-vignette hero-overlay zoom-in-slow">
            <img
              src={heroArtwork.image}
              alt={heroArtwork.title}
              className="parallax-img w-full h-full object-cover will-change-transform"
              width={1280}
              height={1600}
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5 pointer-events-none z-10" />
          </div>
          <div className="hidden md:block absolute -bottom-10 start-6 lg:-start-10 bg-background border border-border px-7 py-6 shadow-soft max-w-xs reveal reveal-delay-3 z-20">
            <p className="text-[9px] uppercase tracking-[0.3em] text-gold mb-2">I.</p>
            <p className="font-serif text-base text-foreground leading-snug">{heroArtwork.title}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
