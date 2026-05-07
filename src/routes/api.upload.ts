import { createFileRoute } from "@tanstack/react-router";
import { requireAdmin, json } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export const Route = createFileRoute("/api/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const guard = await requireAdmin(request);
        if (guard.response) return guard.response;

        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) return json({ error: "Image file is required" }, 400);
        if (!ALLOWED.has(file.type)) return json({ error: "Only JPG, PNG, and WebP are allowed" }, 400);
        if (file.size > MAX_BYTES) return json({ error: "Image must be 10MB or smaller" }, 400);

        const buffer = Buffer.from(await file.arrayBuffer());
        const uploaded = await uploadImage(buffer);
        return json(uploaded, 201);
      },
    },
  },
});
