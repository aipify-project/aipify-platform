import { UAAF_ACTION_OFFER_PROMPTS } from "./constants";
import type { UaafActionCategory, UaafActionOffer } from "./types";

const OFFER_PATTERNS: Array<{
  action_key: keyof typeof UAAF_ACTION_OFFER_PROMPTS;
  category: UaafActionCategory;
  pattern: RegExp;
}> = [
  { action_key: "print", category: "device", pattern: /\b(print|skriv ut|print ut)\b/i },
  { action_key: "email", category: "business", pattern: /\b(send (this )?email|sende (denne )?e-?post)\b/i },
  { action_key: "taxi", category: "personal", pattern: /\b(order (a )?taxi|bestille taxi)\b/i },
  { action_key: "flowers", category: "personal", pattern: /\b(send flowers|sende blomster)\b/i },
  { action_key: "calendar", category: "personal", pattern: /\b(add to (my )?calendar|legge til i kalender)\b/i },
];

export function detectUaafActionOffer(input: string): UaafActionOffer {
  const normalized = input.trim();
  if (!normalized) {
    return { should_offer: false, action_key: null, category: null, prompt_en: "", prompt_no: "" };
  }

  for (const item of OFFER_PATTERNS) {
    if (item.pattern.test(normalized)) {
      const prompts = UAAF_ACTION_OFFER_PROMPTS[item.action_key];
      return {
        should_offer: true,
        action_key: item.action_key,
        category: item.category,
        prompt_en: prompts.en,
        prompt_no: prompts.no,
      };
    }
  }

  return { should_offer: false, action_key: null, category: null, prompt_en: "", prompt_no: "" };
}

export function getUaafOfferPrompt(locale: string, actionKey: keyof typeof UAAF_ACTION_OFFER_PROMPTS): string {
  const prompts = UAAF_ACTION_OFFER_PROMPTS[actionKey];
  const isNo = locale === "no" || locale === "nb" || locale === "nn";
  return isNo ? prompts.no : prompts.en;
}
