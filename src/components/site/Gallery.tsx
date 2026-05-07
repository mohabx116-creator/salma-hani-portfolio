import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import type { SiteArtwork } from "@/lib/site-artworks";

export function Gallery({ items, onSelect }: { items: SiteArtwork[]; onSelect: (a: SiteArtwork) => void }) {
  const { t } = useLang();
  const categories = ["all", ...new Set(items.map((item) => item.category).filter(Boolean))];
  const [active, setActive] = useState<string>("all");

  const filteredItems = active === "all" ? items : items.filter((a) => a.category === active);

  return (
    <section id="works" className="py-32 md:py-48 px-[5vw] cinematic-band section-depth">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center mb-16">
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">{t.gallery.title}</h2>
          <p className="mt-4 text-ink-soft font-light">{t.gallery.sub}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mb-16 pb-8 border-b border-border/70">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`text-[11px] uppercase tracking-[0.3em] transition-colors duration-500 pb-1 border-b ${
                active === c
                  ? "text-gold border-gold"
                  : "text-ink-soft/70 border-transparent hover:text-gold"
              }`}
            >
              {c === "all" ? t.gallery.all : c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {filteredItems.map((a, i) => (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className={`group block text-start ${i % 3 === 1 ? "md:mt-16" : ""}`}
            >
              <div className="relative overflow-hidden bg-stone-soft aspect-[4/5] shadow-soft art-vignette glass-card p-2">
                <img
                  src={a.image}
                  alt={a.title}
                  loading="lazy"
                  className="w-full h-full object-cover grayscale brightness-80 transition-all duration-[1600ms] ease-out group-hover:scale-105 group-hover:grayscale-0 group-hover:brightness-100"
                />
                <div className="absolute inset-2 bg-black/15 group-hover:bg-transparent transition-colors duration-700" />
              </div>
              <div className="mt-4">
                <h3 className="font-serif text-base md:text-lg italic text-foreground">{a.title}</h3>
                <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                  {a.category}{a.year ? ` · ${a.year}` : ""}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
