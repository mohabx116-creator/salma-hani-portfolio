import { Outlet, useRouterState } from "@tanstack/react-router";
import { BarChart3, Images, Image, Inbox, LogOut, Palette, Settings, Users } from "lucide-react";
import { useEffect, useState } from "react";

const nav = [
  { to: "/admin", label: "Dashboard", icon: BarChart3 },
  { to: "/admin/artworks", label: "Artworks", icon: Image },
  { to: "/admin/media", label: "Media", icon: Images },
  { to: "/admin/series", label: "Series", icon: Palette },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/subscribers", label: "Subscribers", icon: Users },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => response.json())
      .then((data) => {
        if (!data.user && pathname !== "/admin/login") {
          window.location.href = "/admin/login";
          return;
        }
        setReady(true);
      })
      .catch(() => {
        if (pathname !== "/admin/login") window.location.href = "/admin/login";
      });
  }, [pathname]);

  if (pathname === "/admin/login") return <Outlet />;
  if (!ready) return <AdminLoading />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 start-0 z-40 hidden w-72 border-e border-border/70 bg-background/95 px-5 py-6 backdrop-blur md:block">
        <a href="/" className="font-serif text-lg uppercase tracking-[0.28em] text-gold">
          Salma Hani
        </a>
        <nav className="mt-12 space-y-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <a
                key={item.to}
                href={item.to}
                className={`flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors ${
                  active
                    ? "bg-gold/10 text-gold"
                    : "text-ink-soft hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </a>
            );
          })}
        </nav>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
          className="absolute bottom-6 start-5 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-ink-soft hover:bg-muted hover:text-foreground"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </aside>

      <div className="border-b border-border/70 bg-background/95 px-5 py-4 md:hidden">
        <div className="flex items-center justify-between">
          <a href="/" className="font-serif text-sm uppercase tracking-[0.24em] text-gold">
            Salma Admin
          </a>
          <a href="/admin/artworks" className="text-xs uppercase tracking-[0.18em] text-ink-soft">
            Artworks
          </a>
        </div>
      </div>

      <main className="md:ps-72">
        <div className="mx-auto max-w-7xl px-5 py-8 md:px-10 md:py-12">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background text-ink-soft">
      <p className="font-serif text-xl italic">Opening studio dashboard...</p>
    </div>
  );
}
