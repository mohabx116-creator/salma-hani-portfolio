import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const Route = createFileRoute("/api/admin/settings")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
        return json({ settings });
      },
      PUT: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = await request.json().catch(() => null);
        const entries = body?.settings as Record<string, string> | undefined;
        if (!entries) return json({ error: "Settings payload is required" }, 400);

        await prisma.$transaction(
          Object.entries(entries).map(([key, value]) =>
            prisma.siteSetting.upsert({
              where: { key },
              create: { key, value: String(value ?? "") },
              update: { value: String(value ?? "") },
            }),
          ),
        );

        return json({ ok: true });
      },
    },
  },
});
