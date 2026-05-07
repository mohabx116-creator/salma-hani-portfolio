import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const Route = createFileRoute("/api/admin/artworks/reorder")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = (await request.json().catch(() => null)) as { ids?: string[] } | null;
        const ids = body?.ids ?? [];
        await prisma.$transaction(
          ids.map((id, displayOrder) =>
            prisma.artwork.update({ where: { id }, data: { displayOrder } }),
          ),
        );

        return json({ ok: true });
      },
    },
  },
});
