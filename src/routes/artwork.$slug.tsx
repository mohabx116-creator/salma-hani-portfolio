import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArtworkLightbox } from "@/components/site/ArtworkLightbox";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { artworks } from "@/data/artworks";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/i18n/ThemeContext";
import type { CmsArtwork } from "@/lib/cms-types";

export const Route = createFileRoute("/artwork/$slug")({
  loader: async ({ params }) => {
    const local = artworks.find((item) => item.id === params.slug);
    if (!local) throw new Error("Artwork not found");
    return {
      artwork: {
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
            alt: local.title,
            caption: local.description,
            order: 0,
          },
        ],
        series: null,
        availability: local.available ? "AVAILABLE" : "NOT_FOR_SALE",
        price: local.price ?? null,
        showPrice: typeof local.price === "number",
        isFeatured: local.placement === "featured",
        displayOrder: 0,
      } satisfies CmsArtwork,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData.artwork.title} | Salma Hani M` },
      {
        name: "description",
        content:
          loaderData.artwork.metaDesc ||
          loaderData.artwork.description?.slice(0, 155) ||
          "Artwork detail from Salma Hani M.",
      },
      { property: "og:title", content: loaderData.artwork.metaTitle || loaderData.artwork.title },
      { property: "og:image", content: loaderData.artwork.ogImage || loaderData.artwork.mainImage },
    ],
  }),
  component: ArtworkDetail,
});

function ArtworkDetail() {
  const { artwork } = Route.useLoaderData();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const images = artwork.images.length
    ? artwork.images
    : [
        {
          id: artwork.id,
          url: artwork.mainImage,
          alt: artwork.title,
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
                        alt={image.alt ?? artwork.title}
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
