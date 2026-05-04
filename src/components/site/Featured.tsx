import { useLang } from "@/i18n/LanguageContext";
import { featuredArtworks, type Artwork } from "@/data/artworks";

export function Featured({ onSelect }: { onSelect: (a: Artwork) => void }) {
  const { t } = useLang();
  const items = featuredArtworks().slice(0, 3);

  return (
    <section className="py-32 md:py-48 px-[5vw]">
      <div className="mx-auto max-w-[1500px]">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 md:mb-24 gap-6">
          <div>
            <p className="eyebrow">{t.featured.eyebrow}</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">
              {t.featured.title}
            </h2>
            <p className="mt-5 max-w-[40ch] text-ink-soft text-base md:text-lg font-light">{t.featured.sub}</p>
          </div>
          <a href="#works" className="group inline-flex items-center gap-4 self-start md:self-end">
            <span className="text-[10px] uppercase tracking-[0.28em] text-gold">
              {t.featured.viewAll}
            </span>
            <span className="block h-px w-10 bg-gold transition-all duration-700 group-hover:w-16" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10">
          {items.map((a, i) => (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className={`group block text-start ${
                i === 0 ? "md:col-span-7" : i === 1 ? "md:col-span-5 md:mt-24" : "md:col-span-12 md:max-w-3xl md:mx-auto"
              }`}
            >
              <div className="relative overflow-hidden bg-stone-soft shadow-soft art-vignette aspect-[4/5]">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover brightness-75 saturate-[0.88] transition-all duration-[1600ms] ease-out group-hover:scale-[1.04] group-hover:brightness-95 group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-black/20 transition-colors duration-700 group-hover:bg-transparent" />
              </div>
              <div className="mt-5 flex items-baseline justify-between gap-6">
                <div>
                  <h3 className="font-serif text-xl md:text-2xl text-foreground italic">{a.title}</h3>
                  <p className="mt-1 text-xs text-ink-soft tracking-wide">{a.category}</p>
                </div>
                {a.year && <p className="text-[10px] uppercase tracking-[0.25em] text-gold tabular-nums">{a.year}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
