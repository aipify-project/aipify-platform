import type { PublicCompanionTenantFaqRow } from "@/lib/marketing/public-companion-tenant-faq";
import type { PublicCompanionAskLocale } from "@/lib/marketing/public-companion-ask";

export const WEBSITE_KOMPIS_SAFETY_POLICY_SOURCE = "website-kompis-safety-policy" as const;

type SafetyModifierGroup = {
  userPatterns: RegExp[];
  faqCoveragePatterns: RegExp[];
};

const SAFETY_MODIFIER_GROUPS: SafetyModifierGroup[] = [
  {
    userPatterns: [
      /\bandre\s+person\w*\b/i,
      /\bandres\b/i,
      /\bother\s+peoples?\b/i,
      /\bimages?\s+of\s+other\b/i,
      /\bbilder?\s+av\s+noen\b/i,
      /\bbilder?\s+av\s+andre\b/i,
      /\bof\s+someone\s+else\b/i,
    ],
    faqCoveragePatterns: [
      /\bandre\s+person\w*\b/i,
      /\bandres\b/i,
      /\bother\s+peoples?\b/i,
      /\bsamtykke\b/i,
      /\bconsent\b/i,
      /\brettighe\w*\b/i,
      /\brights\b/i,
    ],
  },
  {
    userPatterns: [/\buten\s+samtykke\b/i, /\bwithout\s+consent\b/i, /\bnon[-\s]?consensual\b/i],
    faqCoveragePatterns: [/\buten\s+samtykke\b/i, /\bwithout\s+consent\b/i, /\bsamtykke\b/i, /\bconsent\b/i],
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
    userPatterns: [/\bprivat\w*\s+bilder?\b/i, /\bprivate\s+(?:photos?|images?|pictures?)\b/i],
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

export function isWebsiteKompisMandatorySafetyRefusalQuestion(question: string): boolean {
  const normalized = normalizeVisitorQuestion(question);
  if (!normalized || !INTIMATE_UPLOAD_TOPIC_PATTERN.test(normalized)) {
    return false;
  }

  if (OWN_CONTENT_PATTERN.test(normalized)) {
    return false;
  }

  for (const group of SAFETY_MODIFIER_GROUPS) {
    if (!groupMatches(normalized, group.userPatterns)) {
      continue;
    }
    return true;
  }

  return /\b(bilder?\s+av\s+noen|images?\s+of\s+(?:other\s+)?people|andre\s+person\w*|other\s+peoples?)\b/i.test(
    normalized,
  );
}

export function shouldRejectWebsiteKompisFaqMatch(
  userQuestion: string,
  faqRow: Pick<PublicCompanionTenantFaqRow, "title" | "answer">,
): boolean {
  const normalizedQuestion = normalizeVisitorQuestion(userQuestion);
  if (!normalizedQuestion) {
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

export function buildWebsiteKompisSafetyPolicyRefusalCopy(locale: string): {
  directAnswer: string;
  explanation: string;
} {
  switch (locale) {
    case "no":
      return {
        directAnswer:
          "Nei. Du kan ikke laste opp nakenbilder, intime bilder eller private bilder av andre personer uten deres uttrykkelige samtykke og nødvendige rettigheter.",
        explanation:
          "Identifiserbare personer må ha gitt samtykke, og innhold som bryter personvern, samtykke eller lov er ikke tillatt.",
      };
    case "sv":
      return {
        directAnswer:
          "Nej. Du får inte ladda upp nakenbilder, intima bilder eller privata bilder av andra personer utan deras uttryckliga samtycke och nödvändiga rättigheter.",
        explanation:
          "Identifierbara personer måste ha gett samtycke, och innehåll som bryter mot integritet, samtycke eller lag är inte tillåtet.",
      };
    case "da":
      return {
        directAnswer:
          "Nej. Du må ikke uploade nøgenbilleder, intime billeder eller private billeder af andre personer uden deres udtrykkelige samtykke og nødvendige rettigheder.",
        explanation:
          "Identificerbare personer skal have givet samtykke, og indhold der bryder privatliv, samtykke eller loven er ikke tilladt.",
      };
    case "en":
    default:
      return {
        directAnswer:
          "No. You cannot upload nude, intimate, or private images of other people without their explicit consent and the necessary rights.",
        explanation:
          "Identifiable people must have given consent, and content that violates privacy, consent, or the law is not allowed.",
      };
  }
}

export function buildWebsiteKompisSafetyPolicyRefusalResponse(locale: PublicCompanionAskLocale) {
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
  locale: PublicCompanionAskLocale,
): ReturnType<typeof buildWebsiteKompisSafetyPolicyRefusalResponse> | null {
  if (!isWebsiteKompisMandatorySafetyRefusalQuestion(question)) {
    return null;
  }

  return buildWebsiteKompisSafetyPolicyRefusalResponse(locale);
}
