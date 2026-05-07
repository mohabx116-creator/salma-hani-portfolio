import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { slugify } from "@/lib/slug";

type SeriesRow = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  _count?: { artworks: number };
};

export const Route = createFileRoute("/admin/series")({
  component: AdminSeries,
});

function AdminSeries() {
  const [series, setSeries] = useState<SeriesRow[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const load = () =>
    fetch("/api/admin/series")
      .then((response) => response.json())
      .then((data) => setSeries(data.series ?? []));

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <p className="eyebrow">Collections</p>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">Series</h1>

      <form
        className="mt-10 grid gap-4 border border-border p-5 md:grid-cols-[1fr_1fr_auto]"
        onSubmit={async (event) => {
          event.preventDefault();
          await fetch("/api/admin/series", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ name, slug: slugify(name), description }),
          });
          setName("");
          setDescription("");
          void load();
        }}
      >
        <input required placeholder="Series name" value={name} onChange={(event) => setName(event.target.value)} className="admin-input" />
        <input placeholder="Short description" value={description} onChange={(event) => setDescription(event.target.value)} className="admin-input" />
        <button className="cinematic-button px-6 py-3 text-[10px] uppercase tracking-[0.22em]">Create</button>
      </form>

      <div className="mt-8 border border-border">
        {series.map((item) => (
          <div key={item.id} className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-serif text-xl italic">{item.name}</p>
              <p className="text-sm text-ink-soft">/{item.slug}</p>
              {item.description && <p className="mt-2 text-sm text-ink-soft">{item.description}</p>}
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">{item._count?.artworks ?? 0} works</p>
          </div>
        ))}
        {series.length === 0 && <p className="p-6 text-sm text-ink-soft">No series yet.</p>}
      </div>
    </div>
  );
}
