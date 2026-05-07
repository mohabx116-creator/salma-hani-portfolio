import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const Route = createFileRoute("/api/newsletter")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        if (body?.company) return json({ ok: true });

        const email = String(body?.email ?? "").toLowerCase().trim();
        if (!email || !email.includes("@")) return json({ error: "Valid email is required" }, 400);

        await prisma.subscriber.upsert({
          where: { email },
          create: { email },
          update: {},
        });

        return json({ ok: true }, 201);
      },
    },
  },
});
