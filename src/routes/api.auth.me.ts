import { createFileRoute } from "@tanstack/react-router";
import { json, readSession } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await readSession(request);
        return json({ user: session });
      },
    },
  },
});
