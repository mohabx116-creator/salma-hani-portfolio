import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

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
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          setLoading(true);
          const form = new FormData(event.currentTarget);
          const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              email: form.get("email"),
              password: form.get("password"),
            }),
          });
          setLoading(false);
          if (!response.ok) {
            const data = await response.json().catch(() => null);
            setError(response.status === 401 ? "Invalid email or password." : data?.error || "Sign in failed.");
            return;
          }
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
