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

function isExpired(validUntil: string | null | undefined): boolean {
  const value = validUntil?.trim();
  if (!value) return false;
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) || parsed < Date.now();
}

export function canPublishWebsiteKompisFaqDraft(input: {
  title: string;
  answer: string;
  locale: string;
  contentType: string;
  publicSafe: boolean;
  status: string;
  validUntil?: string | null;
}): boolean {
  if (input.status !== "draft") return false;
  if (!hasRequiredPublishFields(input)) return false;
  if (isExpired(input.validUntil)) return false;
  return true;
}

/**
 * A published row stays published. Core's publish RPC only accepts drafts,
 * so an edit uses the existing upsert and must not call publish again.
 */
export function planWebsiteKompisFaqPublish(input: {
  status: "new" | "draft" | "published" | "archived" | string;
  title: string;
  answer: string;
  locale: string;
  contentType: string;
  publicSafe: boolean;
  validUntil?: string | null;
}): WebsiteKompisFaqPublishPlan {
  const fields = {
    title: input.title,
    answer: input.answer,
    locale: input.locale,
    contentType: input.contentType,
    publicSafe: input.publicSafe,
    validUntil: input.validUntil,
  };
  if (input.status === "published") {
    if (!hasRequiredPublishFields(fields) || isExpired(input.validUntil)) return "blocked";
    return "revise_published";
  }
  if (input.status === "new" || input.status === "draft") {
    return canPublishWebsiteKompisFaqDraft({ ...fields, status: "draft" })
      ? "publish_draft"
      : "blocked";
  }
  return "blocked";
}

export function isWebsiteKompisFaqEditorValid(input: WebsiteKompisFaqUpsertInput): boolean {
  return Boolean(
    input.title.trim() &&
      input.answer.trim() &&
      input.locale.trim() &&
      input.contentType.trim(),
  );
}
