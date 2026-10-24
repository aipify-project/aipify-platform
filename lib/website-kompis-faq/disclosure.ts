/**
 * Context check for FAQ drafts that may be marked public-safe.
 * Ordinary product, membership, booking, price, and adult-topic words are not a hold.
 * A hold requires a concrete private signal.
 */

export const FAQ_DISCLOSURE_REASONS = [
  "personal_identifier",
  "customer_invoice",
  "internal_note",
  "access_secret",
] as const;

export type FaqDisclosureReason = (typeof FAQ_DISCLOSURE_REASONS)[number];

const IDENTIFIER =
  /\b(?:member\s*id|medlemsnummer|medlems-?id|medlemsnr|kundnummer|kundenummer|kunde(?:nummer|nr)|customer\s*(?:id|number|no)|personnummer|f[øo]dselsnummer|kortnummer|card\s*number)\b\s*[:#-]?\s*([a-z0-9][a-z0-9-]{2,})/gi;

const INVOICE =
  /\b(?:fakturanummer|fakturanr|faktura(?:\s*nr\.?)?|invoice(?:\s*(?:number|no))?|inv)\b\s*[:#-]?\s*([a-z0-9][a-z0-9-]{2,})/gi;

const INTERNAL_NOTE = [
  /\binternal\s+(?:note|only|use)\b/i,
  /\bintern(?:t)?\s+(?:note|notat|anteckning)\b/i,
  /\bikke\s+publiser\b/i,
  /\bdo\s+not\s+publish\b/i,
  /\bnot\s+for\s+publication\b/i,
  /\bstaff\s+only\b/i,
  /\bkun\s+for\s+ansatte\b/i,
];

const ACCESS_SECRET = [
  /\b(?:api[\s_-]*key|client[\s_-]*secret|password|passord|adgangskode|lösenord|token)\b\s*[:=]\s*\S{6,}/i,
  /\bsk_(?:live|test)_[a-z0-9]{8,}/i,
  /\bbearer\s+[a-z0-9\-._~+/]{16,}/i,
  /\beyJ[a-z0-9_-]{12,}\.[a-z0-9_-]{8,}\.[a-z0-9_-]{8,}/i,
  /\b(?:cvv|cvc)\b\s*[:#]?\s*\d{3,}\b/i,
];

function hasIdentifierValue(value: string | undefined): boolean {
  return Boolean(value && value.length >= 3 && /[0-9]/.test(value));
}

function firstIdentifier(pattern: RegExp, text: string): boolean {
  pattern.lastIndex = 0;
  let match = pattern.exec(text);
  while (match) {
    if (hasIdentifierValue(match[1])) return true;
    match = pattern.exec(text);
  }
  return false;
}

/** Reasons a draft must stay for individual review. Empty means the wording can be marked. */
export function classifyWebsiteKompisFaqDisclosure(text: string): FaqDisclosureReason[] {
  const normalized = text.toLowerCase();
  const reasons: FaqDisclosureReason[] = [];
  if (firstIdentifier(IDENTIFIER, normalized)) reasons.push("personal_identifier");
  if (firstIdentifier(INVOICE, normalized)) reasons.push("customer_invoice");
  if (INTERNAL_NOTE.some((pattern) => pattern.test(normalized))) reasons.push("internal_note");
  if (ACCESS_SECRET.some((pattern) => pattern.test(normalized))) reasons.push("access_secret");
  return reasons;
}
