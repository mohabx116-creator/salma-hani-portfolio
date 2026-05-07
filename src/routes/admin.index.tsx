import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CmsArtwork, Inquiry } from "@/lib/cms-types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [artworks, setArtworks] = useState<CmsArtwork[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  useEffect(() => {
    void Promise.all([
      fetch("/api/admin/artworks").then((r) => r.json()).catch(() => ({ artworks: [] })),
      fetch("/api/admin/inquiries").then((r) => r.json()).catch(() => ({ inquiries: [] })),
    ]).then(([artworkData, inquiryData]) => {
      setArtworks(artworkData.artworks ?? []);
      setInquiries(inquiryData.inquiries ?? []);
    });
  }, []);

  const stats = [
    { label: "Total works", value: artworks.length },
    { label: "Available", value: artworks.filter((a) => a.availability === "AVAILABLE").length },
    { label: "Featured", value: artworks.filter((a) => a.isFeatured).length },
    { label: "Unread inquiries", value: inquiries.filter((i) => !i.read).length },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Studio overview</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">Dashboard</h1>
        </div>
        <a href="/admin/artworks/new" className="cinematic-button px-6 py-3 text-[10px] uppercase tracking-[0.24em]">
          Add artwork
        </a>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-border bg-background/70 p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft">{stat.label}</p>
            <p className="mt-4 font-serif text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Recent inquiries</h2>
          <a href="/admin/inquiries" className="text-xs uppercase tracking-[0.22em] text-gold">
            View all
          </a>
        </div>
        <div className="overflow-hidden border border-border">
          {inquiries.slice(0, 5).map((inquiry) => (
            <div key={inquiry.id} className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto]">
              <div>
                <p className="font-medium">{inquiry.name}</p>
                <p className="text-sm text-ink-soft">{inquiry.email}</p>
              </div>
              <p className="line-clamp-2 text-sm text-ink-soft">{inquiry.message}</p>
              <span className="text-xs uppercase tracking-[0.2em] text-gold">{inquiry.interest}</span>
            </div>
          ))}
          {inquiries.length === 0 && <p className="p-6 text-sm text-ink-soft">No inquiries yet.</p>}
        </div>
      </section>
    </div>
  );
}
