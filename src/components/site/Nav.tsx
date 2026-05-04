import { useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useLang } from "@/i18n/LanguageContext";
import { useTheme } from "@/i18n/ThemeContext";
import { LANGUAGES, type Lang } from "@/i18n/translations";

export function Nav() {
  const { t, lang, setLang } = useLang();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "#works", label: t.nav.works },
    { href: "#about", label: t.nav.about },
    { href: "#commissions", label: t.nav.commissions },
    { href: "#shop", label: t.nav.shop },
    { href: "#contact", label: t.nav.contact },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/45 backdrop-blur-xl border-b border-border/60 shadow-[0_4px_30px_rgba(0,0,0,0.10)]">
      <div className="mx-auto max-w-[1600px] px-[5vw] h-20 flex items-center justify-between">
        <a href="#top" className="font-serif text-lg tracking-[0.3em] uppercase text-gold">
          Salma <span className="text-gold">Hani</span> M
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="font-serif text-[10px] uppercase tracking-[0.22em] text-ink-soft hover:text-gold transition-colors duration-500"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code as Lang)}
              className={`px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] transition-colors ${
                lang === l.code ? "text-gold" : "text-ink-soft/60 hover:text-gold"
              }`}
              aria-label={l.label}
            >
              {l.native}
            </button>
          ))}
          <button
            onClick={toggle}
            className="ms-2 p-2 text-gold/80 hover:text-gold transition-colors"
            aria-label={theme === "dark" ? t.theme.light : t.theme.dark}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden ms-2 text-[14px] uppercase tracking-[0.2em] text-gold"
            aria-label="Menu"
          >
            {open ? "—" : "≡"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border/50 bg-background/95 px-6 py-6 flex flex-col gap-5 backdrop-blur-xl">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-xs uppercase tracking-[0.28em] text-ink-soft"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
