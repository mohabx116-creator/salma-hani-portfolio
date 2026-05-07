import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const defaults = {
  artistName: "Salma Hani M",
  tagline: "Capturing the soul through color and silence",
  instagram: "",
  publicEmail: "",
  commissionPricing: "",
  metaTitle: "Salma Hani M - Fine Artist",
  metaDescription: "Fine art portfolio of Salma Hani M.",
};

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [settings, setSettings] = useState(defaults);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((response) => response.json())
      .then((data) => {
        const next = { ...defaults };
        for (const item of data.settings ?? []) {
          if (item.key in next) next[item.key as keyof typeof next] = item.value;
        }
        setSettings(next);
      })
      .catch(() => undefined);
  }, []);

  const update = (key: keyof typeof defaults, value: string) => {
    setSettings((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  return (
    <div>
      <p className="eyebrow">Site content</p>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">Settings</h1>
      <form
        className="mt-10 grid gap-6"
        onSubmit={async (event) => {
          event.preventDefault();
          await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ settings }),
          });
          setSaved(true);
        }}
      >
        {Object.entries(settings).map(([key, value]) => (
          <label key={key}>
            <span className="admin-label">{key}</span>
            {key === "commissionPricing" || key === "metaDescription" ? (
              <textarea rows={5} value={value} onChange={(event) => update(key as keyof typeof defaults, event.target.value)} className="admin-input resize-y" />
            ) : (
              <input value={value} onChange={(event) => update(key as keyof typeof defaults, event.target.value)} className="admin-input" />
            )}
          </label>
        ))}
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-soft">{saved ? "Settings saved." : ""}</p>
          <button className="cinematic-button px-6 py-3 text-[10px] uppercase tracking-[0.24em]">Save settings</button>
        </div>
      </form>
    </div>
  );
}
