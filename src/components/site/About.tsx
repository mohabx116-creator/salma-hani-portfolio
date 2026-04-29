import { useLang } from "@/i18n/LanguageContext";

export function About() {
  const { t } = useLang();
  return (
    <section id="about" className="py-32 md:py-48 px-6 md:px-12 bg-bone/40 section-depth">
      <div className="mx-auto max-w-[900px] text-center">
        <p className="eyebrow">{t.about.eyebrow}</p>
        <h2 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.05] text-ink tracking-tight">
          {t.about.title}
        </h2>
        <div className="mt-6 mx-auto h-px w-16 bg-gold/60" />
        <div className="mt-12 space-y-6 text-base md:text-[1.0625rem] text-ink/85 leading-[1.85] font-light">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
        </div>
        <figure className="mt-16 relative inline-block max-w-[44ch] mx-auto">
          <span aria-hidden className="absolute -top-8 -start-2 font-serif italic text-7xl md:text-8xl text-gold/30 leading-none select-none">
            &ldquo;
          </span>
          <blockquote className="font-serif italic text-2xl md:text-3xl text-ink leading-[1.4]">
            {t.about.quote}
          </blockquote>
          <figcaption className="mt-6 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.32em] text-ink-soft">
            <span className="h-px w-8 bg-ink-soft/50" />
            {t.about.signature}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
