import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/auth";
import { addSubscriber } from "@/lib/static-cms";

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        if (body?.company) return json({ ok: true });

        const email = String(body?.email ?? "")
          .toLowerCase()
          .trim();
        if (!email || !email.includes("@")) return json({ error: "Valid email is required" }, 400);

        addSubscriber(email);

        return json({ ok: true }, 201);
      },
    },
  },
});
