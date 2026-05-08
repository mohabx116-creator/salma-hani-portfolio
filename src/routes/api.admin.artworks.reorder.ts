import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { reorderArtworks } from "@/lib/static-cms";

export const Route = createFileRoute("/api/admin/artworks/reorder")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = (await request.json().catch(() => null)) as { ids?: string[] } | null;
        const ids = body?.ids ?? [];
        await reorderArtworks(ids);

        return json({ ok: true });
      },
    },
  },
});
