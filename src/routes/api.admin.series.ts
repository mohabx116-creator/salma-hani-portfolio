import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export const Route = createFileRoute("/api/admin/series")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const series = await prisma.series.findMany({
          include: { _count: { select: { artworks: true } } },
          orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
        });
        return json({ series });
      },
      POST: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = await request.json().catch(() => null);
        const name = String(body?.name ?? "").trim();
        if (!name) return json({ error: "Series name is required" }, 400);

        const series = await prisma.series.create({
          data: {
            name,
            slug: String(body?.slug ?? "").trim() || slugify(name),
            description: String(body?.description ?? "").trim() || null,
          },
        });

        return json({ series }, 201);
      },
    },
  },
});
