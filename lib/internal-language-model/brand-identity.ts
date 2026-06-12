import {
  BRAND_ADDRESS_I18N_KEYS,
  BRAND_ADDRESS_RESPONSES,
  BRAND_SELF_REFERENCE_REWRITES,
  type BrandAddressIntent,
} from "./brand-identity-vocabulary";

export type { BrandAddressIntent };

export function detectBrandAddressIntent(message: string): BrandAddressIntent | null {
  const text = message.trim();
  if (!text) return null;

  if (/^(?:hi|hello|hey|good (?:morning|afternoon|evening)),?\s+aipify\b/i.test(text)) {
    return "greeting_aipify";
  }
  if (/^(?:hi|hello|hey|good (?:morning|afternoon|evening)),?\s+ai\b/i.test(text)) {
    return "greeting_ai_alias";
  }
  if (
    /\b(?:can|could|will) (?:the )?ai\b/i.test(text) &&
    /\b(?:generat|creat|make|produc).{0,30}\breport/i.test(text)
  ) {
    return "report_request";
  }
  if (/\bcan you help(?: me)?(?: with that| today| now)?\b/i.test(text)) {
    return "generic_help";
  }

  return null;
}

export function getBrandAddressResponse(
  intent: BrandAddressIntent,
  options?: {
    overrides?: Partial<typeof BRAND_ADDRESS_RESPONSES>;
    /** Prefix keys with `customerApp.` when using createTranslator(customerAppDict). */
    translate?: (key: string) => string;
  }
): string {
  if (options?.translate) {
    const translated = options.translate(BRAND_ADDRESS_I18N_KEYS[intent]);
    if (translated !== BRAND_ADDRESS_I18N_KEYS[intent]) {
      return translated;
    }
  }
  return options?.overrides?.[intent] ?? BRAND_ADDRESS_RESPONSES[intent];
}

/** Normalize assistant or template copy to Aipify-first self-reference. */
export function adaptReplyToBrandIdentity(text: string): string {
  let result = text;
  for (const [pattern, replacement] of BRAND_SELF_REFERENCE_REWRITES) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
