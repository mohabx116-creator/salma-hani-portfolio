import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { About } from "@/components/site/About";
import { ArtworkModal } from "@/components/site/ArtworkModal";
import { Commissions } from "@/components/site/Commissions";
import { Contact } from "@/components/site/Contact";
import { Featured } from "@/components/site/Featured";
import { Footer } from "@/components/site/Footer";
import { Gallery } from "@/components/site/Gallery";
import { Hero } from "@/components/site/Hero";
import { Nav } from "@/components/site/Nav";
import { Shop } from "@/components/site/Shop";
import { Social } from "@/components/site/Social";
import { artworks as staticArtworks } from "@/data/artworks";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/i18n/ThemeContext";
import type { CmsArtwork } from "@/lib/cms-types";
import { cmsArtworkToSiteArtwork, staticArtworkToSiteArtwork, type SiteArtwork } from "@/lib/site-artworks";

export const Route = createFileRoute("/home")({
  loader: async () => {
    const fallback = staticArtworks.map(staticArtworkToSiteArtwork);
    return { artworks: fallback };
  },
  head: () => ({
    meta: [
      { title: "Salma Hani M | Fine Artist" },
      {
        name: "description",
        content:
          "Fine art portfolio of Salma Hani M featuring paintings, drawings, conceptual works, and acquisition inquiries.",
      },
      { property: "og:title", content: "Salma Hani M | Fine Artist" },
      { property: "og:description", content: "Capturing the soul through color and silence." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const loaderData = Route.useLoaderData();
  const [artworks, setArtworks] = useState<SiteArtwork[]>(loaderData.artworks);
  const [selected, setSelected] = useState<SiteArtwork | null>(null);
  const featured = artworks.filter((artwork) => artwork.isFeatured).slice(0, 3);
  const heroArtwork = featured[0] ?? artworks[0];
  const shopItems = artworks.filter(
    (artwork) => artwork.available && artwork.showPrice && typeof artwork.price === "number",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    fetch("/api/artworks")
      .then((response) => response.json())
      .then((data: { artworks?: CmsArtwork[] }) => {
        if (data.artworks?.length) {
          setArtworks(data.artworks.map(cmsArtworkToSiteArtwork));
        }
      })
      .catch(() => undefined);
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <main>
            <Hero artwork={heroArtwork} />
            <About />
            <Featured items={featured} onSelect={setSelected} />
            <Gallery items={artworks} onSelect={setSelected} />
            <Commissions />
            <Shop items={shopItems} onSelect={setSelected} />
            <Social items={artworks} />
            <Contact />
          </main>
          <Footer />
          <ArtworkModal artwork={selected} onClose={() => setSelected(null)} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
