import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const Route = createFileRoute("/api/admin/inquiries")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const inquiries = await prisma.inquiry.findMany({
          where: { status: { not: "CLOSED" } },
          include: { artwork: { select: { slug: true } } },
          orderBy: { createdAt: "desc" },
        });
        return json({
          inquiries: inquiries.map((inquiry) => ({
            ...inquiry,
            artworkSlug: inquiry.artwork?.slug ?? null,
            createdAt: inquiry.createdAt.toISOString(),
          })),
        });
      },
      PUT: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = await request.json().catch(() => null);
        const id = String(body?.id ?? "");
        if (!id) return json({ error: "Inquiry id is required" }, 400);

        const inquiry = await prisma.inquiry.update({
          where: { id },
          data: {
            read: typeof body?.read === "boolean" ? body.read : undefined,
            status: body?.archived === true ? "CLOSED" : undefined,
          },
        });
        return json({
          inquiry: {
            ...inquiry,
            artworkSlug: null,
            createdAt: inquiry.createdAt.toISOString(),
          },
        });
      },
    },
  },
});
