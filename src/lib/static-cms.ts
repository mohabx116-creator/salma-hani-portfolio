import { artworks as bundledArtworks } from "@/data/artworks";
import type {
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
};

const globalForStaticCms = globalThis as typeof globalThis & {
  salmaStaticCms?: StaticCmsState;
};

const now = () => new Date().toISOString();
const id = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

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
    settings: [],
    subscribers: [],
  };
}

function state() {
  globalForStaticCms.salmaStaticCms ??= initialState();
  return globalForStaticCms.salmaStaticCms;
}

function withSeries(artwork: CmsArtwork) {
  const series = artwork.seriesId
    ? state().series.find((item) => item.id === artwork.seriesId)
    : null;
  return { ...artwork, series: series ?? null };
}

export function listArtworks(
  filters: { availability?: string | null; seriesId?: string | null; featured?: boolean } = {},
) {
  return state()
    .artworks.filter(
      (artwork) => !filters.availability || artwork.availability === filters.availability,
    )
    .filter((artwork) => !filters.seriesId || artwork.seriesId === filters.seriesId)
    .filter((artwork) => filters.featured === undefined || artwork.isFeatured === filters.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(withSeries);
}

export function findArtworkById(id: string) {
  const artwork = state().artworks.find((item) => item.id === id);
  return artwork ? withSeries(artwork) : null;
}

export function findArtworkBySlug(slug: string) {
  const artwork = state().artworks.find((item) => item.slug === slug);
  return artwork ? withSeries(artwork) : null;
}

export function createArtwork(
  payload: Omit<CmsArtwork, "id" | "createdAt" | "updatedAt" | "series" | "images"> & {
    images?: CmsArtwork["images"];
  },
) {
  const artwork: CmsArtwork = {
    ...payload,
    id: id("artwork"),
    slug: payload.slug || slugify(payload.title),
    images: payload.images ?? [],
    series: null,
    createdAt: now(),
    updatedAt: now(),
  };
  state().artworks.push(artwork);
  return withSeries(artwork);
}

export function updateArtwork(
  artworkId: string,
  payload: Omit<CmsArtwork, "id" | "createdAt" | "updatedAt" | "series" | "images"> & {
    images?: CmsArtwork["images"];
  },
) {
  const index = state().artworks.findIndex((item) => item.id === artworkId);
  if (index === -1) return null;
  const previous = state().artworks[index];
  const artwork: CmsArtwork = {
    ...previous,
    ...payload,
    slug: payload.slug || slugify(payload.title),
    images: payload.images ?? [],
    updatedAt: now(),
  };
  state().artworks[index] = artwork;
  return withSeries(artwork);
}

export function deleteArtwork(artworkId: string) {
  const store = state();
  store.artworks = store.artworks.filter((item) => item.id !== artworkId);
}

export function reorderArtworks(ids: string[]) {
  const order = new Map(ids.map((item, index) => [item, index]));
  for (const artwork of state().artworks) {
    artwork.displayOrder = order.get(artwork.id) ?? artwork.displayOrder;
  }
}

export function listSeries() {
  return state()
    .series.map((series) => ({
      ...series,
      _count: {
        artworks: state().artworks.filter((artwork) => artwork.seriesId === series.id).length,
      },
    }))
    .sort((a, b) => a.displayOrder - b.displayOrder || a.name.localeCompare(b.name));
}

export function createSeries(input: { name: string; slug?: string; description?: string | null }) {
  const series: CmsSeries = {
    id: id("series"),
    name: input.name,
    slug: input.slug || slugify(input.name),
    description: input.description ?? null,
    displayOrder: state().series.length,
  };
  state().series.push(series);
  return { ...series, _count: { artworks: 0 } };
}

export function listInquiries() {
  return state()
    .inquiries.filter((item) => item.status !== "CLOSED")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function createInquiry(input: Omit<Inquiry, "id" | "read" | "status" | "createdAt">) {
  const inquiry: Inquiry = {
    ...input,
    id: id("inquiry"),
    read: false,
    status: "OPEN",
    createdAt: now(),
  };
  state().inquiries.unshift(inquiry);
  return inquiry;
}

export function updateInquiry(input: { id: string; read?: boolean; archived?: boolean }) {
  const inquiry = state().inquiries.find((item) => item.id === input.id);
  if (!inquiry) return null;
  if (typeof input.read === "boolean") inquiry.read = input.read;
  if (input.archived) inquiry.status = "CLOSED";
  return inquiry;
}

export function listSettings() {
  return state().settings;
}

export function updateSettings(settings: Record<string, string>) {
  const store = state();
  for (const [key, value] of Object.entries(settings)) {
    const existing = store.settings.find((item) => item.key === key);
    if (existing) existing.value = String(value ?? "");
    else store.settings.push({ key, value: String(value ?? "") });
  }
}

export function addSubscriber(email: string) {
  const store = state();
  const existing = store.subscribers.find((item) => item.email === email);
  if (existing) return existing;
  const subscriber: Subscriber = { id: id("subscriber"), email, createdAt: now() };
  store.subscribers.push(subscriber);
  return subscriber;
}
