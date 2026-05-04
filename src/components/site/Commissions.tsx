import abstract from "@/assets/artworks/circle-of-thoughts.png";
import { useLang } from "@/i18n/LanguageContext";

export function Commissions() {
  const { t } = useLang();
  return (
    <section id="commissions" className="py-32 md:py-48 px-[5vw]">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
        <div className="md:col-span-7 md:order-2">
          <div className="relative aspect-[4/5] overflow-hidden bg-bone shadow-frame art-vignette">
            <img src={abstract} alt="Commission sample" loading="lazy" className="w-full h-full object-cover brightness-80 saturate-[0.9]" />
          </div>
        </div>
        <div className="md:col-span-5 md:order-1">
          <p className="eyebrow">{t.commissions.eyebrow}</p>
          <h2 className="mt-6 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground leading-[1.05]">
            {t.commissions.title}
          </h2>
          <p className="mt-8 text-ink-soft font-light leading-relaxed text-base md:text-lg max-w-[50ch]">
            {t.commissions.p}
          </p>
          <ul className="mt-10 space-y-4">
            {t.commissions.bullets.map((b, i) => (
              <li key={i} className="flex items-baseline gap-4 text-foreground">
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold tabular-nums">
                  0{i + 1}
                </span>
                <span className="text-base font-light">{b}</span>
              </li>
            ))}
          </ul>
          <a
            href="#contact"
            className="cinematic-button mt-12 inline-flex items-center gap-4 px-8 py-4 text-[10px] uppercase tracking-[0.28em]"
          >
            {t.commissions.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
