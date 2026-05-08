import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { listSettings, updateSettings } from "@/lib/static-cms";

export const Route = createFileRoute("/api/admin/settings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        return json({ settings: await listSettings() });
      },
      PUT: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = await request.json().catch(() => null);
        const entries = body?.settings as Record<string, string> | undefined;
        if (!entries) return json({ error: "Settings payload is required" }, 400);

        await updateSettings(entries);

        return json({ ok: true });
      },
    },
  },
});
