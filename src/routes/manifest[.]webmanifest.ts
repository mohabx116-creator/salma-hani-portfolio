import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/manifest.webmanifest")({
  server: {
    handlers: {
      GET: async () =>
        new Response(
          JSON.stringify({
            name: "Salma Hani M Portfolio",
            short_name: "Salma Hani",
            description: "Fine art portfolio and private studio CMS.",
            start_url: "/home",
            scope: "/",
            display: "standalone",
            background_color: "#F5F0E8",
            theme_color: "#1A1A1A",
            orientation: "portrait-primary",
            categories: ["art", "portfolio"],
          }),
          {
            headers: {
              "content-type": "application/manifest+json",
              "cache-control": "public, max-age=3600",
            },
          },
        ),
    },
  },
});
