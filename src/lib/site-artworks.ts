import type { Artwork as StaticArtwork } from "@/data/artworks";
import type { CmsArtwork } from "@/lib/cms-types";

export type SiteArtwork = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  image: string;
  available: boolean;
  year?: string;
  medium?: string;
  price?: number;
  currency?: string;
  showPrice: boolean;
  isFeatured: boolean;
  placement?: StaticArtwork["placement"];
  ratio?: StaticArtwork["ratio"];
};

export function staticArtworkToSiteArtwork(artwork: StaticArtwork): SiteArtwork {
  return {
    id: artwork.id,
    slug: artwork.id,
    title: artwork.title,
    description: artwork.description,
    category: artwork.category,
    image: artwork.image,
    available: artwork.available,
    year: artwork.year,
    medium: artwork.medium,
    price: artwork.price,
    currency: "EUR",
    showPrice: typeof artwork.price === "number",
    isFeatured: artwork.placement === "featured",
    placement: artwork.placement,
    ratio: artwork.ratio,
  };
}

export function cmsArtworkToSiteArtwork(artwork: CmsArtwork): SiteArtwork {
  const parsedPrice =
    artwork.price == null || artwork.price === ""
      ? undefined
      : typeof artwork.price === "number"
        ? artwork.price
        : Number(artwork.price);

  return {
    id: artwork.id,
    slug: artwork.slug,
    title: artwork.title,
    description: artwork.description ?? "",
    category: artwork.series?.name ?? artwork.medium,
    image: artwork.mainImage,
    available: artwork.availability === "AVAILABLE",
    year: artwork.year ? String(artwork.year) : undefined,
    medium: artwork.medium,
    price: Number.isFinite(parsedPrice) ? parsedPrice : undefined,
    currency: artwork.currency ?? "USD",
    showPrice: artwork.showPrice,
    isFeatured: artwork.isFeatured,
  };
}
