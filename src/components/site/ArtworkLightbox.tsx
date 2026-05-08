import { useEffect, useState, useRef } from "react";
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
  const [isZoomed, setIsZoomed] = useState(false);
  const image = images[index];
  
  // Touch handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      }
      if (event.key === "ArrowRight") {
        setIsZoomed(false);
        setIndex((current) => Math.min(images.length - 1, current + 1));
      }
      if (event.key === "ArrowLeft") {
        setIsZoomed(false);
        setIndex((current) => Math.max(0, current - 1));
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [images.length, onClose, isZoomed]);

  // Preload next image
  useEffect(() => {
    if (index < images.length - 1) {
      const img = new Image();
      img.src = images[index + 1].url;
    }
    if (index > 0) {
      const img = new Image();
      img.src = images[index - 1].url;
    }
  }, [index, images]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (isZoomed) return; // Don't swipe while zoomed
    if (touchStartX.current - touchEndX.current > 50) {
      // Swipe left
      setIndex((current) => Math.min(images.length - 1, current + 1));
    }
    if (touchStartX.current - touchEndX.current < -50) {
      // Swipe right
      setIndex((current) => Math.max(0, current - 1));
    }
  };

  if (!image) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black text-white" 
      onClick={() => {
        if (isZoomed) setIsZoomed(false);
        else onClose();
      }}
    >
      <div className="absolute top-4 left-0 right-0 flex justify-between px-6 z-10 pointer-events-none">
        <div className="text-sm text-white/70">
          {index + 1} of {images.length}
        </div>
        <button 
          className="text-[10px] uppercase tracking-[0.28em] text-white hover:text-stone-300 pointer-events-auto" 
          onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
          [X] Close
        </button>
      </div>

      <button 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-4xl text-white/50 hover:text-white p-4 z-10" 
        onClick={(event) => {
          event.stopPropagation();
          setIsZoomed(false);
          setIndex((current) => Math.max(0, current - 1));
        }}
        disabled={index === 0}
        style={{ opacity: index === 0 ? 0 : 1 }}
      >
        ‹
      </button>

      <button 
        className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl text-white/50 hover:text-white p-4 z-10" 
        onClick={(event) => {
          event.stopPropagation();
          setIsZoomed(false);
          setIndex((current) => Math.min(images.length - 1, current + 1));
        }}
        disabled={index === images.length - 1}
        style={{ opacity: index === images.length - 1 ? 0 : 1 }}
      >
        ›
      </button>

      <div 
        className="relative w-full h-full flex flex-col items-center justify-center p-8 md:p-16"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          e.stopPropagation();
          setIsZoomed(!isZoomed);
        }}
      >
        <img 
          key={image.url}
          src={image.url} 
          alt={image.altText ?? image.caption ?? ""} 
          className={`
            transition-all duration-300 ease-in-out cursor-zoom-in animate-in fade-in
            ${isZoomed ? "max-w-none max-h-none cursor-zoom-out w-auto h-auto object-cover" : "max-w-full max-h-[80vh] object-contain"}
          `} 
          style={isZoomed ? { transform: 'scale(1.5)' } : {}}
        />
        
        {!isZoomed && image.caption && (
          <div className="absolute bottom-8 left-0 right-0 flex justify-center">
            <p className="max-w-2xl text-center text-sm text-white/80 bg-black/50 p-4 rounded backdrop-blur">
              {image.caption}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
