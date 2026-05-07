export type Availability = "AVAILABLE" | "SOLD" | "COMMISSION" | "NOT_FOR_SALE";

export type CmsArtworkImage = {
  id: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  order: number;
};

export type CmsSeries = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  displayOrder: number;
};

export type CmsArtwork = {
  id: string;
  title: string;
  slug: string;
  year?: number | null;
  medium: string;
  dimensions?: string | null;
  description?: string | null;
  statement?: string | null;
  mainImage: string;
  mainImageAlt?: string | null;
  images: CmsArtworkImage[];
  series?: CmsSeries | null;
  seriesId?: string | null;
  availability: Availability;
  price?: string | number | null;
  showPrice: boolean;
  isFeatured: boolean;
  displayOrder: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
  ogImage?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  interest: string;
  artworkId?: string | null;
  artworkSlug?: string | null;
  message: string;
  read: boolean;
  archived: boolean;
  createdAt: string;
};

export type Subscriber = {
  id: string;
  email: string;
  createdAt: string;
};

export type SiteSetting = {
  key: string;
  value: string;
};

export const MEDIUM_OPTIONS = [
  "Oil on canvas",
  "Oil on panel",
  "Charcoal on paper",
  "Graphite on paper",
  "Mixed media",
  "Acrylic",
  "Digital study",
];

export const AVAILABILITY_LABELS: Record<Availability, string> = {
  AVAILABLE: "Available",
  SOLD: "Sold",
  COMMISSION: "Commission",
  NOT_FOR_SALE: "Not for sale",
};
