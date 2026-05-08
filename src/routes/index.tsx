import { Link, createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ArrowRight, Instagram, LockKeyhole, Mail, Palette } from "lucide-react";
import { artworks as staticArtworks } from "@/data/artworks";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Salma Hani | Entrance" },
      {
        name: "description",
        content:
          "Choose your path into Salma Hani's digital studio: public portfolio or private studio access.",
      },
    ],
  }),
  component: EntrancePage,
});

function EntrancePage() {
  const artwork = staticArtworks[0];

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0">
        <img
          src={artwork.image}
          alt={artwork.title}
          className="h-full w-full scale-105 object-cover opacity-18 blur-[2px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(159,124,83,0.20),transparent_40%),linear-gradient(180deg,rgba(247,243,234,0.65),rgba(247,243,234,0.92))] dark:bg-[radial-gradient(circle_at_top,rgba(223,194,162,0.18),transparent_42%),linear-gradient(180deg,rgba(19,19,19,0.70),rgba(19,19,19,0.94))]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 md:px-10 lg:px-12">
        <div className="text-center">
          <p className="eyebrow reveal text-gold">Digital Studio Entrance</p>
          <h1 className="reveal reveal-delay-1 mt-5 font-serif text-5xl italic md:text-7xl">Salma Hani</h1>
          <p className="reveal reveal-delay-2 mt-4 text-sm uppercase tracking-[0.34em] text-ink-soft md:text-[0.82rem]">
            Fine Artist
          </p>
        </div>

        <div className="reveal reveal-delay-2 mx-auto mt-10 max-w-2xl text-center">
          <p className="text-balance font-serif text-2xl italic leading-relaxed text-foreground md:text-3xl">
            Welcome to the studio.
          </p>
          <p className="mx-auto mt-4 max-w-[48ch] text-sm leading-7 text-ink-soft md:text-base">
            Enter as a guest to browse the collection, or continue through studio access to manage the private CMS.
          </p>
        </div>

        <div className="mt-12 grid flex-1 gap-6 md:mt-16 md:grid-cols-2">
          <EntryCard
            to="/home"
            eyebrow="Public Portfolio"
            title="Enter as Guest"
            description="Browse artworks, discover the artist statement, and explore commissions and contact details."
            icon={<Palette className="size-5" />}
            accent="Guest Entry"
          />
          <EntryCard
            to="/admin/login"
            eyebrow="Private Studio"
            title="Studio Access"
            description="Reserved for Salma to manage artworks, inquiries, settings, and the full content system."
            icon={<LockKeyhole className="size-5" />}
            accent="Staff Only"
          />
        </div>

        <footer className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-border/70 pt-6 text-center md:flex-row md:text-left">
          <div>
            <p className="text-[10px] uppercase tracking-[0.32em] text-ink-soft">Studio Contact</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-sm text-foreground md:justify-start">
              <a href="https://instagram.com/__morvii_" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-gold">
                <Instagram className="size-4" />
                Instagram
              </a>
              <a href="mailto:studio@salma-hani.com" className="inline-flex items-center gap-2 hover:text-gold">
                <Mail className="size-4" />
                studio@salma-hani.com
              </a>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-ink-soft">Copyright 2026 Salma Hani</p>
        </footer>
      </div>
    </main>
  );
}

function EntryCard({
  to,
  eyebrow,
  title,
  description,
  icon,
  accent,
}: {
  to: "/home" | "/admin/login";
  eyebrow: string;
  title: string;
  description: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Link
      to={to}
      className="group landing-card reveal reveal-delay-3 flex min-h-[280px] flex-col justify-between overflow-hidden border border-border/80 p-7 transition-transform duration-500 hover:-translate-y-1 md:min-h-[340px] md:p-9"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-gold">
            {icon}
            {accent}
          </span>
          <ArrowRight className="size-4 text-gold transition-transform duration-500 group-hover:translate-x-1" />
        </div>
        <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-ink-soft">{eyebrow}</p>
        <h2 className="mt-4 font-serif text-3xl italic md:text-4xl">{title}</h2>
        <p className="mt-5 max-w-[34ch] text-sm leading-7 text-ink-soft md:text-base">{description}</p>
      </div>

      <div className="mt-8 border-t border-border/60 pt-5">
        <span className="text-[10px] uppercase tracking-[0.3em] text-gold">Continue</span>
      </div>
    </Link>
  );
}
