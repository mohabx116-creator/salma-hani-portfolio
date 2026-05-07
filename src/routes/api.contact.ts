import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json().catch(() => null);
        if (body?.company) return json({ ok: true });

        const name = String(body?.name ?? "").trim();
        const email = String(body?.email ?? "").toLowerCase().trim();
        const interest = String(body?.interest ?? "General").trim();
        const message = String(body?.message ?? "").trim();
        const artworkSlug = String(body?.artworkSlug ?? "").trim() || null;

        if (!name || !email || !message) {
          return json({ error: "Name, email, and message are required" }, 400);
        }

        const artwork = artworkSlug
          ? await prisma.artwork.findUnique({ where: { slug: artworkSlug } }).catch(() => null)
          : null;

        const inquiry = await prisma.inquiry.create({
          data: {
            name,
            email,
            interest,
            message,
            artworkId: artwork?.id,
          },
        });

        return json({ ok: true, inquiryId: inquiry.id }, 201);
      },
    },
  },
});
