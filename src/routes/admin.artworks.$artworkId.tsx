import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArtworkForm } from "@/components/admin/ArtworkForm";
import type { CmsArtwork } from "@/lib/cms-types";

export const Route = createFileRoute("/admin/artworks/$artworkId")({
  component: EditArtwork,
});

function EditArtwork() {
  const { artworkId } = Route.useParams();
  const [artwork, setArtwork] = useState<CmsArtwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/artworks/${artworkId}`)
      .then((response) => response.json())
      .then((data) => setArtwork(data.artwork ?? null))
      .finally(() => setLoading(false));
  }, [artworkId]);

  if (loading) return <p className="text-ink-soft">Loading artwork...</p>;
  if (!artwork) return <p className="text-destructive">Artwork not found.</p>;

  return (
    <div>
      <p className="eyebrow">Artwork manager</p>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">Edit {artwork.title}</h1>
      <div className="mt-10">
        <ArtworkForm artwork={artwork} />
      </div>
    </div>
  );
}
