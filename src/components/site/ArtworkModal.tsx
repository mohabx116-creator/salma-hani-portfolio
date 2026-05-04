import { useEffect } from "react";
import { useLang } from "@/i18n/LanguageContext";
import type { Artwork } from "@/data/artworks";

export function ArtworkModal({ artwork, onClose }: { artwork: Artwork | null; onClose: () => void }) {
  const { t, lang } = useLang();

  useEffect(() => {
    if (!artwork) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [artwork, onClose]);

  if (!artwork) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-10 fade-up" onClick={onClose}>
      <button
        onClick={onClose}
        className="absolute top-6 end-6 text-[10px] uppercase tracking-[0.3em] text-ivory hover:text-gold transition-colors"
      >
        {t.detail.close} x
      </button>
      <div
        className="relative bg-background max-w-6xl w-full max-h-[90vh] overflow-auto grid grid-cols-1 md:grid-cols-5 gap-0 shadow-frame border border-border"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="md:col-span-3 bg-bone">
          <img
            src={artwork.image}
            alt={artwork.title}
            className="w-full h-full object-contain max-h-[90vh]"
          />
        </div>
        <div className="md:col-span-2 p-8 md:p-12 flex flex-col justify-between">
          <div>
            <p className="eyebrow">{artwork.category}</p>
            <h3 className="mt-5 font-serif text-3xl md:text-4xl italic text-foreground">{artwork.title}</h3>
            {artwork.description && (
              <p className="mt-5 text-sm md:text-base text-ink-soft leading-[1.8] font-light">
                {artwork.description}
              </p>
            )}

            <dl className="mt-10 space-y-5 text-sm">
              {artwork.year && (
                <div className="flex justify-between gap-6 border-b border-border pb-3">
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{t.detail.year}</dt>
                  <dd className="text-foreground tabular-nums">{artwork.year}</dd>
                </div>
              )}
              {artwork.medium && (
                <div className="flex justify-between gap-6 border-b border-border pb-3">
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{t.detail.medium}</dt>
                  <dd className="text-foreground text-end max-w-[60%]">{artwork.medium}</dd>
                </div>
              )}
              {typeof artwork.price === "number" && (
                <div className="flex justify-between gap-6 border-b border-border pb-3">
                  <dt className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{t.shop.available}</dt>
                  <dd className="font-serif text-lg text-foreground tabular-nums">
                    {new Intl.NumberFormat(lang === "ar" ? "ar" : lang, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(artwork.price)}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          <div className="mt-12 flex flex-col gap-3">
            {typeof artwork.price === "number" && (
              <a
                href="#contact"
                onClick={onClose}
                className="cinematic-button inline-flex items-center justify-center px-8 py-4 text-[10px] uppercase tracking-[0.28em]"
              >
                {t.detail.buy}
              </a>
            )}
            <a
              href="#contact"
              onClick={onClose}
              className="cinematic-button inline-flex items-center justify-center px-8 py-4 text-[10px] uppercase tracking-[0.28em]"
            >
              {t.detail.inquire}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
