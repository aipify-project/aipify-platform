import type {
  WebsiteKompisFallbackTone,
  WebsiteKompisWelcomeMessageVariant,
} from "@/lib/marketing/website-kompis-install-config";
import type { WebsiteKompisEmbedLocale } from "@/lib/marketing/website-kompis-embed";

export type WebsiteKompisVisitorAnswerShape = {
  directAnswer: string;
  explanation: string | null;
  steps: string[];
};

export type WebsiteKompisVisitorAnswerSource = "current-page" | "faq" | "fallback";

export type WebsiteKompisEmbedUiLabels = {
  title: string;
  prompt: string;
  placeholder: string;
  send: string;
  sending: string;
  unavailable: string;
  error: string;
  open: string;
  close: string;
};

function siteLabelFromDomain(domain: string | null | undefined): string | null {
  if (!domain) return null;
  const label = domain.split(".")[0]?.trim();
  if (!label) return null;
  return label.charAt(0).toUpperCase() + label.slice(1);
}

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
          : "Ikke nok publisert info til å svare trygt. Kontakt virksomheten.";
      case "sv":
        return named
          ? `Inte tillräcklig publicerad info om ${named}. Kontakta ${named}.`
          : "Inte tillräcklig publicerad info. Kontakta verksomheten.";
      case "da":
        return named
          ? `Ikke nok offentliggjort info om ${named}. Kontakt ${named}.`
          : "Ikke nok offentliggjort info. Kontakt virksomheden.";
      case "en":
      default:
        return named
          ? `Not enough published info about ${named} to answer safely. Contact ${named}.`
          : "Not enough published info to answer safely. Contact the business.";
    }
  }

  switch (locale) {
    case "no":
      return named
        ? `Jeg finner ikke nok publisert informasjon om ${named} til å svare trygt på det akkurat nå. Ta gjerne kontakt med ${named} — så hjelper de deg videre.`
        : "Jeg finner ikke nok publisert informasjon til å svare trygt på det akkurat nå. Ta gjerne kontakt med virksomheten — de hjelper deg videre.";
    case "sv":
      return named
        ? `Jag hittar inte tillräckligt publicerad information om ${named} för att svara säkert just nu. Kontakta gärna ${named} — de hjälper dig vidare.`
        : "Jag hittar inte tillräckligt publicerad information för att svara säkert just nu. Kontakta gärna verksamheten — de hjälper dig vidare.";
    case "da":
      return named
        ? `Jeg finder ikke nok offentliggjort information om ${named} til at svare sikkert lige nu. Kontakt gerne ${named} — de hjælper dig videre.`
        : "Jeg finder ikke nok offentliggjort information til at svare sikkert lige nu. Kontakt gerne virksomheden — de hjælper dig videre.";
    case "en":
    default:
      return named
        ? `I cannot find enough published information about ${named} to answer this safely right now. Please contact ${named} — they will help you move forward.`
        : "I cannot find enough published information to answer this safely right now. Please contact the business — they will help you move forward.";
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
    Pick<WebsiteKompisEmbedUiLabels, "prompt" | "placeholder">
  >
> = {
  no: {
    standard: {
      prompt: "Spør meg om det du lurer på — jeg svarer ut fra det som står på nettsiden.",
      placeholder: "Hva lurer du på?",
    },
    compact: {
      prompt: "Spør om denne siden",
      placeholder: "Skriv et spørsmål …",
    },
  },
  en: {
    standard: {
      prompt: "Ask what you need — I answer from what is published on this website.",
      placeholder: "What would you like to know?",
    },
    compact: {
      prompt: "Ask about this page",
      placeholder: "Type a question …",
    },
  },
  sv: {
    standard: {
      prompt: "Fråga om det du undrar — jag svarar utifrån det som står på webbplatsen.",
      placeholder: "Vad undrar du över?",
    },
    compact: {
      prompt: "Fråga om den här sidan",
      placeholder: "Skriv en fråga …",
    },
  },
  da: {
    standard: {
      prompt: "Spørg om det, du undrer dig over — jeg svarer ud fra det, der står på hjemmesiden.",
      placeholder: "Hvad vil du vide?",
    },
    compact: {
      prompt: "Spørg om denne side",
      placeholder: "Skriv et spørgsmål …",
    },
  },
  pl: {
    standard: {
      prompt: "Zapytaj o to, czego potrzebujesz — odpowiadam na podstawie treści opublikowanych na tej stronie.",
      placeholder: "O czym chcesz zapytać?",
    },
    compact: {
      prompt: "Zapytaj o tę stronę",
      placeholder: "Wpisz pytanie …",
    },
  },
  uk: {
    standard: {
      prompt: "Запитайте про те, що вас цікавить — я відповідаю на основі опублікованого на сайті.",
      placeholder: "Що вас цікавить?",
    },
    compact: {
      prompt: "Запитайте про цю сторінку",
      placeholder: "Введіть питання …",
    },
  },
};

const EMBED_UI_SHELL: Record<
  WebsiteKompisEmbedLocale,
  Pick<WebsiteKompisEmbedUiLabels, "title" | "send" | "sending" | "unavailable" | "error" | "open" | "close">
> = {
  no: {
    title: "Website Kompis",
    send: "Send",
    sending: "Sender …",
    unavailable: "Midlertidig utilgjengelig",
    error: "Noe gikk galt. Prøv igjen.",
    open: "Åpne Website Kompis",
    close: "Lukk Website Kompis",
  },
  en: {
    title: "Website Kompis",
    send: "Send",
    sending: "Sending …",
    unavailable: "Temporarily unavailable",
    error: "Something went wrong. Please try again.",
    open: "Open Website Kompis",
    close: "Close Website Kompis",
  },
  sv: {
    title: "Website Kompis",
    send: "Skicka",
    sending: "Skickar …",
    unavailable: "Tillfälligt otillgänglig",
    error: "Något gick fel. Försök igen.",
    open: "Öppna Website Kompis",
    close: "Stäng Website Kompis",
  },
  da: {
    title: "Website Kompis",
    send: "Send",
    sending: "Sender …",
    unavailable: "Midlertidigt utilgængelig",
    error: "Noget gik galt. Prøv igen.",
    open: "Åbn Website Kompis",
    close: "Luk Website Kompis",
  },
  pl: {
    title: "Website Kompis",
    send: "Wyślij",
    sending: "Wysyłanie …",
    unavailable: "Tymczasowo niedostępne",
    error: "Coś poszło nie tak. Spróbuj ponownie.",
    open: "Otwórz Website Kompis",
    close: "Zamknij Website Kompis",
  },
  uk: {
    title: "Website Kompis",
    send: "Надіслати",
    sending: "Надсилання …",
    unavailable: "Тимчасово недоступно",
    error: "Щось пішло не так. Спробуйте ще раз.",
    open: "Відкрити Website Kompis",
    close: "Закрити Website Kompis",
  },
};

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
    placeholder: welcome.placeholder,
  };
}
