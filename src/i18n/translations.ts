export type Lang = "en" | "ar" | "fr" | "de";

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "ar", label: "Arabic", native: "ع" },
  { code: "fr", label: "French", native: "FR" },
  { code: "de", label: "German", native: "DE" },
];

export const isRTL = (l: Lang) => l === "ar";

type Dict = {
  nav: { works: string; about: string; commissions: string; shop: string; contact: string };
  hero: {
    eyebrow: string;
    tagline: string;
    sub: string;
    cta: string;
    ctaPortfolio: string;
    ctaCommission: string;
    plate: string;
  };
  about: { eyebrow: string; title: string; p1: string; p2: string; quote: string; signature: string };
  featured: { eyebrow: string; title: string; sub: string; viewAll: string };
  gallery: {
    eyebrow: string;
    title: string;
    sub: string;
    all: string;
    portraits: string;
    landscapes: string;
    abstract: string;
    drawings: string;
    conceptual: string;
    view: string;
  };
  detail: { medium: string; year: string; close: string; inquire: string; buy: string };
  commissions: {
    eyebrow: string;
    title: string;
    p: string;
    bullets: string[];
    cta: string;
  };
  shop: { eyebrow: string; title: string; sub: string; available: string; buy: string; empty: string };
  social: { eyebrow: string; title: string; sub: string; follow: string };
  contact: {
    eyebrow: string;
    title: string;
    sub: string;
    name: string;
    email: string;
    message: string;
    send: string;
    sent: string;
  };
  footer: { studio: string; rights: string };
  theme: { light: string; dark: string };
};

export const translations: Record<Lang, Dict> = {
  en: {
    nav: { works: "Works", about: "About", commissions: "Commissions", shop: "Shop", contact: "Contact" },
    hero: {
      eyebrow: "Salma Hani M — Fine Artist",
      tagline: "Capturing the soul through color and silence",
      sub: "Oil, charcoal and quiet meditations on the threshold between form and the eternal.",
      cta: "Enter the gallery",
      ctaPortfolio: "View portfolio",
      ctaCommission: "Commission artwork",
      plate: "Featured artwork — replace with real painting",
    },
    about: {
      eyebrow: "About the artist",
      title: "A practice of stillness.",
      p1: "Working between oil, charcoal and quiet conceptual studies, the practice moves slowly across portraiture, landscape and abstraction.",
      p2: "Each painting is approached as a meditation — a conversation between light, surface and silence — inviting the viewer to pause and to look closely.",
      quote: "Painting is a way of listening with the eyes.",
      signature: "— The Studio",
    },
    featured: {
      eyebrow: "Featured works",
      title: "Selected pieces.",
      sub: "A small chapter from the studio — recent paintings and studies.",
      viewAll: "View full archive",
    },
    gallery: {
      eyebrow: "The archive",
      title: "Gallery",
      sub: "Browse by chapter.",
      all: "All",
      portraits: "Portraits",
      landscapes: "Landscapes",
      abstract: "Abstract",
      drawings: "Drawings",
      conceptual: "Conceptual",
      view: "View",
    },
    detail: { medium: "Medium", year: "Year", close: "Close", inquire: "Inquire about this work", buy: "Buy this artwork" },
    commissions: {
      eyebrow: "Commissions",
      title: "A painting made for you.",
      p: "Private and corporate commissions are accepted on a limited basis. Each piece is composed in close dialogue with the collector — from initial sitting to final varnish.",
      bullets: [
        "Portraits in oil, from sitting or photograph",
        "Bespoke landscape and conceptual works",
        "International shipping with archival framing",
      ],
      cta: "Begin a commission",
    },
    shop: {
      eyebrow: "Available works",
      title: "The shop.",
      sub: "Original paintings ready to be acquired. International shipping with archival framing.",
      available: "Available",
      buy: "Acquire",
      empty: "New works will be listed here soon. For acquisition enquiries, please write to the studio.",
    },
    social: {
      eyebrow: "From the studio",
      title: "Follow the practice.",
      sub: "Process, fragments and quiet moments — shared on Instagram.",
      follow: "Follow @__morvii_",
    },
    contact: {
      eyebrow: "Contact",
      title: "Write to the studio.",
      sub: "For acquisitions, exhibitions and commissions.",
      name: "Name",
      email: "Email",
      message: "Message",
      send: "Send message",
      sent: "Thank you. The studio will reply soon.",
    },
    theme: { light: "Light", dark: "Dark" },
    footer: { studio: "Studio Salma Hani M", rights: "All rights reserved." },
  },
  ar: {
    nav: { works: "الأعمال", about: "عن الفنانة", commissions: "الطلبات الخاصة", shop: "المتجر", contact: "تواصل" },
    hero: {
      eyebrow: "سلمى هاني م — فنانة تشكيلية",
      tagline: "أُمسك بالرّوح عبر اللّون والصّمت",
      sub: "زيتٌ وفحمٌ وتأمّلاتٌ هادئة على عتبة ما بين الصورة والأبدي.",
      cta: "ادخل المعرض",
      ctaPortfolio: "اطّلع على الأعمال",
      ctaCommission: "اطلب لوحة خاصة",
      plate: "العمل المميَّز — يُستبدل بلوحةٍ حقيقية",
    },
    about: {
      eyebrow: "عن الفنانة",
      title: "ممارسةٌ من السكون.",
      p1: "ممارسةٌ تشتغل بين الزيت والفحم والدراسات المفاهيمية الهادئة، تتحرّك ببطء بين البورتريه والمناظر والتجريد.",
      p2: "كلّ لوحة تأمّل — حوارٌ بين الضوء والسطح والصمت — يُدعى فيه المُشاهد إلى التوقّف والنظر عن قُرب.",
      quote: "الرسم طريقةٌ للإصغاء بالعين.",
      signature: "— المرسم",
    },
    featured: {
      eyebrow: "أعمال مختارة",
      title: "قطعٌ منتقاة.",
      sub: "فصلٌ صغير من المرسم — لوحات ودراسات حديثة.",
      viewAll: "تصفّح الأرشيف الكامل",
    },
    gallery: {
      eyebrow: "الأرشيف",
      title: "المعرض",
      sub: "تصفّح حسب الفصل.",
      all: "الكل",
      portraits: "بورتريه",
      landscapes: "مناظر",
      abstract: "تجريد",
      drawings: "رسومات",
      conceptual: "مفاهيمي",
      view: "عرض",
    },
    detail: { medium: "الخامة", year: "السنة", close: "إغلاق", inquire: "استفسر عن هذا العمل", buy: "اقتناء هذا العمل" },
    commissions: {
      eyebrow: "طلبات خاصة",
      title: "لوحةٌ تُرسم لك.",
      p: "تُقبل الطلبات الخاصة والمؤسسية بعدد محدود. كل عمل يُؤلَّف بحوارٍ وثيق مع المقتني — من الجلسة الأولى إلى الورنيش الأخير.",
      bullets: [
        "بورتريهات زيتية، من جلسة أو صورة",
        "لوحات مناظر ومفاهيم على القياس",
        "شحن دولي بتأطير أرشيفي",
      ],
      cta: "ابدأ طلبًا خاصًا",
    },
    shop: {
      eyebrow: "أعمال متاحة",
      title: "المتجر.",
      sub: "لوحات أصلية جاهزة للاقتناء. شحن دولي بتأطير أرشيفي.",
      available: "متاحة",
      buy: "اقتناء",
      empty: "ستُدرج الأعمال الجديدة هنا قريبًا. للاستفسار عن الاقتناء، تواصل مع المرسم.",
    },
    social: {
      eyebrow: "من المرسم",
      title: "تابع الممارسة.",
      sub: "عمليات وشظايا ولحظات هادئة — تُشارك عبر إنستغرام.",
      follow: "تابع @__morvii_",
    },
    contact: {
      eyebrow: "تواصل",
      title: "اكتب إلى المرسم.",
      sub: "للاقتناء والمعارض والطلبات الخاصة.",
      name: "الاسم",
      email: "البريد الإلكتروني",
      message: "الرسالة",
      send: "إرسال",
      sent: "شكرًا لك. سيردّ المرسم قريبًا.",
    },
    theme: { light: "فاتح", dark: "داكن" },
    footer: { studio: "مرسم سلمى هاني م", rights: "جميع الحقوق محفوظة." },
  },
  fr: {
    nav: { works: "Œuvres", about: "À propos", commissions: "Commandes", shop: "Boutique", contact: "Contact" },
    hero: {
      eyebrow: "Salma Hani M — Artiste",
      tagline: "Saisir l'âme par la couleur et le silence",
      sub: "Huile, fusain et méditations silencieuses sur le seuil entre la forme et l'éternel.",
      cta: "Entrer dans la galerie",
      ctaPortfolio: "Voir le portfolio",
      ctaCommission: "Commander une œuvre",
      plate: "Œuvre en vedette — à remplacer par une peinture réelle",
    },
    about: {
      eyebrow: "À propos de l'artiste",
      title: "Une pratique du silence.",
      p1: "Une pratique qui se déploie entre l'huile, le fusain et de discrètes études conceptuelles, traversant lentement le portrait, le paysage et l'abstraction.",
      p2: "Chaque toile est abordée comme une méditation — un dialogue entre la lumière, la surface et le silence — invitant le regard à s'arrêter.",
      quote: "Peindre, c'est écouter avec les yeux.",
      signature: "— L'Atelier",
    },
    featured: {
      eyebrow: "Œuvres en vedette",
      title: "Pièces sélectionnées.",
      sub: "Un petit chapitre de l'atelier — peintures et études récentes.",
      viewAll: "Voir l'archive complète",
    },
    gallery: {
      eyebrow: "L'archive",
      title: "Galerie",
      sub: "Parcourir par chapitre.",
      all: "Tout",
      portraits: "Portraits",
      landscapes: "Paysages",
      abstract: "Abstrait",
      drawings: "Dessins",
      conceptual: "Conceptuel",
      view: "Voir",
    },
    detail: { medium: "Médium", year: "Année", close: "Fermer", inquire: "Demander des informations", buy: "Acquérir cette œuvre" },
    commissions: {
      eyebrow: "Commandes",
      title: "Une œuvre faite pour vous.",
      p: "Les commandes privées et institutionnelles sont acceptées en nombre limité. Chaque pièce est composée en dialogue étroit avec le collectionneur.",
      bullets: [
        "Portraits à l'huile, sur séance ou photographie",
        "Paysages et œuvres conceptuelles sur mesure",
        "Expédition internationale avec encadrement d'archive",
      ],
      cta: "Lancer une commande",
    },
    shop: {
      eyebrow: "Œuvres disponibles",
      title: "La boutique.",
      sub: "Peintures originales prêtes à être acquises. Expédition internationale avec encadrement d'archive.",
      available: "Disponible",
      buy: "Acquérir",
      empty: "De nouvelles œuvres seront bientôt présentées ici. Pour toute demande d'acquisition, écrivez à l'atelier.",
    },
    social: {
      eyebrow: "Depuis l'atelier",
      title: "Suivre la pratique.",
      sub: "Processus, fragments et moments tranquilles — sur Instagram.",
      follow: "Suivre @__morvii_",
    },
    contact: {
      eyebrow: "Contact",
      title: "Écrire à l'atelier.",
      sub: "Pour acquisitions, expositions et commandes.",
      name: "Nom",
      email: "Email",
      message: "Message",
      send: "Envoyer",
      sent: "Merci. L'atelier répondra bientôt.",
    },
    theme: { light: "Clair", dark: "Sombre" },
    footer: { studio: "Atelier Salma Hani M", rights: "Tous droits réservés." },
  },
  de: {
    nav: { works: "Werke", about: "Über", commissions: "Auftragsarbeiten", shop: "Shop", contact: "Kontakt" },
    hero: {
      eyebrow: "Salma Hani M — Künstlerin",
      tagline: "Die Seele in Farbe und Stille einfangen",
      sub: "Öl, Kohle und stille Meditationen an der Schwelle zwischen Form und Ewigem.",
      cta: "Galerie betreten",
      ctaPortfolio: "Portfolio ansehen",
      ctaCommission: "Werk in Auftrag geben",
      plate: "Hervorgehobenes Werk — durch echtes Gemälde ersetzen",
    },
    about: {
      eyebrow: "Über die Künstlerin",
      title: "Eine Praxis der Stille.",
      p1: "Eine Praxis zwischen Öl, Kohle und stillen konzeptuellen Studien — langsam wandernd zwischen Porträt, Landschaft und Abstraktion.",
      p2: "Jedes Bild ist als Meditation gedacht — ein Gespräch zwischen Licht, Oberfläche und Stille — und lädt zum genauen Hinsehen ein.",
      quote: "Malen heißt, mit den Augen zuzuhören.",
      signature: "— Das Atelier",
    },
    featured: {
      eyebrow: "Ausgewählte Werke",
      title: "Ausgewählte Arbeiten.",
      sub: "Ein kleines Kapitel aus dem Atelier — jüngste Gemälde und Studien.",
      viewAll: "Vollständiges Archiv ansehen",
    },
    gallery: {
      eyebrow: "Das Archiv",
      title: "Galerie",
      sub: "Nach Kapitel durchsuchen.",
      all: "Alle",
      portraits: "Porträts",
      landscapes: "Landschaften",
      abstract: "Abstrakt",
      drawings: "Zeichnungen",
      conceptual: "Konzeptuell",
      view: "Ansehen",
    },
    detail: { medium: "Medium", year: "Jahr", close: "Schließen", inquire: "Anfrage zu diesem Werk", buy: "Werk erwerben" },
    commissions: {
      eyebrow: "Auftragsarbeiten",
      title: "Ein Bild für Sie gemalt.",
      p: "Private und institutionelle Aufträge werden in begrenzter Zahl angenommen. Jedes Werk entsteht im engen Dialog mit dem Sammler.",
      bullets: [
        "Porträts in Öl, nach Sitzung oder Fotografie",
        "Maßgefertigte Landschaften und konzeptuelle Werke",
        "Internationaler Versand mit Archivrahmung",
      ],
      cta: "Auftrag beginnen",
    },
    shop: {
      eyebrow: "Verfügbare Werke",
      title: "Der Shop.",
      sub: "Originalgemälde bereit zur Akquisition. Internationaler Versand mit Archivrahmung.",
      available: "Verfügbar",
      buy: "Erwerben",
      empty: "Neue Werke werden hier bald gezeigt. Für Ankaufsanfragen schreiben Sie bitte an das Atelier.",
    },
    social: {
      eyebrow: "Aus dem Atelier",
      title: "Der Praxis folgen.",
      sub: "Prozess, Fragmente und stille Momente — auf Instagram.",
      follow: "Folge @__morvii_",
    },
    contact: {
      eyebrow: "Kontakt",
      title: "Ans Atelier schreiben.",
      sub: "Für Ankäufe, Ausstellungen und Aufträge.",
      name: "Name",
      email: "E-Mail",
      message: "Nachricht",
      send: "Nachricht senden",
      sent: "Vielen Dank. Das Atelier antwortet bald.",
    },
    theme: { light: "Hell", dark: "Dunkel" },
    footer: { studio: "Atelier Salma Hani M", rights: "Alle Rechte vorbehalten." },
  },
};
