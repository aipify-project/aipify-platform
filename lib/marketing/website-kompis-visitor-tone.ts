import type {
  WebsiteKompisFallbackTone,
  WebsiteKompisWelcomeMessageVariant,
} from "@/lib/marketing/website-kompis-install-config";
import type { WebsiteKompisEmbedLocale } from "@/lib/marketing/website-kompis-embed";
import { siteLabelFromDomain } from "@/lib/marketing/website-kompis-site-label";

export type WebsiteKompisVisitorAnswerShape = {
  directAnswer: string;
  explanation: string | null;
  steps: string[];
};

export type WebsiteKompisVisitorAnswerSource =
  | "current-page"
  | "faq"
  | "public-site-index"
  | "fallback";

export type WebsiteKompisEmbedQuickAction = {
  id: "get_started" | "find_info";
  label: string;
  draft: string;
};

export type WebsiteKompisEmbedUiLabels = {
  title: string;
  /** Short product name next to logo (Design V1). */
  productName: string;
  /** Short header subtitle — not the conversation greeting. */
  prompt: string;
  /** Shown once in an empty conversation. */
  greeting: string;
  /** Supporting line under greeting. */
  greetingSupport: string;
  placeholder: string;
  send: string;
  sending: string;
  unavailable: string;
  error: string;
  open: string;
  close: string;
  minimize: string;
  credit: string;
  sourceFromSite: string;
  quickActions: WebsiteKompisEmbedQuickAction[];
};

export function buildWebsiteKompisWarmSafeFallbackCopy(
  locale: string,
  siteLabel: string | null,
  fallbackTone: WebsiteKompisFallbackTone = "professional-friendly",
): string {
  const named = siteLabel?.trim() || null;

  if (fallbackTone === "short-direct") {
    switch (locale) {
      case "no":
        return named
          ? `Ikke nok publisert info om ${named} til å svare trygt. Kontakt ${named}.`
          : "Ikke nok publisert info til å svare trygt. Kontakt nettstedet.";
      case "sv":
        return named
          ? `Inte tillräcklig publicerad info om ${named}. Kontakta ${named}.`
          : "Inte tillräcklig publicerad info. Kontakta webbplatsen.";
      case "da":
        return named
          ? `Ikke nok offentliggjort info om ${named}. Kontakt ${named}.`
          : "Ikke nok offentliggjort info. Kontakt webstedet.";
      case "en":
      default:
        return named
          ? `Not enough published info about ${named} to answer safely. Contact ${named}.`
          : "Not enough published info to answer safely. Contact the website.";
    }
  }

  switch (locale) {
    case "no":
      return named
        ? `Jeg finner ikke nok publisert informasjon om ${named} til å svare trygt på det akkurat nå. Ta gjerne kontakt med ${named} — så hjelper de deg videre.`
        : "Jeg finner ikke nok publisert informasjon til å svare trygt på det akkurat nå. Ta gjerne kontakt med nettstedet — de hjelper deg videre.";
    case "sv":
      return named
        ? `Jag hittar inte tillräckligt publicerad information om ${named} för att svara säkert just nu. Kontakta gärna ${named} — de hjälper dig vidare.`
        : "Jag hittar inte tillräckligt publicerad information för att svara säkert just nu. Kontakta gärna webbplatsen — de hjälper dig vidare.";
    case "da":
      return named
        ? `Jeg finder ikke nok offentliggjort information om ${named} til at svare sikkert lige nu. Kontakt gerne ${named} — de hjælper dig videre.`
        : "Jeg finder ikke nok offentliggjort information til at svare sikkert lige nu. Kontakt gerne webstedet — de hjælper dig videre.";
    case "en":
    default:
      return named
        ? `I cannot find enough published information about ${named} to answer this safely right now. Please contact ${named} — they will help you move forward.`
        : "I cannot find enough published information to answer this safely right now. Please contact the website — they will help you move forward.";
  }
}

function currentPageIntro(locale: string, fallbackTone: WebsiteKompisFallbackTone): string | null {
  if (fallbackTone === "short-direct") {
    return null;
  }

  switch (locale) {
    case "no":
      return "Her er det jeg finner på denne siden:";
    case "sv":
      return "Här är det jag hittar på den här sidan:";
    case "da":
      return "Her er det, jeg finder på denne side:";
    case "en":
    default:
      return "Here is what I find on this page:";
  }
}

export function presentWebsiteKompisCustomerSiteAnswer(
  answer: WebsiteKompisVisitorAnswerShape,
  input: {
    locale: string;
    fallbackTone?: WebsiteKompisFallbackTone;
    source: WebsiteKompisVisitorAnswerSource;
    domain?: string | null;
  },
): WebsiteKompisVisitorAnswerShape {
  const fallbackTone = input.fallbackTone ?? "professional-friendly";

  if (input.source === "fallback") {
    const siteLabel = siteLabelFromDomain(input.domain ?? null);
    return {
      directAnswer: buildWebsiteKompisWarmSafeFallbackCopy(
        input.locale,
        siteLabel,
        fallbackTone,
      ),
      explanation: null,
      steps: [],
    };
  }

  if (input.source === "current-page") {
    const intro = currentPageIntro(input.locale, fallbackTone);
    const directAnswer = answer.directAnswer.trim();
    if (!intro || directAnswer.startsWith(intro)) {
      return answer;
    }
    return {
      ...answer,
      directAnswer: `${intro}\n\n${directAnswer}`,
    };
  }

  return answer;
}

const EMBED_UI_COPY: Record<
  WebsiteKompisEmbedLocale,
  Record<
    WebsiteKompisWelcomeMessageVariant,
    Pick<
      WebsiteKompisEmbedUiLabels,
      "prompt" | "greeting" | "greetingSupport" | "placeholder" | "quickActions"
    >
  >
> = {
  no: {
    standard: {
      prompt: "Svarer ut fra det som står på nettsiden",
      greeting: "Hei! Hva kan jeg hjelpe deg med?",
      greetingSupport: "Spør meg om det du lurer på.",
      placeholder: "Skriv en melding…",
      quickActions: [
        { id: "get_started", label: "Kom i gang", draft: "Hvordan kommer jeg i gang?" },
        {
          id: "find_info",
          label: "Finn informasjon",
          draft: "Hvor finner jeg mer informasjon?",
        },
      ],
    },
    compact: {
      prompt: "Om denne siden",
      greeting: "Hei! Hva kan jeg hjelpe deg med?",
      greetingSupport: "Spør meg om det du lurer på.",
      placeholder: "Skriv en melding…",
      quickActions: [
        { id: "get_started", label: "Kom i gang", draft: "Hvordan kommer jeg i gang?" },
        {
          id: "find_info",
          label: "Finn informasjon",
          draft: "Hvor finner jeg mer informasjon?",
        },
      ],
    },
  },
  en: {
    standard: {
      prompt: "Answers from what is published on this website",
      greeting: "Hi! How can I help you?",
      greetingSupport: "Ask me what you need to know.",
      placeholder: "Type a message…",
      quickActions: [
        { id: "get_started", label: "Get started", draft: "How do I get started?" },
        {
          id: "find_info",
          label: "Find information",
          draft: "Where can I find more information?",
        },
      ],
    },
    compact: {
      prompt: "About this page",
      greeting: "Hi! How can I help you?",
      greetingSupport: "Ask me what you need to know.",
      placeholder: "Type a message…",
      quickActions: [
        { id: "get_started", label: "Get started", draft: "How do I get started?" },
        {
          id: "find_info",
          label: "Find information",
          draft: "Where can I find more information?",
        },
      ],
    },
  },
  sv: {
    standard: {
      prompt: "Svarar utifrån det som står på webbplatsen",
      greeting: "Hej! Hur kan jag hjälpa dig?",
      greetingSupport: "Fråga mig om det du undrar över.",
      placeholder: "Skriv ett meddelande…",
      quickActions: [
        { id: "get_started", label: "Kom igång", draft: "Hur kommer jag igång?" },
        {
          id: "find_info",
          label: "Hitta information",
          draft: "Var hittar jag mer information?",
        },
      ],
    },
    compact: {
      prompt: "Om den här sidan",
      greeting: "Hej! Hur kan jag hjälpa dig?",
      greetingSupport: "Fråga mig om det du undrar över.",
      placeholder: "Skriv ett meddelande…",
      quickActions: [
        { id: "get_started", label: "Kom igång", draft: "Hur kommer jag igång?" },
        {
          id: "find_info",
          label: "Hitta information",
          draft: "Var hittar jag mer information?",
        },
      ],
    },
  },
  da: {
    standard: {
      prompt: "Svarer ud fra det, der står på hjemmesiden",
      greeting: "Hej! Hvordan kan jeg hjælpe dig?",
      greetingSupport: "Spørg mig om det, du undrer dig over.",
      placeholder: "Skriv en besked…",
      quickActions: [
        { id: "get_started", label: "Kom i gang", draft: "Hvordan kommer jeg i gang?" },
        {
          id: "find_info",
          label: "Find information",
          draft: "Hvor finder jeg mere information?",
        },
      ],
    },
    compact: {
      prompt: "Om denne side",
      greeting: "Hej! Hvordan kan jeg hjælpe dig?",
      greetingSupport: "Spørg mig om det, du undrer dig over.",
      placeholder: "Skriv en besked…",
      quickActions: [
        { id: "get_started", label: "Kom i gang", draft: "Hvordan kommer jeg i gang?" },
        {
          id: "find_info",
          label: "Find information",
          draft: "Hvor finder jeg mere information?",
        },
      ],
    },
  },
  pl: {
    standard: {
      prompt: "Odpowiada na podstawie treści opublikowanych na tej stronie",
      greeting: "Cześć! W czym mogę pomóc?",
      greetingSupport: "Zapytaj o to, czego potrzebujesz.",
      placeholder: "Napisz wiadomość…",
      quickActions: [
        { id: "get_started", label: "Zacznij", draft: "Jak zacząć?" },
        {
          id: "find_info",
          label: "Znajdź informacje",
          draft: "Gdzie znajdę więcej informacji?",
        },
      ],
    },
    compact: {
      prompt: "O tej stronie",
      greeting: "Cześć! W czym mogę pomóc?",
      greetingSupport: "Zapytaj o to, czego potrzebujesz.",
      placeholder: "Napisz wiadomość…",
      quickActions: [
        { id: "get_started", label: "Zacznij", draft: "Jak zacząć?" },
        {
          id: "find_info",
          label: "Znajdź informacje",
          draft: "Gdzie znajdę więcej informacji?",
        },
      ],
    },
  },
  uk: {
    standard: {
      prompt: "Відповідає на основі опублікованого на сайті",
      greeting: "Привіт! Чим можу допомогти?",
      greetingSupport: "Запитайте про те, що вас цікавить.",
      placeholder: "Напишіть повідомлення…",
      quickActions: [
        { id: "get_started", label: "Почати", draft: "Як почати?" },
        {
          id: "find_info",
          label: "Знайти інформацію",
          draft: "Де знайти більше інформації?",
        },
      ],
    },
    compact: {
      prompt: "Про цю сторінку",
      greeting: "Привіт! Чим можу допомогти?",
      greetingSupport: "Запитайте про те, що вас цікавить.",
      placeholder: "Напишіть повідомлення…",
      quickActions: [
        { id: "get_started", label: "Почати", draft: "Як почати?" },
        {
          id: "find_info",
          label: "Знайти інформацію",
          draft: "Де знайти більше інформації?",
        },
      ],
    },
  },
};

const EMBED_UI_SHELL: Record<
  WebsiteKompisEmbedLocale,
  Pick<
    WebsiteKompisEmbedUiLabels,
    | "title"
    | "productName"
    | "send"
    | "sending"
    | "unavailable"
    | "error"
    | "open"
    | "close"
    | "minimize"
    | "credit"
    | "sourceFromSite"
  >
> = {
  no: {
    title: "Website Kompis",
    productName: "Kompis",
    send: "Send",
    sending: "Sender…",
    unavailable: "Midlertidig utilgjengelig",
    error: "Noe gikk galt. Prøv igjen.",
    open: "Åpne Kompis",
    close: "Lukk chat",
    minimize: "Minimer chat",
    credit: "Drevet av Aipify",
    sourceFromSite: "Kilde fra nettstedet",
  },
  en: {
    title: "Website Kompis",
    productName: "Kompis",
    send: "Send",
    sending: "Sending…",
    unavailable: "Temporarily unavailable",
    error: "Something went wrong. Please try again.",
    open: "Open Kompis",
    close: "Close chat",
    minimize: "Minimize chat",
    credit: "Powered by Aipify",
    sourceFromSite: "Source from the website",
  },
  sv: {
    title: "Website Kompis",
    productName: "Kompis",
    send: "Skicka",
    sending: "Skickar…",
    unavailable: "Tillfälligt otillgänglig",
    error: "Något gick fel. Försök igen.",
    open: "Öppna Kompis",
    close: "Stäng chatten",
    minimize: "Minimera chatten",
    credit: "Drivs av Aipify",
    sourceFromSite: "Källa från webbplatsen",
  },
  da: {
    title: "Website Kompis",
    productName: "Kompis",
    send: "Send",
    sending: "Sender…",
    unavailable: "Midlertidigt utilgængelig",
    error: "Noget gik galt. Prøv igen.",
    open: "Åbn Kompis",
    close: "Luk chat",
    minimize: "Minimer chat",
    credit: "Drevet af Aipify",
    sourceFromSite: "Kilde fra hjemmesiden",
  },
  pl: {
    title: "Website Kompis",
    productName: "Kompis",
    send: "Wyślij",
    sending: "Wysyłanie…",
    unavailable: "Tymczasowo niedostępne",
    error: "Coś poszło nie tak. Spróbuj ponownie.",
    open: "Otwórz Kompis",
    close: "Zamknij czat",
    minimize: "Zminimalizuj czat",
    credit: "Napędzane przez Aipify",
    sourceFromSite: "Źródło ze strony",
  },
  uk: {
    title: "Website Kompis",
    productName: "Kompis",
    send: "Надіслати",
    sending: "Надсилання…",
    unavailable: "Тимчасово недоступно",
    error: "Щось пішло не так. Спробуйте ще раз.",
    open: "Відкрити Kompis",
    close: "Закрити чат",
    minimize: "Згорнути чат",
    credit: "Працює на Aipify",
    sourceFromSite: "Джерело з сайту",
  },
};

export const WEBSITE_KOMPIS_DESIGN_V1_ASSET_BASE = "/website-kompis/design-v1" as const;

export function resolveWebsiteKompisEmbedUiLabels(input: {
  locale: WebsiteKompisEmbedLocale;
  welcomeMessageVariant?: WebsiteKompisWelcomeMessageVariant | string | null;
}): WebsiteKompisEmbedUiLabels {
  const variant =
    input.welcomeMessageVariant === "compact" ? "compact" : ("standard" as const);
  const shell = EMBED_UI_SHELL[input.locale] ?? EMBED_UI_SHELL.no;
  const welcome = EMBED_UI_COPY[input.locale]?.[variant] ?? EMBED_UI_COPY.no[variant];

  return {
    ...shell,
    prompt: welcome.prompt,
    greeting: welcome.greeting,
    greetingSupport: welcome.greetingSupport,
    placeholder: welcome.placeholder,
    quickActions: welcome.quickActions,
  };
}
