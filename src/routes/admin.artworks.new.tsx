import { createFileRoute } from "@tanstack/react-router";
import { ArtworkForm } from "@/components/admin/ArtworkForm";

export const Route = createFileRoute("/admin/artworks/new")({
  component: NewArtwork,
});

function NewArtwork() {
  return (
    <div>
      <p className="eyebrow">Artwork manager</p>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">New artwork</h1>
      <div className="mt-10">
        <ArtworkForm />
      </div>
    </div>
  );
}
