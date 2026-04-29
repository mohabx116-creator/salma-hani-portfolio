import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { ThemeProvider } from "@/i18n/ThemeContext";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Featured } from "@/components/site/Featured";
import { Gallery } from "@/components/site/Gallery";
import { Commissions } from "@/components/site/Commissions";
import { Shop } from "@/components/site/Shop";
import { Social } from "@/components/site/Social";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { ArtworkModal } from "@/components/site/ArtworkModal";
import type { Artwork } from "@/data/artworks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salma Hani M — Capturing the soul through color and silence" },
      {
        name: "description",
        content:
          "Fine art portfolio of Salma Hani M — oil paintings, drawings and conceptual works. Portraits, landscapes, abstract and conceptual pieces. Commissions and acquisitions.",
      },
      { property: "og:title", content: "Salma Hani M — Fine Artist" },
      { property: "og:description", content: "Capturing the soul through color and silence." },
    ],
  }),
  component: Index,
});

function Index() {
  const [selected, setSelected] = useState<Artwork | null>(null);

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

  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Nav />
          <main>
            <Hero />
            <About />
            <Featured onSelect={setSelected} />
            <Gallery onSelect={setSelected} />
            <Commissions />
            <Shop onSelect={setSelected} />
            <Social />
            <Contact />
          </main>
          <Footer />
          <ArtworkModal artwork={selected} onClose={() => setSelected(null)} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
