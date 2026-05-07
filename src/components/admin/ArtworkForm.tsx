import { useEffect, useMemo, useState } from "react";
import { Plus, Save, Trash2, Upload } from "lucide-react";
import type { Availability, CmsArtwork, CmsArtworkImage, CmsSeries } from "@/lib/cms-types";
import { AVAILABILITY_LABELS, MEDIUM_OPTIONS } from "@/lib/cms-types";
import { slugify } from "@/lib/slug";
import { InnerGalleryManager } from "./inner-gallery-manager";
import { RichTextEditor } from "./rich-text-editor";

type ArtworkDraft = Omit<CmsArtwork, "id" | "createdAt" | "updatedAt" | "series"> & {
  id?: string;
};

const emptyArtwork: ArtworkDraft = {
  title: "",
  slug: "",
  year: null,
  medium: MEDIUM_OPTIONS[0],
  dimensions: "",
  description: "",
  mainImage: "",
  images: [],
  seriesId: "",
  availability: "AVAILABLE",
  price: "",
  showPrice: false,
  isFeatured: false,
  displayOrder: 0,
  metaTitle: "",
  metaDesc: "",
  ogImage: "",
  currency: "USD",
  status: "PUBLISHED",
};

export function ArtworkForm({ artwork }: { artwork?: CmsArtwork }) {
  const [draft, setDraft] = useState<ArtworkDraft>(() => ({ ...emptyArtwork, ...artwork }));
  const [series, setSeries] = useState<CmsSeries[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const storageKey = useMemo(() => `artwork-draft-${artwork?.id ?? "new"}`, [artwork?.id]);

  useEffect(() => {
    fetch("/api/admin/series")
      .then((response) => response.json())
      .then((data) => setSeries(data.series ?? []))
      .catch(() => setSeries([]));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved && !artwork) setDraft(JSON.parse(saved));
  }, [artwork, storageKey]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      localStorage.setItem(storageKey, JSON.stringify(draft));
    }, 30000);
    return () => window.clearInterval(timer);
  }, [draft, storageKey]);

  const update = (key: keyof ArtworkDraft, value: unknown) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const upload = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/upload", { method: "POST", body: form });
    if (!response.ok) throw new Error("Upload failed");
    return (await response.json()) as { url: string };
  };

  const onMainUpload = async (file?: File) => {
    if (!file) return;
    setMessage("Uploading image...");
    const uploaded = await upload(file);
    update("mainImage", uploaded.url);
    setMessage("Image uploaded.");
  };

  const onGalleryUpload = async (files?: FileList | null) => {
    if (!files?.length) return;
    setMessage("Uploading gallery images...");
    const uploaded = await Promise.all(Array.from(files).slice(0, 10).map(upload));
    setDraft((current) => ({
      ...current,
      images: [
        ...current.images,
        ...uploaded.map((item, index) => ({
          id: `new-${Date.now()}-${index}`,
          url: item.url,
          altText: current.title,
          caption: "",
          order: current.images.length + index,
        })),
      ],
    }));
    setMessage("Gallery images uploaded.");
  };

  const save = async () => {
    setSaving(true);
    setMessage("");
    const endpoint = artwork?.id ? `/api/admin/artworks/${artwork.id}` : "/api/admin/artworks";
    const response = await fetch(endpoint, {
      method: artwork?.id ? "PUT" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...draft,
        slug: draft.slug || slugify(draft.title),
        images: draft.images.map((image, order) => ({ ...image, order })),
      }),
    });
    setSaving(false);
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setMessage(data.error ?? "Could not save artwork.");
      return;
    }
    localStorage.removeItem(storageKey);
    setMessage("Artwork saved.");
    if (!artwork?.id) window.location.href = "/admin/artworks";
  };

  return (
    <div className="space-y-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <TextField label="Title" value={draft.title} onChange={(value) => {
            update("title", value);
            if (!draft.slug) update("slug", slugify(value));
          }} required />
          <TextField label="Slug" value={draft.slug} onChange={(value) => update("slug", value)} />
          <div className="grid gap-6 md:grid-cols-3">
            <TextField label="Year" value={draft.year ?? ""} type="number" onChange={(value) => update("year", value ? Number(value) : null)} />
            <TextField label="Dimensions" value={draft.dimensions ?? ""} onChange={(value) => update("dimensions", value)} />
            <label>
              <span className="admin-label">Medium</span>
              <select value={draft.medium} onChange={(event) => update("medium", event.target.value)} className="admin-input">
                {MEDIUM_OPTIONS.map((medium) => <option key={medium}>{medium}</option>)}
              </select>
            </label>
          </div>
          <label>
            <span className="admin-label flex mb-2">Artwork statement</span>
            <RichTextEditor 
              value={draft.description ?? ""} 
              onChange={(value) => update("description", value)}
              placeholder="Write about this piece — inspiration, process, meaning..."
            />
          </label>
          <label>
            <span className="admin-label">SEO description</span>
            <textarea rows={3} value={draft.metaDesc ?? ""} onChange={(event) => update("metaDesc", event.target.value)} className="admin-input resize-y" />
          </label>
        </div>

        <aside className="space-y-6">
          <label>
            <span className="admin-label">Series</span>
            <select value={draft.seriesId ?? ""} onChange={(event) => update("seriesId", event.target.value)} className="admin-input">
              <option value="">No series</option>
              {series.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>
          </label>
          <label>
            <span className="admin-label">Availability</span>
            <select value={draft.availability} onChange={(event) => update("availability", event.target.value as Availability)} className="admin-input">
              {Object.entries(AVAILABILITY_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </label>
          <label>
            <span className="admin-label flex justify-between">
              Private price
              <select value={draft.currency ?? "USD"} onChange={(e) => update("currency", e.target.value)} className="bg-transparent text-xs outline-none">
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="EGP">EGP</option>
              </select>
            </span>
            <input required={false} type="number" value={draft.price ?? ""} onChange={(event) => update("price", event.target.value)} className="admin-input" />
          </label>
          <Toggle label="Show price publicly" checked={draft.showPrice} onChange={(value) => update("showPrice", value)} />
          <Toggle label="Featured on homepage" checked={draft.isFeatured} onChange={(value) => update("isFeatured", value)} />
          <label>
            <span className="admin-label">Status</span>
            <select value={draft.status ?? "PUBLISHED"} onChange={(event) => update("status", event.target.value)} className="admin-input">
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </label>
        </aside>
      </div>

      <section>
        <h2 className="font-serif text-2xl">Main image</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-[260px_1fr]">
          <ImagePreview src={draft.mainImage} alt={draft.title} />
          <UploadBox multiple={false} onChange={(files) => onMainUpload(files?.[0])} />
        </div>
      </section>

      <section>
        <InnerGalleryManager 
          images={draft.images} 
          onChange={(images) => update("images", images)} 
        />
      </section>

      <div className="sticky bottom-0 flex items-center justify-between border-t border-border bg-background/95 py-4 backdrop-blur">
        <p className="text-sm text-ink-soft">{message}</p>
        <button onClick={() => void save()} disabled={saving} className="cinematic-button inline-flex items-center gap-3 px-6 py-3 text-[10px] uppercase tracking-[0.24em] disabled:opacity-60">
          <Save className="size-4" />
          {saving ? "Saving..." : "Save artwork"}
        </button>
      </div>
    </div>
  );
}

function TextField({ label, value, onChange, type = "text", required = false }: { label: string; value: string | number; onChange: (value: string) => void; type?: string; required?: boolean }) {
  return (
    <label>
      <span className="admin-label">{label}</span>
      <input required={required} type={type} value={value} onChange={(event) => onChange(event.target.value)} className="admin-input" />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 border border-border p-4 text-sm">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-gold" />
    </label>
  );
}

function UploadBox({ multiple, onChange }: { multiple: boolean; onChange: (files: FileList | null) => void }) {
  return (
    <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center border border-dashed border-border p-6 text-center text-ink-soft hover:border-gold">
      <Upload className="mb-3 size-6" />
      <span className="text-sm">Drop or choose {multiple ? "images" : "an image"}</span>
      <input hidden type="file" accept="image/png,image/jpeg,image/webp" multiple={multiple} onChange={(event) => onChange(event.target.files)} />
    </label>
  );
}

function ImagePreview({ src, alt }: { src?: string | null; alt: string }) {
  return src ? (
    <img src={src} alt={alt} className="h-64 w-full border border-border object-cover" />
  ) : (
    <div className="grid h-64 place-items-center border border-border bg-muted text-sm text-ink-soft">No image</div>
  );
}

function GalleryRow({ image, index, onCaption, onDelete, onMove }: { image: CmsArtworkImage; index: number; onCaption: (caption: string) => void; onDelete: () => void; onMove: (direction: -1 | 1) => void }) {
  return (
    <div className="grid gap-4 border border-border p-3 md:grid-cols-[120px_1fr_auto]">
      <img src={image.url} alt={image.altText ?? ""} className="h-28 w-full object-cover" />
      <label>
        <span className="admin-label">Caption {index + 1}</span>
        <input value={image.caption ?? ""} onChange={(event) => onCaption(event.target.value)} className="admin-input" />
      </label>
      <div className="flex items-center gap-2 md:flex-col">
        <button type="button" onClick={() => onMove(-1)} className="border border-border px-3 py-2 text-xs">Up</button>
        <button type="button" onClick={() => onMove(1)} className="border border-border px-3 py-2 text-xs">Down</button>
        <button type="button" onClick={onDelete} className="border border-border px-3 py-2 text-destructive">
          <Trash2 className="size-4" />
        </button>
      </div>
    </div>
  );
}
