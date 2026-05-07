import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { pickArtworkPayload, serializeArtwork } from "@/lib/cms-server";
import { prisma } from "@/lib/prisma";
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

        const artworks = await prisma.artwork.findMany({
          where: {
            availability: (availability || undefined) as never,
            seriesId: seriesId || undefined,
          },
          include: { images: { orderBy: { order: "asc" } }, series: true },
          orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        });

        return json({ artworks: artworks.map(serializeArtwork) });
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
        const artwork = await prisma.artwork.create({
          data: {
            ...payload,
            availability: payload.availability as never,
            slug: payload.slug || slugify(payload.title),
            images: {
              create: images.map((image, index) => {
                const item = image as Record<string, unknown>;
                return {
                  url: String(item.url ?? ""),
                  alt: String(item.alt ?? payload.title),
                  caption: String(item.caption ?? ""),
                  order: Number(item.order ?? index),
                };
              }),
            },
          },
          include: { images: { orderBy: { order: "asc" } }, series: true },
        });

        return json({ artwork: serializeArtwork(artwork) }, 201);
      },
    },
  },
});
