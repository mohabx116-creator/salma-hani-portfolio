import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { listSubscribers } from "@/lib/static-cms";

export const Route = createFileRoute("/api/admin/subscribers")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        return json({ subscribers: await listSubscribers() });
      },
    },
  },
});
