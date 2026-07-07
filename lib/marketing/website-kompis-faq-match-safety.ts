import type { PublicCompanionTenantFaqRow } from "@/lib/marketing/public-companion-tenant-faq";

export const WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE = "website-kompis-safety-policy" as const;

type WebsiteKompisFaqMatchSafetyLocale = "en" | "no" | "sv" | "da" | "pl" | "uk" | "es";

type SafetyModifierGroup = {
  userPatterns: RegExp[];
  faqCoveragePatterns: RegExp[];
};

const CONTENT_SHARING_ACTION_PATTERN =
  /\b(laste\s+opp|upload(?:ing)?|sende|send(?:e|er|ing)?|dele|share(?:ing)?|selge|sell(?:ing)?|publisere|publish(?:ing)?|poste|post(?:ing)?)\b/i;

const INTIMATE_OR_PRIVATE_MEDIA_PATTERN =
  /\b(naken\w*|nude|intim\w*|sexual|erotic|nsfw|private\s+(?:photos?|images?|pictures?|bilder?)|privat\w*\s+bilder?|bilder?|images?|photos?|video(?:er)?|content|innhold)\b/i;

const SAFETY_MODIFIER_GROUPS: SafetyModifierGroup[] = [
  {
    userPatterns: [
      /\bnakenbilder?\s+av\s+andre\b/i,
      /\bbilder?\s+av\s+andre\b/i,
      /\bbilder?\s+av\s+noen\b/i,
      /\bandre\s+person\w*\b/i,
      /\bandres\s+bilder?\b/i,
      /\bandres\b/i,
      /\bother\s+peoples?\b/i,
      /\bimages?\s+of\s+other\b/i,
      /\bof\s+someone\s+else\b/i,
    ],
    faqCoveragePatterns: [
      /\bnakenbilder?\s+av\s+andre\b/i,
      /\bbilder?\s+av\s+andre\b/i,
      /\bandre\s+person\w*\b/i,
      /\bandres\b/i,
      /\bother\s+peoples?\b/i,
      /\bsamtykke\b/i,
      /\bconsent\b/i,
      /\brettighe\w*\b/i,
      /\brights\b/i,
      /\buten\s+samtykke\b/i,
      /\bwithout\s+consent\b/i,
    ],
  },
  {
    userPatterns: [
      /\buten\s+samtykke\b/i,
      /\bwithout\s+consent\b/i,
      /\bnon[-\s]?consensual\b/i,
      /\bsamtykke\b/i,
      /\bconsent\b/i,
    ],
    faqCoveragePatterns: [
      /\buten\s+samtykke\b/i,
      /\bwithout\s+consent\b/i,
      /\bsamtykke\b/i,
      /\bconsent\b/i,
      /\brettighe\w*\b/i,
      /\brights\b/i,
    ],
  },
  {
    userPatterns: [/\bnoen\b/i, /\bsomeone\s+else\b/i, /\banother\s+person\b/i],
    faqCoveragePatterns: [
      /\bnoen\b/i,
      /\bsomeone\s+else\b/i,
      /\banother\s+person\b/i,
      /\bsamtykke\b/i,
      /\bconsent\b/i,
      /\brettighe\w*\b/i,
      /\brights\b/i,
    ],
  },
  {
    userPatterns: [
      /\bpersoner\b/i,
      /\bpeople\b/i,
      /\bperson\b/i,
    ],
    faqCoveragePatterns: [
      /\bpersoner\b/i,
      /\bpeople\b/i,
      /\bsamtykke\b/i,
      /\bconsent\b/i,
      /\brettighe\w*\b/i,
      /\brights\b/i,
    ],
  },
  {
    userPatterns: [
      /\bmindreårig\w*\b/i,
      /\bunder\s*18\b/i,
      /\bminor\w*\b/i,
      /\bchild(?:ren)?\b/i,
      /\bbarn\b/i,
    ],
    faqCoveragePatterns: [
      /\bmindreårig\w*\b/i,
      /\bminor\w*\b/i,
      /\bchild(?:ren)?\b/i,
      /\bbarn\b/i,
      /\bunder\s*18\b/i,
    ],
  },
  {
    userPatterns: [/\bulovlig\w*\b/i, /\billegal\b/i, /\bunlawful\b/i],
    faqCoveragePatterns: [/\bulovlig\w*\b/i, /\billegal\b/i, /\bunlawful\b/i, /\bnot\s+allowed\b/i],
  },
  {
    userPatterns: [
      /\bstjålet\b/i,
      /\bstolen\b/i,
      /\blekket\b/i,
      /\bleaked\b/i,
      /\brevenge\s+porn\b/i,
    ],
    faqCoveragePatterns: [
      /\bstjålet\b/i,
      /\bstolen\b/i,
      /\blekket\b/i,
      /\bleaked\b/i,
      /\brevenge\s+porn\b/i,
      /\bnot\s+allowed\b/i,
    ],
  },
  {
    userPatterns: [
      /\bprivat\w*\s+bilder?\b/i,
      /\bprivate\s+(?:photos?|images?|pictures?)\b/i,
      /\bprivat\s+chat\b/i,
      /\bprivate\s+chat\b/i,
    ],
    faqCoveragePatterns: [
      /\bprivat\w*\b/i,
      /\bprivate\b/i,
      /\bsamtykke\b/i,
      /\bconsent\b/i,
      /\brettighe\w*\b/i,
      /\brights\b/i,
    ],
  },
  {
    userPatterns: [/\brettighe\w*\b/i, /\brights\b/i],
    faqCoveragePatterns: [/\brettighe\w*\b/i, /\brights\b/i, /\bsamtykke\b/i, /\bconsent\b/i],
  },
];

const INTIMATE_UPLOAD_TOPIC_PATTERN =
  /\b(laste\s+opp|upload(?:ing)?|naken\w*|nude|intim\w*|sexual|erotic|nsfw)\b/i;

const OWN_CONTENT_PATTERN = /\b(egne|mine\s+egne|mitt\s+eget|my\s+own|of\s+myself|self[-\s]?taken)\b/i;

const AFFIRMATIVE_FAQ_ANSWER_PATTERN = /^\s*(ja|yes)\b/i;

const EXPLICIT_REFUSAL_FAQ_ANSWER_PATTERN = /^\s*(nei|no|not allowed|ikke\s+tillatt|ikke\s+lov)\b/i;

const CONSENT_OR_RIGHTS_FAQ_ANSWER_PATTERN =
  /\b(samtykke|consent|rettighe\w*|rights|identifiserbar\w*|identifiable)\b/i;

function normalizeVisitorQuestion(question: string): string {
  return question
    .trim()
    .toLowerCase()
    .replace(/[?!.]+$/, "")
    .replace(/\s+/g, " ");
}

function faqCorpus(row: Pick<PublicCompanionTenantFaqRow, "title" | "answer">): string {
  return `${row.title}\n${row.answer}`;
}

function groupMatches(text: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

function hasThirdPartySafetyModifier(normalizedQuestion: string): boolean {
  for (const group of SAFETY_MODIFIER_GROUPS) {
    if (groupMatches(normalizedQuestion, group.userPatterns)) {
      return true;
    }
  }

  return /\b(bilder?\s+av\s+noen|images?\s+of\s+(?:other\s+)?people|andre\s+person\w*|other\s+peoples?)\b/i.test(
    normalizedQuestion,
  );
}

function hasSafetySensitiveSharingIntent(normalizedQuestion: string): boolean {
  return (
    CONTENT_SHARING_ACTION_PATTERN.test(normalizedQuestion) &&
    INTIMATE_OR_PRIVATE_MEDIA_PATTERN.test(normalizedQuestion)
  );
}

export function isWebsiteKompisMandatorySafetyRefusalQuestion(question: string): boolean {
  const normalized = normalizeVisitorQuestion(question);
  if (!normalized) {
    return false;
  }

  if (OWN_CONTENT_PATTERN.test(normalized)) {
    return false;
  }

  if (!hasThirdPartySafetyModifier(normalized)) {
    return false;
  }

  return (
    INTIMATE_UPLOAD_TOPIC_PATTERN.test(normalized) ||
    hasSafetySensitiveSharingIntent(normalized) ||
    /\buten\s+samtykke\b/i.test(normalized) ||
    /\bwithout\s+consent\b/i.test(normalized)
  );
}

function isUnsafeAffirmativeFaqForMandatorySafetyQuestion(
  userQuestion: string,
  faqRow: Pick<PublicCompanionTenantFaqRow, "title" | "answer">,
): boolean {
  if (!isWebsiteKompisMandatorySafetyRefusalQuestion(userQuestion)) {
    return false;
  }

  const answer = faqRow.answer.trim();
  if (!answer) {
    return true;
  }

  if (EXPLICIT_REFUSAL_FAQ_ANSWER_PATTERN.test(answer)) {
    return false;
  }

  if (
    AFFIRMATIVE_FAQ_ANSWER_PATTERN.test(answer) &&
    !CONSENT_OR_RIGHTS_FAQ_ANSWER_PATTERN.test(answer)
  ) {
    return true;
  }

  return false;
}

export function shouldRejectWebsiteKompisFaqMatch(
  userQuestion: string,
  faqRow: Pick<PublicCompanionTenantFaqRow, "title" | "answer">,
): boolean {
  const normalizedQuestion = normalizeVisitorQuestion(userQuestion);
  if (!normalizedQuestion) {
    return true;
  }

  if (isUnsafeAffirmativeFaqForMandatorySafetyQuestion(userQuestion, faqRow)) {
    return true;
  }

  const corpus = faqCorpus(faqRow);

  for (const group of SAFETY_MODIFIER_GROUPS) {
    if (!groupMatches(normalizedQuestion, group.userPatterns)) {
      continue;
    }
    if (!groupMatches(corpus, group.faqCoveragePatterns)) {
      return true;
    }
    if (
      AFFIRMATIVE_FAQ_ANSWER_PATTERN.test(faqRow.answer.trim()) &&
      !CONSENT_OR_RIGHTS_FAQ_ANSWER_PATTERN.test(corpus)
    ) {
      return true;
    }
  }

  if (
    INTIMATE_UPLOAD_TOPIC_PATTERN.test(normalizedQuestion) &&
    /\b(bilder?\s+av\s+noen|andre\s+person\w*|other\s+peoples?|without\s+consent|uten\s+samtykke)\b/i.test(
      normalizedQuestion,
    ) &&
    !/\b(samtykke|consent|rettighe\w*|rights|andre\s+person\w*|other\s+peoples?)\b/i.test(corpus)
  ) {
    return true;
  }

  if (OWN_CONTENT_PATTERN.test(normalizedQuestion)) {
    if (!OWN_CONTENT_PATTERN.test(corpus) && !/\b(egne|own)\b/i.test(faqRow.title)) {
      return true;
    }
    return false;
  }

  if (
    AFFIRMATIVE_FAQ_ANSWER_PATTERN.test(faqRow.answer) &&
    INTIMATE_UPLOAD_TOPIC_PATTERN.test(normalizedQuestion) &&
    !OWN_CONTENT_PATTERN.test(normalizedQuestion) &&
    !/\b(samtykke|consent|rettighe\w*|rights|andre\s+person\w*|other\s+peoples?)\b/i.test(corpus)
  ) {
    return true;
  }

  return false;
}

export function filterWebsiteKompisSafeFaqRows(
  userQuestion: string,
  rows: PublicCompanionTenantFaqRow[],
): PublicCompanionTenantFaqRow[] {
  return rows.filter((row) => !shouldRejectWebsiteKompisFaqMatch(userQuestion, row));
}

export function buildWebsiteKompisSafetyPolicyRefusalCopy(locale: string): {
  directAnswer: string;
  explanation: string;
} {
  switch (locale) {
    case "no":
      return {
        directAnswer:
          "Nei. Du kan ikke laste opp, sende eller dele nakenbilder, intime bilder eller private bilder av andre personer uten deres uttrykkelige samtykke og nødvendige rettigheter.",
        explanation:
          "Du kan bare dele innhold du eier eller har eksplisitt tillatelse til å dele. Identifiserbare personer må ha gitt samtykke, og innhold som bryter personvern, samtykke eller lov er ikke tillatt.",
      };
    case "sv":
      return {
        directAnswer:
          "Nej. Du får inte ladda upp, skicka eller dela nakenbilder, intima bilder eller privata bilder av andra personer utan deras uttryckliga samtycke och nödvändiga rättigheter.",
        explanation:
          "Du får bara dela innehåll du äger eller har uttryckligt tillstånd att dela. Identifierbara personer måste ha gett samtycke, och innehåll som bryter mot integritet, samtycke eller lag är inte tillåtet.",
      };
    case "da":
      return {
        directAnswer:
          "Nej. Du må ikke uploade, sende eller dele nøgenbilleder, intime billeder eller private billeder af andre personer uden deres udtrykkelige samtykke og nødvendige rettigheder.",
        explanation:
          "Du må kun dele indhold, du ejer, eller har udtrykkelig tilladelse til at dele. Identificerbare personer skal have givet samtykke, og indhold der bryder privatliv, samtykke eller loven er ikke tilladt.",
      };
    case "en":
    default:
      return {
        directAnswer:
          "No. You cannot upload, send, or share nude, intimate, or private images of other people without their explicit consent and the necessary rights.",
        explanation:
          "You may only share content you own or have explicit permission to share. Identifiable people must have given consent, and content that violates privacy, consent, or the law is not allowed.",
      };
  }
}

export function buildWebsiteKompisSafetyPolicyRefusalResponse(locale: WebsiteKompisFaqMatchSafetyLocale) {
  const copy = buildWebsiteKompisSafetyPolicyRefusalCopy(locale);

  return {
    answer: {
      directAnswer: copy.directAnswer,
      explanation: copy.explanation,
      steps: [] as string[],
    },
    actions: [] as [],
    sources: [{ title: "Safety policy", route: WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE }],
    confidence: { level: "high" as const, score: 0.92 },
    supportEscalation: { offered: false as const, reason: null },
    locale,
  };
}

export function tryBuildWebsiteKompisSafetyPolicyAnswer(
  question: string,
  locale: WebsiteKompisFaqMatchSafetyLocale,
): ReturnType<typeof buildWebsiteKompisSafetyPolicyRefusalResponse> | null {
  if (!isWebsiteKompisMandatorySafetyRefusalQuestion(question)) {
    return null;
  }

  return buildWebsiteKompisSafetyPolicyRefusalResponse(locale);
}
