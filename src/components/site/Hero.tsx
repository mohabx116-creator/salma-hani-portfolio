import { useLang } from "@/i18n/LanguageContext";
import { heroArtwork } from "@/data/artworks";

export function Hero() {
  const { t } = useLang();

  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 md:px-12 grain">
      <div className="absolute inset-0 z-0 hero-overlay">
        <img
          src={heroArtwork.image}
          alt={heroArtwork.title}
          className="parallax-img h-full w-full object-cover opacity-75 blur-[1px] saturate-[0.85] contrast-125 will-change-transform dark:opacity-55"
          width={1600}
          height={1200}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl pt-24 text-center parallax-text">
        <p className="eyebrow reveal text-gold">{t.hero.eyebrow}</p>
        <h1 className="mt-7 font-serif text-[3rem] leading-[1.08] text-foreground sm:text-6xl md:text-7xl reveal reveal-delay-1">
          Salma Hani
        </h1>
        <p className="mx-auto mt-5 max-w-[46ch] text-sm leading-relaxed text-ink-soft md:text-lg reveal reveal-delay-2">
          {t.hero.sub}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4 reveal reveal-delay-3">
          <a
            href="#works"
            className="cinematic-button inline-flex items-center justify-center px-8 py-4 text-[10px] uppercase tracking-[0.28em] md:px-12"
          >
            {t.hero.ctaPortfolio}
          </a>
          <a
            href="#commissions"
            className="cinematic-button inline-flex items-center justify-center px-8 py-4 text-[10px] uppercase tracking-[0.28em] md:px-12"
          >
            {t.hero.ctaCommission}
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-4">
        <span className="text-[9px] uppercase tracking-[0.42em] text-gold/80">Scroll</span>
        <span className="h-14 w-px bg-gradient-to-b from-gold/70 to-transparent" />
      </div>
    </section>
  );
}
