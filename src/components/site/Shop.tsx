import { useLang } from "@/i18n/LanguageContext";
import { availableArtworks, type Artwork } from "@/data/artworks";

const fmt = (lang: string, eur: number) =>
  new Intl.NumberFormat(lang === "ar" ? "ar" : lang, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(eur);

export function Shop({ onSelect }: { onSelect: (a: Artwork) => void }) {
  const { t, lang } = useLang();
  const items = availableArtworks();

  if (items.length === 0) {
    return (
      <section id="shop" className="py-32 md:py-48 px-[5vw] section-depth">
        <div className="mx-auto max-w-[1500px] text-center">
          <p className="eyebrow">{t.shop.eyebrow}</p>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">{t.shop.title}</h2>
          <p className="mt-6 max-w-[50ch] mx-auto text-ink-soft font-light italic">{t.shop.empty}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="shop" className="py-32 md:py-48 px-[5vw] section-depth">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center mb-16">
          <p className="eyebrow">{t.shop.eyebrow}</p>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">{t.shop.title}</h2>
          <p className="mt-4 max-w-[55ch] mx-auto text-ink-soft font-light">{t.shop.sub}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {items.map((a) => (
            <article key={a.id} className="group">
              <button
                type="button"
                onClick={() => onSelect(a)}
                className="block w-full text-start"
              >
                <div className="relative overflow-hidden bg-stone-soft aspect-[4/5] shadow-soft art-vignette glass-card p-2">
                  <img
                    src={a.image}
                    alt={a.title}
                    loading="lazy"
                    className="w-full h-full object-cover brightness-80 transition-all duration-[1600ms] ease-out group-hover:scale-105 group-hover:brightness-100"
                  />
                  <span className="absolute top-4 start-4 bg-background/85 backdrop-blur-sm px-3 py-1 text-[9px] uppercase tracking-[0.3em] text-ink-soft border border-border">
                    {t.shop.available}
                  </span>
                </div>
              </button>
              <div className="mt-5 flex items-baseline justify-between gap-4">
                <div>
                  <h3 className="font-serif text-lg md:text-xl italic text-foreground">{a.title}</h3>
                  <p className="mt-1 text-[11px] text-ink-soft tracking-wide">
                    {a.category}{a.year ? ` · ${a.year}` : ""}
                  </p>
                </div>
                <p className="font-serif text-lg text-foreground tabular-nums">{fmt(lang, a.price!)}</p>
              </div>
              <button
                type="button"
                onClick={() => onSelect(a)}
                className="cinematic-button mt-5 w-full inline-flex items-center justify-center gap-3 px-6 py-3 text-[10px] uppercase tracking-[0.28em]"
              >
                {t.shop.buy}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
