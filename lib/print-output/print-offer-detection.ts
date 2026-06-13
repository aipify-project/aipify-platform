import {
  PRINT_OFFER_CONTEXTUAL_EN,
  PRINT_OFFER_CONTEXTUAL_NO,
  PRINT_OFFER_PROMPT_EN,
  PRINT_OFFER_PROMPT_NO,
} from "./constants";
import type { PrintOfferDetection } from "./types";

const PRINT_OFFER_PATTERNS: Array<{ type: string; pattern: RegExp }> = [
  { type: "meeting_notes", pattern: /\b(meeting notes?|møtenotat|referat)\b/i },
  { type: "report", pattern: /\b(report|rapport|summary report)\b/i },
  { type: "invoice", pattern: /\b(invoice|faktura)\b/i },
  { type: "contract", pattern: /\b(contract|kontrakt|agreement)\b/i },
  { type: "checklist", pattern: /\b(checklist|sjekkliste)\b/i },
  { type: "instructions", pattern: /\b(instructions?|instruksjoner|procedure)\b/i },
  { type: "customer_summary", pattern: /\b(customer summary|kundesammendrag)\b/i },
  { type: "shipping_document", pattern: /\b(shipping|forsendelse|delivery note)\b/i },
  { type: "approval_document", pattern: /\b(approval|godkjenning)\b/i },
  { type: "training_material", pattern: /\b(training|opplæring|course material)\b/i },
  { type: "work_order", pattern: /\b(work order|arbeidsordre)\b/i },
  { type: "daily_briefing", pattern: /\b(daily briefing|daglig briefing|morning briefing)\b/i },
  { type: "executive_summary", pattern: /\b(executive summary|ledersammendrag)\b/i },
];

const PRINT_COMMAND_PATTERNS = [
  /\bprint (this|the|today'?s?)\b/i,
  /\bprint (two|2) copies\b/i,
  /\bprint in black and white\b/i,
  /\bprint as pdf\b/i,
  /\b(send|sende).*(office printer|kontorprinter)\b/i,
  /\bprint (this|det) for (the )?customer\b/i,
  /\b(skriv ut|print ut)\b/i,
];

export function detectPrintableDocumentType(input: string): string | null {
  const normalized = input.trim();
  if (!normalized) return null;
  for (const item of PRINT_OFFER_PATTERNS) {
    if (item.pattern.test(normalized)) return item.type;
  }
  return null;
}

export function detectPrintCommandIntent(input: string): boolean {
  const normalized = input.trim();
  if (!normalized) return false;
  return PRINT_COMMAND_PATTERNS.some((pattern) => pattern.test(normalized));
}

export function detectPrintOfferCue(input: string, contentType?: string): PrintOfferDetection {
  const documentType = contentType ?? detectPrintableDocumentType(input);
  const commandIntent = detectPrintCommandIntent(input);
  const shouldOffer = Boolean(documentType) || commandIntent;

  return {
    should_offer: shouldOffer,
    document_type: documentType,
    prompt_en: PRINT_OFFER_PROMPT_EN,
    prompt_no: PRINT_OFFER_PROMPT_NO,
    contextual_en: PRINT_OFFER_CONTEXTUAL_EN,
    contextual_no: PRINT_OFFER_CONTEXTUAL_NO,
  };
}

export function getPrintOfferLanguage(locale: string, contextual = false): string {
  const isNo = locale === "no" || locale === "nb" || locale === "nn";
  if (contextual) return isNo ? PRINT_OFFER_CONTEXTUAL_NO : PRINT_OFFER_CONTEXTUAL_EN;
  return isNo ? PRINT_OFFER_PROMPT_NO : PRINT_OFFER_PROMPT_EN;
}
