import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { AnalyticsEvent, CmsArtwork, Inquiry } from "@/lib/cms-types";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [artworks, setArtworks] = useState<CmsArtwork[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);

  useEffect(() => {
    void Promise.all([
      fetch("/api/admin/artworks")
        .then((r) => r.json())
        .catch(() => ({ artworks: [] })),
      fetch("/api/admin/inquiries")
        .then((r) => r.json())
        .catch(() => ({ inquiries: [] })),
      fetch("/api/analytics?limit=1000")
        .then((r) => r.json())
        .catch(() => ({ events: [] })),
    ]).then(([artworkData, inquiryData, analyticsData]) => {
      setArtworks(artworkData.artworks ?? []);
      setInquiries(inquiryData.inquiries ?? []);
      setEvents(analyticsData.events ?? []);
    });
  }, []);

  const analytics = useMemo(() => {
    const since = Date.now() - 1000 * 60 * 60 * 24 * 30;
    const recent = events.filter((event) => new Date(event.timestamp).getTime() >= since);
    const projectViews = recent.filter((event) => event.event === "project_view");
    const pageViews = recent.filter((event) => event.event === "page_view");
    const contacts = recent.filter((event) => event.event === "contact_submit");
    const byProject = new Map<string, number>();

    for (const event of projectViews) {
      const title = String(event.metadata?.title ?? event.page.replace("/artwork/", ""));
      byProject.set(title, (byProject.get(title) ?? 0) + 1);
    }

    return {
      pageViews: pageViews.length,
      projectViews: projectViews.length,
      contacts: contacts.length,
      conversionRate: pageViews.length ? Math.round((contacts.length / pageViews.length) * 100) : 0,
      topProjects: [...byProject.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([title, views]) => ({ title, views })),
    };
  }, [events]);

  const stats = [
    { label: "Total works", value: artworks.length },
    { label: "Available", value: artworks.filter((a) => a.availability === "AVAILABLE").length },
    { label: "Featured", value: artworks.filter((a) => a.isFeatured).length },
    { label: "Unread inquiries", value: inquiries.filter((i) => !i.read).length },
    { label: "30d visitors", value: analytics.pageViews },
    { label: "Project views", value: analytics.projectViews },
    { label: "Form submits", value: analytics.contacts },
    { label: "Conversion", value: `${analytics.conversionRate}%` },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Studio overview</p>
          <h1 className="mt-4 font-serif text-4xl md:text-5xl">Dashboard</h1>
        </div>
        <a
          href="/admin/artworks/new"
          className="cinematic-button px-6 py-3 text-[10px] uppercase tracking-[0.24em]"
        >
          Add artwork
        </a>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-border bg-background/70 p-5">
            <p className="text-[10px] uppercase tracking-[0.25em] text-ink-soft">{stat.label}</p>
            <p className="mt-4 font-serif text-4xl">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Recent inquiries</h2>
            <a href="/admin/inquiries" className="text-xs uppercase tracking-[0.22em] text-gold">
              View all
            </a>
          </div>
          <div className="overflow-hidden border border-border">
            {inquiries.slice(0, 5).map((inquiry) => (
              <div
                key={inquiry.id}
                className="grid gap-2 border-b border-border p-4 last:border-b-0 md:grid-cols-[1fr_1fr_auto]"
              >
                <div>
                  <p className="font-medium">{inquiry.name}</p>
                  <p className="text-sm text-ink-soft">{inquiry.email}</p>
                </div>
                <p className="line-clamp-2 text-sm text-ink-soft">{inquiry.message}</p>
                <span className="text-xs uppercase tracking-[0.2em] text-gold">
                  {inquiry.interest}
                </span>
              </div>
            ))}
            {inquiries.length === 0 && (
              <p className="p-6 text-sm text-ink-soft">No inquiries yet.</p>
            )}
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl">Top viewed works</h2>
            <span className="text-xs uppercase tracking-[0.22em] text-ink-soft">Last 30 days</span>
          </div>
          <div className="overflow-hidden border border-border">
            {analytics.topProjects.map((item, index) => (
              <div
                key={item.title}
                className="flex items-center justify-between gap-4 border-b border-border p-4 last:border-b-0"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-ink-soft">
                    #{index + 1}
                  </p>
                  <p className="mt-1 font-serif text-lg italic">{item.title}</p>
                </div>
                <p className="font-serif text-3xl">{item.views}</p>
              </div>
            ))}
            {analytics.topProjects.length === 0 && (
              <p className="p-6 text-sm text-ink-soft">No project view data yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="mt-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">CMS readiness</h2>
          <span className="text-xs uppercase tracking-[0.22em] text-gold">Premium stack</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Role-gated admin routes and APIs",
            "Editable works, series, SEO fields, and settings",
            "Image upload plus inner gallery management",
            "Contact and subscriber capture",
            "Dynamic sitemap and robots.txt",
            "First-party analytics and PWA shell",
          ].map((item) => (
            <div
              key={item}
              className="border border-border bg-background/70 p-4 text-sm text-ink-soft"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
