import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useLang } from "@/i18n/LanguageContext";
import type { SiteArtwork } from "@/lib/site-artworks";

export function Gallery({ items, onSelect }: { items: SiteArtwork[]; onSelect: (a: SiteArtwork) => void }) {
  const { t } = useLang();
  const categories = useMemo(() => ["all", ...new Set(items.map((item) => item.category).filter(Boolean))], [items]);
  const years = useMemo(
    () => ["all", ...new Set(items.flatMap((item) => (item.year ? [item.year] : [])))],
    [items],
  );
  const availability = ["all", "available", "unavailable"];
  const [active, setActive] = useState<string>("all");
  const [activeYear, setActiveYear] = useState<string>("all");
  const [activeAvailability, setActiveAvailability] = useState<string>("all");

  const filteredItems = items
    .filter((a) => active === "all" || a.category === active)
    .filter((a) => activeYear === "all" || a.year === activeYear)
    .filter((a) => activeAvailability === "all" || (activeAvailability === "available" ? a.available : !a.available));

  return (
    <section id="works" className="py-32 md:py-48 px-[5vw] cinematic-band section-depth">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center mb-16">
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">{t.gallery.title}</h2>
          <p className="mt-4 text-ink-soft font-light">{t.gallery.sub}</p>
        </div>

        <div className="mb-16 grid gap-5 border-b border-border/70 pb-8">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
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
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                  activeYear === year ? "text-gold" : "text-ink-soft/70 hover:text-gold"
                }`}
              >
                {year === "all" ? "All years" : year}
              </button>
            ))}
            {availability.map((item) => (
              <button
                key={item}
                onClick={() => setActiveAvailability(item)}
                className={`text-[10px] uppercase tracking-[0.25em] transition-colors duration-500 ${
                  activeAvailability === item ? "text-gold" : "text-ink-soft/70 hover:text-gold"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10">
          {filteredItems.map((a, i) => (
            <Link
              key={a.id}
              to="/artwork/$slug"
              params={{ slug: a.slug }}
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
              <button
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  onSelect(a);
                }}
                className="mt-3 text-[10px] uppercase tracking-[0.24em] text-gold"
              >
                Quick view
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
