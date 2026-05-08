import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Subscriber } from "@/lib/cms-types";

export const Route = createFileRoute("/admin/subscribers")({
  component: AdminSubscribers,
});

function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/subscribers")
      .then((response) => response.json())
      .then((data) => setSubscribers(data.subscribers ?? []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <p className="eyebrow">Audience</p>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">Subscribers</h1>

      <div className="mt-10 overflow-hidden border border-border">
        {subscribers.map((subscriber) => (
          <div
            key={subscriber.id}
            className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-[1fr_auto]"
          >
            <a href={`mailto:${subscriber.email}`} className="text-gold">
              {subscriber.email}
            </a>
            <span className="text-xs uppercase tracking-[0.2em] text-ink-soft">
              {new Date(subscriber.createdAt).toLocaleDateString()}
            </span>
          </div>
        ))}
        {!loading && subscribers.length === 0 && (
          <p className="p-6 text-sm text-ink-soft">No newsletter subscribers yet.</p>
        )}
        {loading && <p className="p-6 text-sm text-ink-soft">Loading subscribers...</p>}
      </div>
    </div>
  );
}
