import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { pickArtworkPayload } from "@/lib/cms-server";
import type { Availability, ContentStatus } from "@/lib/cms-types";
import { createArtwork, listArtworks } from "@/lib/static-cms";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/api/admin/artworks")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const url = new URL(request.url);
        const availability = url.searchParams.get("availability");
        const seriesId = url.searchParams.get("seriesId");

        return json({ artworks: listArtworks({ availability, seriesId }) });
      },
      POST: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        if (!body) return json({ error: "Invalid JSON body" }, 400);

        const payload = pickArtworkPayload(body);
        if (!payload.title || !payload.mainImage) {
          return json({ error: "Title and main image are required" }, 400);
        }

        const images = Array.isArray(body.images) ? body.images : [];
        const artwork = createArtwork({
          ...payload,
          availability: payload.availability as Availability,
          status: payload.status as ContentStatus,
          slug: payload.slug || slugify(payload.title),
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
