import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { pickArtworkPayload } from "@/lib/cms-server";
import type { Availability, ContentStatus } from "@/lib/cms-types";
import { deleteArtwork, findArtworkById, updateArtwork } from "@/lib/static-cms";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/api/admin/artworks/$artworkId")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const artwork = await findArtworkById(params.artworkId);
        if (!artwork) return json({ error: "Artwork not found" }, 404);
        return json({ artwork });
      },
      PUT: async ({ request, params }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
        if (!body) return json({ error: "Invalid JSON body" }, 400);

        const payload = pickArtworkPayload(body);
        if (!payload.title || !payload.mainImage) {
          return json({ error: "Title and main image are required" }, 400);
        }

        const images = Array.isArray(body.images) ? body.images : [];
        const artwork = await updateArtwork(params.artworkId, {
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

        if (!artwork) return json({ error: "Artwork not found" }, 404);
        return json({ artwork });
      },
      DELETE: async ({ request, params }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        await deleteArtwork(params.artworkId);
        return json({ ok: true });
      },
    },
  },
});
