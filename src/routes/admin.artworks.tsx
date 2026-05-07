import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { CmsArtwork } from "@/lib/cms-types";
import { AVAILABILITY_LABELS } from "@/lib/cms-types";

export const Route = createFileRoute("/admin/artworks")({
  component: AdminArtworks,
});

function AdminArtworks() {
  const [artworks, setArtworks] = useState<CmsArtwork[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/artworks")
      .then((response) => response.json())
      .then((data) => setArtworks(data.artworks ?? []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">CMS</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">Artworks</h1>
        </div>
        <a href="/admin/artworks/new" className="cinematic-button px-6 py-3 text-[10px] uppercase tracking-[0.24em]">
          New artwork
        </a>
      </div>

      <div className="mt-10 overflow-x-auto border border-border">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="border-b border-border bg-muted/30 text-start text-[10px] uppercase tracking-[0.22em] text-ink-soft">
            <tr>
              <th className="p-4 text-start">Work</th>
              <th className="p-4 text-start">Medium</th>
              <th className="p-4 text-start">Status</th>
              <th className="p-4 text-start">Featured</th>
              <th className="p-4 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artworks.map((artwork) => (
              <tr key={artwork.id} className="border-b border-border last:border-b-0">
                <td className="p-4">
                  <div className="flex items-center gap-4">
                    <img src={artwork.mainImage} alt={artwork.title} className="size-16 object-cover" />
                    <div>
                      <p className="font-serif text-lg italic">{artwork.title}</p>
                      <p className="text-xs text-ink-soft">{artwork.year ?? "Undated"} · /artwork/{artwork.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-ink-soft">{artwork.medium}</td>
                <td className="p-4">{AVAILABILITY_LABELS[artwork.availability]}</td>
                <td className="p-4">{artwork.isFeatured ? "Yes" : "No"}</td>
                <td className="p-4 text-end">
                  <a href={`/admin/artworks/${artwork.id}`} className="text-gold">
                    Edit
                  </a>
                  <button
                    className="ms-4 text-destructive"
                    onClick={async () => {
                      if (!confirm(`Delete ${artwork.title}?`)) return;
                      await fetch(`/api/admin/artworks/${artwork.id}`, { method: "DELETE" });
                      load();
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && artworks.length === 0 && <p className="p-8 text-sm text-ink-soft">No artworks in the CMS yet.</p>}
        {loading && <p className="p-8 text-sm text-ink-soft">Loading artworks...</p>}
      </div>
    </div>
  );
}
