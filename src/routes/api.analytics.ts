import { createFileRoute } from "@tanstack/react-router";
import { checkRateLimit, clientKey, json, requireAdmin } from "@/lib/auth";
import { listAnalytics, trackAnalyticsEvent } from "@/lib/static-cms";

const ALLOWED_EVENTS = new Set(["page_view", "project_view", "contact_submit"]);

export const Route = createFileRoute("/api/analytics")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const url = new URL(request.url);
        const limit = Number(url.searchParams.get("limit") ?? 500);
        return json({ events: await listAnalytics(limit) });
      },
      POST: async ({ request }) => {
        const rate = checkRateLimit(clientKey(request, "analytics"), 120, 60 * 1000);
        if (!rate.ok) {
          return json({ error: "Too many analytics events." }, 429, {
            "retry-after": String(rate.retryAfter),
          });
        }

        const body = (await request.json().catch(() => null)) as {
          page?: unknown;
          event?: unknown;
          metadata?: Record<string, string | number | boolean | null>;
        } | null;
        const page = String(body?.page ?? "").trim();
        const event = String(body?.event ?? "").trim();

        if (!page || !ALLOWED_EVENTS.has(event)) {
          return json({ error: "Invalid analytics event." }, 400);
        }

        const metadata = sanitizeMetadata(body?.metadata);
        await trackAnalyticsEvent({ page, event, metadata });
        return json({ ok: true }, 201);
      },
    },
  },
});

function sanitizeMetadata(input: unknown) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};

  return Object.fromEntries(
    Object.entries(input as Record<string, unknown>)
      .slice(0, 12)
      .map(([key, value]) => {
        if (typeof value === "string") return [key.slice(0, 60), value.slice(0, 180)];
        if (typeof value === "number" || typeof value === "boolean" || value === null) {
          return [key.slice(0, 60), value];
        }
        return [key.slice(0, 60), String(value).slice(0, 180)];
      }),
  );
}
