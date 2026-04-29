import { useState } from "react";
import { useLang } from "@/i18n/LanguageContext";

export function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="py-32 md:py-48 px-6 md:px-12">
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow">{t.contact.eyebrow}</p>
        <h2 className="mt-5 font-serif text-4xl md:text-5xl lg:text-6xl text-foreground">{t.contact.title}</h2>
        <p className="mt-5 text-ink-soft font-light">{t.contact.sub}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
          className="mt-16 space-y-8 text-start"
        >
          <Field label={t.contact.name} name="name" />
          <Field label={t.contact.email} name="email" type="email" />
          <div>
            <label className="block text-[10px] uppercase tracking-[0.3em] text-ink-soft mb-3">
              {t.contact.message}
            </label>
            <textarea
              required
              rows={5}
              className="w-full bg-transparent border-b border-border pb-3 outline-none text-foreground font-light focus:border-gold transition-colors resize-none"
            />
          </div>
          <div className="pt-4 text-center">
            {sent ? (
              <p className="font-serif italic text-lg text-gold">{t.contact.sent}</p>
            ) : (
              <button
                type="submit"
                className="inline-flex items-center gap-4 px-10 py-4 bg-foreground text-background text-[10px] uppercase tracking-[0.3em] hover:bg-gold transition-colors duration-500"
              >
                {t.contact.send}
              </button>
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
