import { WPKF_RISKY_WORDS } from "@/lib/website-kompis-faq/constants";
import type { WebsiteKompisFaqUpsertInput } from "@/lib/website-kompis-faq/types";

export function detectWebsiteKompisFaqRiskyWords(text: string): string[] {
  const normalized = text.toLowerCase();
  return WPKF_RISKY_WORDS.filter((word) => normalized.includes(word.toLowerCase()));
}

export type WebsiteKompisFaqPublishPlan = "publish_draft" | "revise_published" | "blocked";

function hasRequiredPublishFields(input: {
  title: string;
  answer: string;
  locale: string;
  contentType: string;
  publicSafe: boolean;
}): boolean {
  return Boolean(
    input.publicSafe &&
      input.title.trim() &&
      input.answer.trim() &&
      input.locale.trim() &&
      input.contentType.trim(),
  );
}

/** Empty end date means no expiry. Equal start and end is not a usable window. */
export function faqValidityAllowsPublication(input: {
  validFrom?: string | null;
  validUntil?: string | null;
  now?: number;
}): boolean {
  const now = input.now ?? Date.now();
  const fromRaw = input.validFrom?.trim() ?? "";
  const untilRaw = input.validUntil?.trim() ?? "";
  const from = fromRaw ? Date.parse(fromRaw) : null;
  const until = untilRaw ? Date.parse(untilRaw) : null;
  if (fromRaw && Number.isNaN(from)) return false;
  if (untilRaw && Number.isNaN(until)) return false;
  if (from != null && until != null && until <= from) return false;
  if (until != null && until < now) return false;
  return true;
}

export function canPublishWebsiteKompisFaqDraft(input: {
  title: string;
  answer: string;
  locale: string;
  contentType: string;
  publicSafe: boolean;
  status: string;
  validFrom?: string | null;
  validUntil?: string | null;
}): boolean {
  if (input.status !== "draft") return false;
  if (!hasRequiredPublishFields(input)) return false;
  if (!faqValidityAllowsPublication(input)) return false;
  return true;
}

/**
 * A published row stays published. Core's publish call only accepts drafts,
 * so an edit uses the existing save and must not call publish again.
 */
export function planWebsiteKompisFaqPublish(input: {
  status: "new" | "draft" | "published" | "archived" | string;
  title: string;
  answer: string;
  locale: string;
  contentType: string;
  publicSafe: boolean;
  validFrom?: string | null;
  validUntil?: string | null;
}): WebsiteKompisFaqPublishPlan {
  const fields = {
    title: input.title,
    answer: input.answer,
    locale: input.locale,
    contentType: input.contentType,
    publicSafe: input.publicSafe,
    validFrom: input.validFrom,
    validUntil: input.validUntil,
  };
  if (!faqValidityAllowsPublication(fields) || !hasRequiredPublishFields(fields)) return "blocked";
  if (input.status === "published") return "revise_published";
  if (input.status === "new" || input.status === "draft") return "publish_draft";
  return "blocked";
}

export function isoToDateTimeLocal(value: string | null | undefined): string {
  if (!value) return "";
  const parsed = Date.parse(value);
  if (Number.isNaN(parsed)) return "";
  const date = new Date(parsed);
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function isWebsiteKompisFaqEditorValid(input: WebsiteKompisFaqUpsertInput): boolean {
  return Boolean(
    input.title.trim() &&
      input.answer.trim() &&
      input.locale.trim() &&
      input.contentType.trim(),
  );
}
