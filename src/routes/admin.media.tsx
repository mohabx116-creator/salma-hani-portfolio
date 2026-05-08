import { createFileRoute } from "@tanstack/react-router";
import { Copy, ExternalLink, ImagePlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { CmsArtwork } from "@/lib/cms-types";

type MediaItem = {
  id: string;
  url: string;
  alt: string;
  caption?: string | null;
  source: string;
  artworkId: string;
};

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const [artworks, setArtworks] = useState<CmsArtwork[]>([]);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetch("/api/admin/artworks")
      .then((response) => response.json())
      .then((data) => setArtworks(data.artworks ?? []))
      .catch(() => setArtworks([]));
  }, []);

  const media = useMemo<MediaItem[]>(() => {
    return artworks.flatMap((artwork) => {
      const main: MediaItem = {
        id: `${artwork.id}-main`,
        url: artwork.mainImage,
        alt: artwork.mainImageAlt ?? artwork.title,
        caption: "Main image",
        source: artwork.title,
        artworkId: artwork.id,
      };
      const gallery = artwork.images.map((image) => ({
        id: image.id,
        url: image.url,
        alt: image.altText ?? artwork.title,
        caption: image.caption,
        source: artwork.title,
        artworkId: artwork.id,
      }));
      return [main, ...gallery].filter((item) => Boolean(item.url));
    });
  }, [artworks]);

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">CMS</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">Media library</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-soft">
            All uploaded artwork images in one place. Add new media from an artwork editor, then
            reuse the copied URL anywhere in the CMS.
          </p>
        </div>
        <a
          href="/admin/artworks/new"
          className="cinematic-button inline-flex items-center gap-3 px-6 py-3 text-[10px] uppercase tracking-[0.24em]"
        >
          <ImagePlus className="size-4" />
          Upload via artwork
        </a>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {media.map((item) => (
          <article
            key={`${item.artworkId}-${item.id}`}
            className="overflow-hidden border border-border bg-background/70"
          >
            <img
              src={item.url}
              alt={item.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="space-y-4 p-4">
              <div>
                <p className="font-serif text-lg italic">{item.source}</p>
                <p className="mt-1 line-clamp-1 text-xs text-ink-soft">
                  {item.caption || item.alt}
                </p>
              </div>
              <div className="flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em]">
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard?.writeText(item.url);
                    setCopied(item.id);
                  }}
                  className="inline-flex items-center gap-2 text-gold"
                >
                  <Copy className="size-3.5" />
                  {copied === item.id ? "Copied" : "Copy URL"}
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-ink-soft hover:text-gold"
                >
                  <ExternalLink className="size-3.5" />
                  Open
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>

      {media.length === 0 && (
        <div className="mt-10 border border-border p-8 text-sm text-ink-soft">
          No media yet. Create an artwork and upload images to populate the library.
        </div>
      )}
    </div>
  );
}
