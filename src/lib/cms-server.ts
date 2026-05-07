type ArtworkWithRelations = {
  price?: { toString: () => string } | string | number | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  images?: Array<{ order: number }>;
  series?: unknown;
  [key: string]: unknown;
};

export function serializeArtwork(artwork: ArtworkWithRelations) {
  const createdAt =
    artwork.createdAt instanceof Date ? artwork.createdAt.toISOString() : artwork.createdAt;
  const updatedAt =
    artwork.updatedAt instanceof Date ? artwork.updatedAt.toISOString() : artwork.updatedAt;

  return {
    ...artwork,
    price: artwork.price ? artwork.price.toString() : null,
    createdAt,
    updatedAt,
    images: [...(artwork.images ?? [])].sort((a, b) => a.order - b.order),
    series: artwork.series ?? null,
  };
}

export function pickArtworkPayload(body: Record<string, unknown>) {
  return {
    title: String(body.title ?? "").trim(),
    slug: String(body.slug ?? "").trim(),
    year: body.year ? Number(body.year) : null,
    medium: String(body.medium ?? "Mixed media").trim(),
    dimensions: nullableString(body.dimensions),
    description: nullableString(body.description),
    mainImage: String(body.mainImage ?? "").trim(),
    seriesId: nullableString(body.seriesId),
    availability: String(body.availability ?? "AVAILABLE"),
    price: body.price === "" || body.price == null ? null : Number(body.price),
    currency: String(body.currency ?? "USD"),
    showPrice: Boolean(body.showPrice),
    isFeatured: Boolean(body.isFeatured),
    displayOrder: Number(body.displayOrder ?? 0),
    status: String(body.status ?? "PUBLISHED"),
    metaTitle: nullableString(body.metaTitle),
    metaDesc: nullableString(body.metaDesc),
    ogImage: nullableString(body.ogImage),
  };
}

export function nullableString(value: unknown) {
  const next = String(value ?? "").trim();
  return next.length ? next : null;
}
