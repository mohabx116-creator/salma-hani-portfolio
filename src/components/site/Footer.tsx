import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";

export function Footer() {
  const { t } = useLang();
  const [subscribed, setSubscribed] = useState(false);
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border/70 py-16 px-[5vw] bg-background">
      <div className="mx-auto max-w-[1500px] flex flex-col md:flex-row gap-10 md:items-end md:justify-between">
        <div>
          <p className="font-serif text-2xl text-foreground">
            Salma <span className="text-gold">Hani</span> M
          </p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-ink-soft">{t.footer.studio}</p>
        </div>
        <div className="flex flex-col md:items-end gap-6">
          <form
            className="flex w-full max-w-md gap-3"
            onSubmit={async (event) => {
              event.preventDefault();
              const form = new FormData(event.currentTarget);
              const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ email: form.get("email"), company: form.get("company") }),
              });
              if (response.ok) setSubscribed(true);
            }}
          >
            <input name="company" tabIndex={-1} autoComplete="off" className="hidden" />
            <input
              required
              name="email"
              type="email"
              placeholder={subscribed ? "Subscribed" : "Exhibition announcements"}
              className="min-w-0 flex-1 border-b border-border bg-transparent pb-2 text-sm outline-none focus:border-gold"
            />
            <button className="text-[10px] uppercase tracking-[0.24em] text-gold">Join</button>
          </form>
          <div className="flex gap-6 text-[10px] uppercase tracking-[0.3em] text-ink-soft">
            <a href="https://instagram.com/__morvii_" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Instagram</a>
            <a href="#contact" className="hover:text-foreground transition-colors">Email</a>
            <a href="#commissions" className="hover:text-foreground transition-colors">Commissions</a>
          </div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-ink-soft/60">
            Copyright {year} / {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
