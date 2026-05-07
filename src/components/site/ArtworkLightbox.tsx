import { useEffect, useState } from "react";
import type { CmsArtworkImage } from "@/lib/cms-types";

export function ArtworkLightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: CmsArtworkImage[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(initialIndex);
  const image = images[index];

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") setIndex((current) => Math.min(images.length - 1, current + 1));
      if (event.key === "ArrowLeft") setIndex((current) => Math.max(0, current - 1));
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 text-ivory" onClick={onClose}>
      <button className="absolute end-5 top-5 text-[10px] uppercase tracking-[0.28em] text-ivory hover:text-gold" onClick={onClose}>
        Close x
      </button>
      <button className="absolute start-4 top-1/2 text-3xl text-ivory/80" onClick={(event) => {
        event.stopPropagation();
        setIndex((current) => Math.max(0, current - 1));
      }}>
        ‹
      </button>
      <button className="absolute end-4 top-1/2 text-3xl text-ivory/80" onClick={(event) => {
        event.stopPropagation();
        setIndex((current) => Math.min(images.length - 1, current + 1));
      }}>
        ›
      </button>
      <figure className="max-h-[92vh] max-w-6xl" onClick={(event) => event.stopPropagation()}>
        <img src={image.url} alt={image.alt ?? ""} className="max-h-[82vh] w-full object-contain" />
        <figcaption className="mt-4 text-center text-sm text-ivory/75">
          {index + 1} of {images.length}
          {image.caption ? ` - ${image.caption}` : ""}
        </figcaption>
      </figure>
    </div>
  );
}
