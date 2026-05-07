import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { listInquiries, updateInquiry } from "@/lib/static-cms";

export const Route = createFileRoute("/api/admin/inquiries")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        return json({ inquiries: listInquiries() });
      },
      PUT: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const body = await request.json().catch(() => null);
        const id = String(body?.id ?? "");
        if (!id) return json({ error: "Inquiry id is required" }, 400);

        const inquiry = updateInquiry({
          id,
          read: typeof body?.read === "boolean" ? body.read : undefined,
          archived: body?.archived === true,
        });
        if (!inquiry) return json({ error: "Inquiry not found" }, 404);
        return json({
          inquiry,
        });
      },
    },
  },
});
