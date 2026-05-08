import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Inquiry } from "@/lib/cms-types";

export const Route = createFileRoute("/admin/inquiries")({
  component: AdminInquiries,
});

function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const load = () =>
    fetch("/api/admin/inquiries")
      .then((response) => response.json())
      .then((data) => setInquiries(data.inquiries ?? []));

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <p className="eyebrow">Collector messages</p>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">Inquiries</h1>
      <div className="mt-10 grid gap-4">
        {inquiries.map((inquiry) => (
          <article key={inquiry.id} className={`border border-border p-5 ${inquiry.read ? "opacity-70" : ""}`}>
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="font-serif text-2xl italic">{inquiry.name}</p>
                <a href={`mailto:${inquiry.email}`} className="text-sm text-gold">{inquiry.email}</a>
              </div>
              <div className="text-xs uppercase tracking-[0.2em] text-ink-soft">
                {inquiry.interest} / {new Date(inquiry.createdAt).toLocaleDateString()}
              </div>
            </div>
            {inquiry.artworkSlug && <p className="mt-4 text-sm text-ink-soft">Artwork: /artwork/{inquiry.artworkSlug}</p>}
            <p className="mt-5 whitespace-pre-wrap leading-7 text-foreground">{inquiry.message}</p>
            <div className="mt-5 flex gap-3">
              <button
                className="border border-border px-4 py-2 text-sm"
                onClick={async () => {
                  await fetch("/api/admin/inquiries", {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ id: inquiry.id, read: !inquiry.read }),
                  });
                  void load();
                }}
              >
                Mark {inquiry.read ? "unread" : "read"}
              </button>
              <button
                className="border border-border px-4 py-2 text-sm text-destructive"
                onClick={async () => {
                  await fetch("/api/admin/inquiries", {
                    method: "PUT",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({ id: inquiry.id, archived: true }),
                  });
                  void load();
                }}
              >
                Archive
              </button>
            </div>
          </article>
        ))}
        {inquiries.length === 0 && <p className="border border-border p-6 text-sm text-ink-soft">No inquiries yet.</p>}
      </div>
    </div>
  );
}
