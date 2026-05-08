import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { pickArtworkPayload } from "@/lib/cms-server";
import type { Availability, ContentStatus } from "@/lib/cms-types";
import { createArtwork, listArtworks } from "@/lib/static-cms";
import { slugify } from "@/lib/slug";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='1500' viewBox='0 0 1200 1500'%3E%3Crect width='1200' height='1500' fill='%23ebe4d7'/%3E%3Cpath d='M210 1060 475 620l160 245 110-155 245 350H210Z' fill='%239f7c53' fill-opacity='.28'/%3E%3Ccircle cx='790' cy='500' r='95' fill='%239f7c53' fill-opacity='.35'/%3E%3Ctext x='600' y='1280' text-anchor='middle' font-family='serif' font-size='72' fill='%23191716'%3EArtwork%3C/text%3E%3C/svg%3E";

export const Route = createFileRoute("/api/admin/artworks")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const url = new URL(request.url);
        const availability = url.searchParams.get("availability");
        const seriesId = url.searchParams.get("seriesId");

        return json({ artworks: await listArtworks({ availability, seriesId }) });
      },
      POST: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        if (!body) return json({ error: "Invalid JSON body" }, 400);

        const payload = pickArtworkPayload(body);
        if (!payload.title) {
          return json({ error: "Title is required" }, 400);
        }

        const images = Array.isArray(body.images) ? body.images : [];
        const artwork = await createArtwork({
          ...payload,
          availability: payload.availability as Availability,
          status: payload.status as ContentStatus,
          slug: payload.slug || slugify(payload.title),
          mainImage: payload.mainImage || FALLBACK_IMAGE,
          images: images.map((image, index) => {
            const item = image as Record<string, unknown>;
            return {
              id: String(item.id ?? `image-${Date.now()}-${index}`),
              url: String(item.url ?? ""),
              altText: String(item.altText ?? payload.title),
              caption: String(item.caption ?? ""),
              order: Number(item.order ?? index),
            };
          }),
        });

        return json({ artwork }, 201);
      },
    },
  },
});
