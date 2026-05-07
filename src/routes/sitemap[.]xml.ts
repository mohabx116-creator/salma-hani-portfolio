import { createFileRoute } from "@tanstack/react-router";
import { artworks } from "@/data/artworks";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const slugs = artworks.map((artwork) => artwork.id);

        const urls = ["", ...slugs.map((slug) => `artwork/${slug}`)];

        return new Response(
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
            .map((url) => `  <url><loc>${origin}/${url}</loc></url>`)
            .join("\n")}\n</urlset>`,
          { headers: { "content-type": "application/xml" } },
        );
      },
    },
  },
});
