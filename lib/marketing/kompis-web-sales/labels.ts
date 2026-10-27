import type { MarketingDictionary } from "@/lib/marketing/get-marketing-context";
import { getSection } from "@/lib/marketing/parse-marketing";
import { getKompisWebSalesPlanTruth } from "./plans-from-catalog";

export type KompisWebSalesLabels = {
  meta: { title: string; description: string };
  nav: {
    product: string;
    how: string;
    pricing: string;
    faq: string;
    login: string;
    startFree: string;
    language: string;
    languageMenu: string;
    languageSwitchFailed: string;
  };
  hero: {
    eyebrow: string;
    titleBefore: string;
    titleHighlight: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    trustNoCard: string;
    trustSetup: string;
    trustFreeQuota: string;
    mascotAlt: string;
  };
  signupCard: {
    title: string;
    emailLabel: string;
    emailPlaceholder: string;
    websiteLabel: string;
    websitePlaceholder: string;
    companyLabel: string;
    companyPlaceholder: string;
    languageLabel: string;
    submit: string;
    continueHint: string;
  };
  benefits: {
    title: string;
    items: Array<{ title: string; body: string }>;
  };
  how: {
    title: string;
    intro: string;
    steps: Array<{ title: string; body: string }>;
  };
  demo: {
    title: string;
    subtitle: string;
    illustrationBadge: string;
    widgetTitle: string;
    widgetStatus: string;
    widgetVisitor: string;
    widgetReply: string;
    controlTitle: string;
    controlBody: string;
    controlItems: string[];
  };
  pricing: {
    title: string;
    subtitle: string;
    asideTitle: string;
    asideBody: string;
    plannedNote: string;
    free: {
      badge: string;
      name: string;
      quota: string;
      quotaFigure: string;
      quotaUnit: string;
      noCardPill: string;
      price: string;
      features: string[];
      cta: string;
    };
    paid: {
      name: string;
      tagline: string;
      quota: string;
      quotaFigure: string;
      quotaUnit: string;
      priceMonthly: string;
      priceAnnual: string;
      priceNote: string;
      features: string[];
      cta: string;
      checkoutUnavailable: string;
    };
  };
  faq: {
    title: string;
    items: Array<{ question: string; answer: string }>;
  };
  finalCta: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  footer: {
    product: string;
    how: string;
    pricing: string;
    faq: string;
    privacy: string;
    terms: string;
    contact: string;
    home: string;
    tagline: string;
  };
  hrefs: {
    register: "/register";
    bookDemo: "/book-demo";
    login: "/login";
    privacy: "/privacy";
    terms: "/terms";
    contact: "/contact";
    home: "/";
    aipify: "https://aipify.ai";
  };
};

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asStringList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asPairs(
  value: unknown,
): Array<{ title: string; body: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const title = asString(row.title);
      const body = asString(row.body);
      if (!title || !body) return null;
      return { title, body };
    })
    .filter((row): row is { title: string; body: string } => Boolean(row));
}

function asFaq(value: unknown): Array<{ question: string; answer: string }> {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const question = asString(row.question);
      const answer = asString(row.answer);
      if (!question || !answer) return null;
      return { question, answer };
    })
    .filter((row): row is { question: string; answer: string } => Boolean(row));
}

export function parseKompisWebSalesLabels(marketing: MarketingDictionary): KompisWebSalesLabels {
  const truth = getKompisWebSalesPlanTruth();
  const raw = getSection<Record<string, unknown>>(marketing, "kompisWebSales");
  const nav = (raw.nav ?? {}) as Record<string, unknown>;
  const hero = (raw.hero ?? {}) as Record<string, unknown>;
  const signupCard = (raw.signupCard ?? {}) as Record<string, unknown>;
  const benefits = (raw.benefits ?? {}) as Record<string, unknown>;
  const how = (raw.how ?? {}) as Record<string, unknown>;
  const demo = (raw.demo ?? {}) as Record<string, unknown>;
  const pricing = (raw.pricing ?? {}) as Record<string, unknown>;
  const free = (pricing.free ?? {}) as Record<string, unknown>;
  const paid = (pricing.paid ?? {}) as Record<string, unknown>;
  const faq = (raw.faq ?? {}) as Record<string, unknown>;
  const finalCta = (raw.finalCta ?? {}) as Record<string, unknown>;
  const footer = (raw.footer ?? {}) as Record<string, unknown>;
  const meta = (raw.meta ?? {}) as Record<string, unknown>;

  const benefitItems = asPairs(benefits.items);
  const howSteps = asPairs(how.steps);
  const faqItems = asFaq(faq.items);

  if (benefitItems.length !== 5) {
    throw new Error(`kompisWebSales.benefits.items must be exactly 5 (got ${benefitItems.length})`);
  }
  if (howSteps.length !== 4) {
    throw new Error(`kompisWebSales.how.steps must be exactly 4 (got ${howSteps.length})`);
  }
  if (faqItems.length < 5) {
    throw new Error(`kompisWebSales.faq.items must include at least 5 entries`);
  }

  return {
    meta: {
      title: asString(meta.title, "Aipify — AI helper for website visitors | Kompis Web"),
      description: asString(
        meta.description,
        "Kompis Web answers visitor questions from approved content on your website. Start with 150 free answers — no credit card. Part of Aipify.",
      ),
    },
    nav: {
      product: asString(nav.product, "Product"),
      how: asString(nav.how, "How it works"),
      pricing: asString(nav.pricing, "Pricing"),
      faq: asString(nav.faq, "FAQ"),
      login: asString(nav.login, "Login"),
      startFree: asString(nav.startFree, "Start free"),
      language: asString(nav.language, "Language"),
      languageMenu: asString(nav.languageMenu, "Choose language"),
      languageSwitchFailed: asString(nav.languageSwitchFailed, "Language switch failed. Please try again."),
    },
    hero: {
      eyebrow: asString(hero.eyebrow, "Aipify Kompis Web"),
      titleBefore: asString(hero.titleBefore, "Aipify — the AI helper for your"),
      titleHighlight: asString(hero.titleHighlight, "website visitors"),
      subtitle: asString(
        hero.subtitle,
        "Kompis Web answers questions, guides visitors, and makes approved content on your website easier to find.",
      ),
      primaryCta: asString(hero.primaryCta, "Start free"),
      secondaryCta: asString(hero.secondaryCta, "Book demo"),
      trustNoCard: asString(hero.trustNoCard, "No credit card required"),
      trustSetup: asString(hero.trustSetup, "Connect your website when you are ready"),
      trustFreeQuota: asString(
        hero.trustFreeQuota,
        `${truth.freeAnswerQuota} free answers`,
      ).replace("{quota}", String(truth.freeAnswerQuota)),
      mascotAlt: asString(hero.mascotAlt, "Aipify Buddy mascot"),
    },
    signupCard: {
      title: asString(signupCard.title, "Create your free account"),
      emailLabel: asString(signupCard.emailLabel, "Work email"),
      emailPlaceholder: asString(signupCard.emailPlaceholder, "you@company.com"),
      websiteLabel: asString(signupCard.websiteLabel, "Website URL"),
      websitePlaceholder: asString(signupCard.websitePlaceholder, "https://"),
      companyLabel: asString(signupCard.companyLabel, "Company name"),
      companyPlaceholder: asString(signupCard.companyPlaceholder, "Your company"),
      languageLabel: asString(signupCard.languageLabel, "Language"),
      submit: asString(signupCard.submit, "Create free account"),
      continueHint: asString(
        signupCard.continueHint,
        "Continues to the real Aipify registration. No card is required for the free answer allowance.",
      ),
    },
    benefits: {
      title: asString(benefits.title, "Why website owners choose Kompis Web"),
      items: benefitItems,
    },
    how: {
      title: asString(how.title, "From your content to helpful conversations"),
      intro: asString(
        how.intro,
        "Connect your site, let visitors ask, stay in control, and reduce repetitive support — in four clear steps.",
      ),
      steps: howSteps,
    },
    demo: {
      title: asString(demo.title, "See Kompis Web in context"),
      subtitle: asString(demo.subtitle),
      illustrationBadge: asString(
        demo.illustrationBadge,
        "Illustration — not a live Production ask",
      ),
      widgetTitle: asString(demo.widgetTitle, "The helper on your website"),
      widgetStatus: asString(demo.widgetStatus, "Online"),
      widgetVisitor: asString(demo.widgetVisitor),
      widgetReply: asString(demo.widgetReply),
      controlTitle: asString(demo.controlTitle, "Your control center"),
      controlBody: asString(demo.controlBody),
      controlItems: asStringList(demo.controlItems),
    },
    pricing: {
      title: asString(pricing.title, "Start free. Upgrade when you need more answers."),
      subtitle: asString(pricing.subtitle),
      asideTitle: asString(pricing.asideTitle, "Simple packages for website owners"),
      asideBody: asString(
        pricing.asideBody,
        "Begin with a free lifetime answer allowance. Move to Standard when your site needs monthly capacity — checkout goes live in a later billing gate.",
      ),
      plannedNote: asString(
        pricing.plannedNote,
        "Packages below follow the owner-decided Kompis Web catalog. Live checkout is not enabled yet — start free registration or book a demo.",
      ),
      free: {
        badge: asString(free.badge, "Best place to start"),
        name: asString(free.name, "Free"),
        quota: asString(free.quota, `${truth.freeAnswerQuota} answers total`).replace(
          "{quota}",
          String(truth.freeAnswerQuota),
        ),
        quotaFigure: asString(free.quotaFigure, String(truth.freeAnswerQuota)),
        quotaUnit: asString(free.quotaUnit, "free answers · lifetime per website"),
        noCardPill: asString(free.noCardPill, "No credit card required"),
        price: asString(free.price, "No card · lifetime total per website license"),
        features: asStringList(free.features),
        cta: asString(free.cta, "Start free"),
      },
      paid: {
        name: asString(paid.name, "Standard"),
        tagline: asString(paid.tagline, "For growing websites"),
        quota: asString(paid.quota, `${truth.paidAnswerQuota} answers per month`).replace(
          "{quota}",
          String(truth.paidAnswerQuota),
        ),
        quotaFigure: asString(
          paid.quotaFigure,
          String(truth.paidAnswerQuota).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        ),
        quotaUnit: asString(paid.quotaUnit, "answers per month"),
        priceMonthly: asString(
          paid.priceMonthly,
          `NOK ${truth.paidMonthlyDisplay} / month`,
        )
          .replace("{amount}", truth.paidMonthlyDisplay)
          .replace("{currency}", truth.paidCurrency),
        priceAnnual: asString(
          paid.priceAnnual,
          `NOK ${truth.paidAnnualDisplay} / year`,
        )
          .replace("{amount}", truth.paidAnnualDisplay)
          .replace("{currency}", truth.paidCurrency),
        priceNote: asString(paid.priceNote, "Listed planned price · checkout not live yet"),
        features: asStringList(paid.features),
        cta: asString(paid.cta, "Book demo"),
        checkoutUnavailable: asString(
          paid.checkoutUnavailable,
          "Paid checkout is not live yet. Register or book a demo to continue.",
        ),
      },
    },
    faq: {
      title: asString(faq.title, "Questions website owners ask"),
      items: faqItems,
    },
    finalCta: {
      title: asString(finalCta.title, "Give your website a helpful Aipify colleague"),
      subtitle: asString(finalCta.subtitle),
      primary: asString(finalCta.primary, "Start free"),
      secondary: asString(finalCta.secondary, "Book demo"),
    },
    footer: {
      product: asString(footer.product, "Product"),
      how: asString(footer.how, "How it works"),
      pricing: asString(footer.pricing, "Pricing"),
      faq: asString(footer.faq, "FAQ"),
      privacy: asString(footer.privacy, "Privacy"),
      terms: asString(footer.terms, "Terms"),
      contact: asString(footer.contact, "Contact"),
      home: asString(footer.home, "Aipify home"),
      tagline: asString(footer.tagline, "Aipify works for you · Kompis Web"),
    },
    hrefs: {
      register: "/register",
      bookDemo: "/book-demo",
      login: "/login",
      privacy: "/privacy",
      terms: "/terms",
      contact: "/contact",
      home: "/",
      aipify: "https://aipify.ai",
    },
  };
}
