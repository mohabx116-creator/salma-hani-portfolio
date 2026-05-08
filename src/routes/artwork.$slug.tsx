import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArtworkLightbox } from "@/components/site/ArtworkLightbox";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { artworks } from "@/data/artworks";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/i18n/ThemeContext";
import { trackAnalyticsEvent } from "@/hooks/useAnalytics";
import type { CmsArtwork } from "@/lib/cms-types";

export const Route = createFileRoute("/artwork/$slug")({
  loader: async ({ params }): Promise<{ artwork: CmsArtwork | null }> => {
    const local = artworks.find((item) => item.id === params.slug);
    if (!local) return { artwork: null };
    const artwork: CmsArtwork = {
      id: local.id,
      title: local.title,
      slug: local.id,
      year: local.year ? Number(local.year) : null,
      medium: local.medium ?? local.category,
      dimensions: null,
      description: local.description,
      statement: null,
      mainImage: local.image,
      mainImageAlt: local.title,
      images: [
        {
          id: local.id,
          url: local.image,
          altText: local.title,
          caption: local.description,
          order: 0,
        },
      ],
      series: null,
      seriesId: null,
      availability: local.available ? "AVAILABLE" : "NOT_FOR_SALE",
      price: local.price ?? null,
      currency: "EUR",
      showPrice: typeof local.price === "number",
      isFeatured: local.placement === "featured",
      displayOrder: 0,
      status: "PUBLISHED",
      metaTitle: null,
      metaDesc: null,
      ogImage: null,
    };

    return {
      artwork,
    };
  },
  head: ({ loaderData }) => {
    const artwork = loaderData?.artwork;
    return {
      meta: [
        { title: artwork ? `${artwork.title} | Salma Hani M` : "Artwork | Salma Hani M" },
        {
          name: "description",
          content:
            artwork?.metaDesc ||
            artwork?.description?.slice(0, 155) ||
            "Artwork detail from Salma Hani M.",
        },
        { property: "og:title", content: artwork?.metaTitle || artwork?.title || "Salma Hani M" },
        { property: "og:image", content: artwork?.ogImage || artwork?.mainImage || "" },
      ],
    };
  },
  component: ArtworkDetail,
});

function ArtworkDetail() {
  const params = Route.useParams();
  const { artwork: initialArtwork } = Route.useLoaderData();
  const [artwork, setArtwork] = useState<CmsArtwork | null>(initialArtwork);
  const [loaded, setLoaded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const trackedSlug = useRef<string | null>(null);

  useEffect(() => {
    fetch(`/api/artworks?slug=${encodeURIComponent(params.slug)}`)
      .then((response) => response.json())
      .then((data: { artworks?: CmsArtwork[] }) => {
        setArtwork(data.artworks?.[0] ?? initialArtwork);
      })
      .catch(() => undefined)
      .finally(() => setLoaded(true));
  }, [initialArtwork, params.slug]);

  useEffect(() => {
    if (!artwork || trackedSlug.current === artwork.slug) return;
    trackedSlug.current = artwork.slug;
    trackAnalyticsEvent("project_view", `/artwork/${artwork.slug}`, {
      artworkId: artwork.id,
      title: artwork.title,
      medium: artwork.medium,
    });
  }, [artwork]);

  if (!artwork) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <div className="min-h-screen bg-background text-foreground">
            <Nav />
            <main className="grid min-h-[70vh] place-items-center px-[5vw] pt-28">
              <div className="text-center">
                <p className="eyebrow">{loaded ? "Artwork not found" : "Loading artwork"}</p>
                <h1 className="mt-4 font-serif text-4xl italic">
                  {loaded ? "This work is not available." : "Opening artwork..."}
                </h1>
              </div>
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </ThemeProvider>
    );
  }

  const images = artwork.images.length
    ? artwork.images
    : [
        {
          id: artwork.id,
          url: artwork.mainImage,
          altText: artwork.title,
          caption: artwork.description,
          order: 0,
        },
      ];

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <main className="px-[5vw] pb-24 pt-28 md:pt-36">
            <div className="mx-auto max-w-[1500px]">
              <nav className="mb-10 text-xs uppercase tracking-[0.24em] text-ink-soft">
                <a href="/#works" className="hover:text-gold">
                  Works
                </a>
                <span className="mx-3">/</span>
                <span>{artwork.title}</span>
              </nav>

              <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
                <button className="bg-bone p-3 shadow-frame" onClick={() => setLightboxIndex(0)}>
                  <img
                    src={artwork.mainImage}
                    alt={artwork.mainImageAlt ?? artwork.title}
                    className="max-h-[78vh] w-full object-contain"
                  />
                </button>

                <aside className="lg:sticky lg:top-28 lg:self-start">
                  <p className="eyebrow">{artwork.series?.name ?? artwork.medium}</p>
                  <h1 className="mt-5 font-serif text-5xl italic md:text-6xl">{artwork.title}</h1>
                  {artwork.description && (
                    <p className="mt-8 leading-8 text-ink-soft">{artwork.description}</p>
                  )}

                  <dl className="mt-10 space-y-4 text-sm">
                    <Meta label="Year" value={artwork.year?.toString()} />
                    <Meta label="Medium" value={artwork.medium} />
                    <Meta label="Dimensions" value={artwork.dimensions ?? undefined} />
                    <Meta
                      label="Availability"
                      value={artwork.availability.replaceAll("_", " ").toLowerCase()}
                    />
                    {artwork.showPrice && artwork.price && (
                      <Meta label="Price" value={`${artwork.price}`} />
                    )}
                  </dl>

                  <a
                    href={`/?artwork=${artwork.slug}#contact`}
                    className="cinematic-button mt-10 inline-flex w-full justify-center px-8 py-4 text-[10px] uppercase tracking-[0.28em]"
                  >
                    Inquire about this work
                  </a>
                </aside>
              </div>

              <section className="mt-16">
                <h2 className="font-serif text-3xl">Inner gallery</h2>
                <div className="mt-6 flex gap-4 overflow-x-auto pb-4">
                  {images.map((image, index) => (
                    <button
                      key={image.id}
                      className="w-56 shrink-0 text-start"
                      onClick={() => setLightboxIndex(index)}
                    >
                      <img
                        src={image.url}
                        alt={image.altText ?? artwork.title}
                        className="aspect-[4/5] w-full object-cover"
                      />
                      {image.caption && (
                        <p className="mt-3 text-sm leading-6 text-ink-soft">{image.caption}</p>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </main>
          <Footer />
          {lightboxIndex !== null && (
            <ArtworkLightbox
              images={images}
              initialIndex={lightboxIndex}
              onClose={() => setLightboxIndex(null)}
            />
          )}
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}

function Meta({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between gap-8 border-b border-border pb-3">
      <dt className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">{label}</dt>
      <dd className="text-end capitalize">{value}</dd>
    </div>
  );
}
