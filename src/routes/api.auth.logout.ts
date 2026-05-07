import { createFileRoute } from "@tanstack/react-router";
import { clearSessionCookie, json } from "@/lib/auth";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async () => json({ ok: true }, 200, { "set-cookie": clearSessionCookie() }),
    },
  },
});
