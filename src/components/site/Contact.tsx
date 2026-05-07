import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";

export function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  return (
    <section id="contact" className="py-32 md:py-48 px-[5vw]">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">{t.contact.eyebrow}</p>
        <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">{t.contact.title}</h2>
        <p className="mt-5 text-ink-soft font-light">{t.contact.sub}</p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            const form = new FormData(e.currentTarget);
            const artworkSlug =
              typeof window !== "undefined"
                ? new URLSearchParams(window.location.search).get("artwork")
                : null;
            const response = await fetch("/api/contact", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                name: form.get("name"),
                email: form.get("email"),
                interest: form.get("interest"),
                message: form.get("message"),
                company: form.get("company"),
                artworkSlug,
              }),
            });
            if (!response.ok) {
              setError("Please try again in a moment.");
              return;
            }
            setSent(true);
          }}
          className="mt-16 space-y-8 text-start"
        >
          <input name="company" tabIndex={-1} autoComplete="off" className="hidden" />
          <Field label={t.contact.name} name="name" />
          <Field label={t.contact.email} name="email" type="email" />
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-3">
              Interest
            </label>
            <select
              name="interest"
              className="w-full bg-transparent border-b border-border pb-3 outline-none text-foreground font-light focus:border-gold transition-colors"
            >
              <option>Acquisition</option>
              <option>Commission</option>
              <option>Exhibition</option>
              <option>General</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-3">
              {t.contact.message}
            </label>
            <textarea
              required
              name="message"
              rows={5}
              className="w-full bg-transparent border-b border-border pb-3 outline-none text-foreground font-light focus:border-gold transition-colors resize-none"
            />
          </div>
          <div className="pt-4 text-center">
            {sent ? (
              <p className="font-serif italic text-lg text-gold">{t.contact.sent}</p>
            ) : (
              <>
                {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
                <button
                  type="submit"
                  className="cinematic-button inline-flex items-center gap-4 px-10 py-4 text-[10px] uppercase tracking-[0.28em]"
                >
                  {t.contact.send}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label className="block text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-3">{label}</label>
      <input
        required
        name={name}
        type={type}
        className="w-full bg-transparent border-b border-border pb-3 outline-none text-foreground font-light focus:border-gold transition-colors"
      />
    </div>
  );
}
