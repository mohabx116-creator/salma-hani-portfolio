import { useLang } from "@/i18n/LanguageContext";
import { artworks } from "@/data/artworks";

export function Social() {
  const { t } = useLang();
  const tiles = artworks.slice(0, 6);
  return (
    <section className="py-32 md:py-40 px-[5vw] cinematic-band section-depth">
      <div className="mx-auto max-w-[1500px]">
        <div className="text-center mb-16">
          <p className="eyebrow">{t.social.eyebrow}</p>
          <h2 className="mt-5 font-serif text-4xl md:text-5xl text-foreground">{t.social.title}</h2>
          <p className="mt-4 text-ink-soft font-light">{t.social.sub}</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {tiles.map((a) => (
            <a
              key={a.id}
              href="https://instagram.com/__morvii_"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden bg-stone-soft lift art-vignette glass-card p-1"
            >
              <img
                src={a.image}
                alt={a.title}
                loading="lazy"
                className="w-full h-full object-cover grayscale brightness-80 transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-500 flex items-center justify-center">
                <span className="text-ivory text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="https://instagram.com/__morvii_"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.3em] text-foreground hover:text-gold transition-colors"
          >
            {t.social.follow}
          </a>
        </div>
      </div>
    </section>
  );
}
