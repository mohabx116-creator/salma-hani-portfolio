import { createFileRoute } from "@tanstack/react-router";
import { Resend } from "resend";
import { checkRateLimit, clientKey, json } from "@/lib/auth";
import { createInquiry, findArtworkBySlug } from "@/lib/static-cms";

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const rate = checkRateLimit(clientKey(request, "contact"), 5, 60 * 60 * 1000);
        if (!rate.ok) {
          return json({ error: "Too many submissions. Try again later." }, 429, {
            "retry-after": String(rate.retryAfter),
          });
        }

        const body = await request.json().catch(() => null);
        if (body?.company) return json({ ok: true });

        const name = String(body?.name ?? "").trim();
        const email = String(body?.email ?? "")
          .toLowerCase()
          .trim();
        const interest = String(body?.interest ?? "General").trim();
        const message = String(body?.message ?? "").trim();
        const artworkSlug = String(body?.artworkSlug ?? "").trim() || null;

        if (!name || !email || !message) {
          return json({ error: "Name, email, and message are required" }, 400);
        }

        const artwork = artworkSlug ? await findArtworkBySlug(artworkSlug) : null;
        const inquiry = await createInquiry({
          name,
          email,
          interest,
          message,
          artworkId: artwork?.id,
          artworkSlug,
        });

        if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
          const resend = new Resend(process.env.RESEND_API_KEY);
          await resend.emails
            .send({
              from: process.env.CONTACT_FROM_EMAIL || "Salma Hani Studio <onboarding@resend.dev>",
              to: process.env.CONTACT_TO_EMAIL,
              subject: `New ${interest} inquiry from ${name}`,
              replyTo: email,
              text: [
                `Name: ${name}`,
                `Email: ${email}`,
                `Interest: ${interest}`,
                artworkSlug ? `Artwork: /artwork/${artworkSlug}` : "",
                "",
                message,
              ]
                .filter(Boolean)
                .join("\n"),
            })
            .catch(() => undefined);
        }

        return json({ ok: true, inquiryId: inquiry.id }, 201);
      },
    },
  },
});
