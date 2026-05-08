import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { list, put } from "@vercel/blob";
import { artworks as bundledArtworks } from "@/data/artworks";
import type {
  AnalyticsEvent,
  Availability,
  CmsArtwork,
  CmsSeries,
  Inquiry,
  SiteSetting,
  Subscriber,
} from "@/lib/cms-types";
import { slugify } from "@/lib/slug";

type StaticCmsState = {
  artworks: CmsArtwork[];
  inquiries: Inquiry[];
  series: CmsSeries[];
  settings: SiteSetting[];
  subscribers: Subscriber[];
  analytics: AnalyticsEvent[];
};

type SeriesWithCount = CmsSeries & { _count: { artworks: number } };

const BLOB_PATH = "cms/state.json";
const LOCAL_PATH = path.join(process.cwd(), ".data", "cms-state.json");
const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const globalForCms = globalThis as typeof globalThis & {
  salmaCmsState?: StaticCmsState;
};

function hasBlobStore() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelRuntime() {
  return process.env.VERCEL === "1";
}

function bundledArtworkToCmsArtwork(
  artwork: (typeof bundledArtworks)[number],
  displayOrder: number,
): CmsArtwork {
  return {
    id: artwork.id,
    title: artwork.title,
    slug: artwork.id,
    year: artwork.year ? Number(artwork.year) : null,
    medium: artwork.medium ?? artwork.category,
    dimensions: null,
    description: artwork.description,
    mainImage: artwork.image,
    mainImageAlt: artwork.title,
    images: [
      {
        id: `${artwork.id}-main`,
        url: artwork.image,
        altText: artwork.title,
        caption: artwork.description,
        order: 0,
      },
    ],
    series: null,
    seriesId: null,
    availability: artwork.available ? "AVAILABLE" : "NOT_FOR_SALE",
    price: artwork.price ?? null,
    currency: "EUR",
    showPrice: typeof artwork.price === "number",
    isFeatured: artwork.placement === "featured",
    displayOrder,
    status: "PUBLISHED",
    metaTitle: null,
    metaDesc: null,
    ogImage: null,
    createdAt: now(),
    updatedAt: now(),
  };
}

function initialState(): StaticCmsState {
  return {
    artworks: bundledArtworks.map(bundledArtworkToCmsArtwork),
    inquiries: [],
    series: [],
    settings: [
      { key: "artistName", value: "Salma Hani M" },
      { key: "tagline", value: "Capturing the soul through color and silence" },
      { key: "instagram", value: "https://instagram.com/__morvii_" },
      { key: "publicEmail", value: "studio@salma-hani.com" },
      { key: "commissionPricing", value: "" },
      { key: "metaTitle", value: "Salma Hani M | Fine Artist" },
      { key: "metaDescription", value: "Fine art portfolio of Salma Hani M." },
    ],
    subscribers: [],
    analytics: [],
  };
}

function normalizeState(input: Partial<StaticCmsState> | null | undefined): StaticCmsState {
  const fallback = initialState();
  return {
    artworks:
      Array.isArray(input?.artworks) && input.artworks.length ? input.artworks : fallback.artworks,
    inquiries: Array.isArray(input?.inquiries) ? input.inquiries : fallback.inquiries,
    series: Array.isArray(input?.series) ? input.series : fallback.series,
    settings:
      Array.isArray(input?.settings) && input.settings.length ? input.settings : fallback.settings,
    subscribers: Array.isArray(input?.subscribers) ? input.subscribers : fallback.subscribers,
    analytics: Array.isArray(input?.analytics) ? input.analytics : fallback.analytics,
  };
}

async function readFromBlob() {
  const blobs = await list({ prefix: BLOB_PATH, limit: 1 });
  const blob = blobs.blobs.find((item) => item.pathname === BLOB_PATH);
  if (!blob) return null;
  const response = await fetch(blob.url, { cache: "no-store" });
  if (!response.ok) return null;
  return (await response.json()) as Partial<StaticCmsState>;
}

async function readFromLocalFile() {
  if (!existsSync(LOCAL_PATH)) return null;
  const raw = await readFile(LOCAL_PATH, "utf8");
  return JSON.parse(raw) as Partial<StaticCmsState>;
}

async function loadState(): Promise<StaticCmsState> {
  if (globalForCms.salmaCmsState) return globalForCms.salmaCmsState;

  try {
    const stored = hasBlobStore() ? await readFromBlob() : await readFromLocalFile();
    globalForCms.salmaCmsState = normalizeState(stored);
  } catch {
    globalForCms.salmaCmsState = initialState();
  }

  return globalForCms.salmaCmsState;
}

async function persistState(next: StaticCmsState) {
  if (hasBlobStore()) {
    await put(BLOB_PATH, JSON.stringify(next, null, 2), {
      access: "public",
      addRandomSuffix: false,
      contentType: "application/json",
    });
    return;
  }

  try {
    if (isVercelRuntime()) return;
    await mkdir(path.dirname(LOCAL_PATH), { recursive: true });
    await writeFile(LOCAL_PATH, JSON.stringify(next, null, 2), "utf8");
  } catch {
    globalForCms.salmaCmsState = next;
  }
}

async function mutateState<T>(mutator: (store: StaticCmsState) => T | Promise<T>) {
  const store = await loadState();
  const result = await mutator(store);
  await persistState(store);
  return result;
}

function withSeries(store: StaticCmsState, artwork: CmsArtwork) {
  const series = artwork.seriesId
    ? store.series.find((item) => item.id === artwork.seriesId)
    : null;
  return { ...artwork, series: series ?? null };
}

export async function listArtworks(
  filters: {
    availability?: string | null;
    seriesId?: string | null;
    featured?: boolean;
    slug?: string | null;
    publishedOnly?: boolean;
  } = {},
) {
  const store = await loadState();
  return store.artworks
    .filter((artwork) => !filters.availability || artwork.availability === filters.availability)
    .filter((artwork) => !filters.seriesId || artwork.seriesId === filters.seriesId)
    .filter((artwork) => filters.featured === undefined || artwork.isFeatured === filters.featured)
    .filter((artwork) => !filters.slug || artwork.slug === filters.slug)
    .filter((artwork) => !filters.publishedOnly || artwork.status !== "DRAFT")
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((artwork) => withSeries(store, artwork));
}

export async function findArtworkById(id: string) {
  const store = await loadState();
  const artwork = store.artworks.find((item) => item.id === id);
  return artwork ? withSeries(store, artwork) : null;
}

export async function findArtworkBySlug(slug: string) {
  const store = await loadState();
  const artwork = store.artworks.find((item) => item.slug === slug && item.status !== "DRAFT");
  return artwork ? withSeries(store, artwork) : null;
}

export async function createArtwork(
  payload: Omit<CmsArtwork, "id" | "createdAt" | "updatedAt" | "series" | "images"> & {
    images?: CmsArtwork["images"];
  },
) {
  return mutateState((store) => {
    const artwork: CmsArtwork = {
      ...payload,
      id: id("artwork"),
      slug: payload.slug || slugify(payload.title),
      images: payload.images ?? [],
      series: null,
      createdAt: now(),
      updatedAt: now(),
    };
    store.artworks.push(artwork);
    return withSeries(store, artwork);
  });
}

export async function updateArtwork(
  artworkId: string,
  payload: Omit<CmsArtwork, "id" | "createdAt" | "updatedAt" | "series" | "images"> & {
    images?: CmsArtwork["images"];
  },
) {
  return mutateState((store) => {
    const index = store.artworks.findIndex((item) => item.id === artworkId);
    if (index === -1) return null;
    const previous = store.artworks[index];
    const artwork: CmsArtwork = {
      ...previous,
      ...payload,
      slug: payload.slug || slugify(payload.title),
      images: payload.images ?? [],
      updatedAt: now(),
    };
    store.artworks[index] = artwork;
    return withSeries(store, artwork);
  });
}

export async function deleteArtwork(artworkId: string) {
  await mutateState((store) => {
    store.artworks = store.artworks.filter((item) => item.id !== artworkId);
  });
}

export async function reorderArtworks(ids: string[]) {
  await mutateState((store) => {
    const order = new Map(ids.map((item, index) => [item, index]));
    for (const artwork of store.artworks) {
      artwork.displayOrder = order.get(artwork.id) ?? artwork.displayOrder;
    }
  });
}

export async function listSeries(): Promise<SeriesWithCount[]> {
  const store = await loadState();
  return store.series
    .map((series) => ({
      ...series,
      _count: {
        artworks: store.artworks.filter((artwork) => artwork.seriesId === series.id).length,
      },
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

export async function createSeries(input: {
  name: string;
  slug?: string;
  description?: string | null;
}) {
  return mutateState((store) => {
    const series: CmsSeries = {
      id: id("series"),
      name: input.name,
      slug: input.slug || slugify(input.name),
      description: input.description ?? null,
      displayOrder: store.series.length,
    };
    store.series.push(series);
    return { ...series, _count: { artworks: 0 } };
  });
}

export async function listInquiries() {
  const store = await loadState();
  return store.inquiries
    .filter((item) => item.status !== "CLOSED")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createInquiry(input: Omit<Inquiry, "id" | "read" | "status" | "createdAt">) {
  return mutateState((store) => {
    const inquiry: Inquiry = {
      ...input,
      id: id("inquiry"),
      read: false,
      status: "OPEN",
      createdAt: now(),
    };
    store.inquiries.unshift(inquiry);
    return inquiry;
  });
}

export async function updateInquiry(input: { id: string; read?: boolean; archived?: boolean }) {
  return mutateState((store) => {
    const inquiry = store.inquiries.find((item) => item.id === input.id);
    if (!inquiry) return null;
    if (typeof input.read === "boolean") inquiry.read = input.read;
    if (input.archived) inquiry.status = "CLOSED";
    return inquiry;
  });
}

export async function listSubscribers() {
  const store = await loadState();
  return [...store.subscribers].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listSettings() {
  const store = await loadState();
  return store.settings;
}

export async function getSettingsMap() {
  const settings = await listSettings();
  return Object.fromEntries(settings.map((item) => [item.key, item.value]));
}

export async function updateSettings(settings: Record<string, string>) {
  await mutateState((store) => {
    for (const [key, value] of Object.entries(settings)) {
      const existing = store.settings.find((item) => item.key === key);
      if (existing) existing.value = String(value ?? "");
      else store.settings.push({ key, value: String(value ?? "") });
    }
  });
}

export async function addSubscriber(email: string) {
  return mutateState((store) => {
    const existing = store.subscribers.find((item) => item.email === email);
    if (existing) return existing;
    const subscriber: Subscriber = { id: id("subscriber"), email, createdAt: now() };
    store.subscribers.push(subscriber);
    return subscriber;
  });
}

export async function listAnalytics(limit = 500) {
  const store = await loadState();
  return [...store.analytics]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, Math.max(1, Math.min(limit, 5000)));
}

export async function trackAnalyticsEvent(input: {
  page: string;
  event: AnalyticsEvent["event"];
  metadata?: AnalyticsEvent["metadata"];
}) {
  return mutateState((store) => {
    const event: AnalyticsEvent = {
      id: id("event"),
      page: input.page.slice(0, 240),
      event: input.event.slice(0, 80),
      metadata: input.metadata ?? {},
      timestamp: now(),
    };
    store.analytics.push(event);
    if (store.analytics.length > 5000) {
      store.analytics = store.analytics.slice(-5000);
    }
    return event;
  });
}
