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
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/75 backdrop-blur-md border-b border-border/50">
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 h-20 flex items-center justify-between">
        <a href="#top" className="font-serif text-xl tracking-[0.18em] uppercase text-foreground">
          Salma <span className="text-gold">Hani</span> M
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] uppercase tracking-[0.28em] text-ink-soft hover:text-foreground transition-colors duration-500"
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
                lang === l.code ? "text-gold" : "text-ink-soft/60 hover:text-foreground"
              }`}
              aria-label={l.label}
            >
              {l.native}
            </button>
          ))}
          <button
            onClick={toggle}
            className="ms-2 p-2 text-ink-soft hover:text-foreground transition-colors"
            aria-label={theme === "dark" ? t.theme.light : t.theme.dark}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden ms-2 text-[14px] uppercase tracking-[0.2em] text-foreground"
            aria-label="Menu"
          >
            {open ? "—" : "≡"}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden border-t border-border/50 bg-background px-6 py-6 flex flex-col gap-5">
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
