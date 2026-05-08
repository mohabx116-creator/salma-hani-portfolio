import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

const ADMIN_EMAIL = "salmahani963@gmail.com";
const ADMIN_PASSWORD = "salmamorv";
const ADMIN_COOKIE = "salma_admin_session";
const ADMIN_TOKEN = "salma-admin-open-session";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 text-foreground">
      <form
        className="w-full max-w-md border border-border bg-background/80 p-8 shadow-soft"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          setLoading(true);

          const form = new FormData(event.currentTarget);
          const email = normalizeLoginValue(String(form.get("email") ?? "")).toLowerCase();
          const password = normalizeLoginValue(String(form.get("password") ?? ""));

          setLoading(false);

          if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
            setError("Invalid email or password.");
            return;
          }

          document.cookie = `${ADMIN_COOKIE}=${encodeURIComponent(`${ADMIN_TOKEN}:${ADMIN_EMAIL}`)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`;
          window.location.href = "/admin";
        }}
      >
        <p className="eyebrow">Artist access</p>
        <h1 className="mt-4 font-serif text-4xl italic">Studio CMS</h1>
        <p className="mt-3 text-sm leading-7 text-ink-soft">
          Manage artworks, inner galleries, inquiries, and public site content.
        </p>

        <div className="mt-10 space-y-6">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">Email</span>
            <input
              required
              name="email"
              type="email"
              className="mt-3 w-full border-b border-border bg-transparent pb-3 outline-none focus:border-gold"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.3em] text-ink-soft">Password</span>
            <input
              required
              name="password"
              type="password"
              className="mt-3 w-full border-b border-border bg-transparent pb-3 outline-none focus:border-gold"
            />
          </label>
        </div>

        {error && <p className="mt-5 text-sm text-destructive">{error}</p>}

        <button
          disabled={loading}
          className="cinematic-button mt-8 w-full px-8 py-4 text-[10px] uppercase tracking-[0.28em] disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

function normalizeLoginValue(value: string) {
  const trimmed = value.replace(/[\u200B-\u200D\uFEFF]/g, "").trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }
  return trimmed;
}
