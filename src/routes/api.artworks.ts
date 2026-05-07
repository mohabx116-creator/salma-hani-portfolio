import { createFileRoute } from "@tanstack/react-router";
import { json } from "@/lib/auth";
import { listArtworks } from "@/lib/static-cms";

export const Route = createFileRoute("/api/artworks")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        const featured = url.searchParams.get("featured");
        const availability = url.searchParams.get("availability");
        return json({
          artworks: listArtworks({
            featured: featured === "true" ? true : undefined,
            availability,
          }),
        });
      },
    },
  },
});
