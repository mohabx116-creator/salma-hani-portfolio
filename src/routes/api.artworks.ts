import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/auth";
import { serializeArtwork } from "@/lib/cms-server";
import { prisma } from "@/lib/prisma";

export const Route = createFileRoute("/api/artworks")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const featured = url.searchParams.get("featured");
        const availability = url.searchParams.get("availability");
        const artworks = await prisma.artwork.findMany({
          where: {
            isFeatured: featured === "true" ? true : undefined,
            availability: (availability || undefined) as never,
          },
          include: { images: { orderBy: { order: "asc" } }, series: true },
          orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        });

        return json({ artworks: artworks.map(serializeArtwork) });
      },
    },
  },
});
