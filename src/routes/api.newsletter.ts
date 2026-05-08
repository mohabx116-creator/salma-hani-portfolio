import { createFileRoute } from "@tanstack/react-router";
import { checkRateLimit, clientKey, json } from "@/lib/auth";
import { addSubscriber } from "@/lib/static-cms";

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rate = checkRateLimit(clientKey(request, "newsletter"), 10, 60 * 60 * 1000);
        if (!rate.ok) {
          return json({ error: "Too many submissions. Try again later." }, 429, {
            "retry-after": String(rate.retryAfter),
          });
        }

        const body = await request.json().catch(() => null);
        if (body?.company) return json({ ok: true });

        const email = String(body?.email ?? "")
          .toLowerCase()
          .trim();
        if (!email || !email.includes("@")) return json({ error: "Valid email is required" }, 400);

        await addSubscriber(email);

        return json({ ok: true }, 201);
      },
    },
  },
});
