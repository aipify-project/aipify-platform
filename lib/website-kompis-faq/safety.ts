import { WPKF_RISKY_WORDS } from "@/lib/website-kompis-faq/constants";
import type { WebsiteKompisFaqUpsertInput } from "@/lib/website-kompis-faq/types";

export function detectWebsiteKompisFaqRiskyWords(text: string): string[] {
  const normalized = text.toLowerCase();
  return WPKF_RISKY_WORDS.filter((word) => normalized.includes(word.toLowerCase()));
}

export function canPublishWebsiteKompisFaqDraft(input: {
  title: string;
  answer: string;
  locale: string;
  contentType: string;
  publicSafe: boolean;
  status: string;
}): boolean {
  if (input.status !== "draft") return false;
  if (!input.publicSafe) return false;
  if (!input.title.trim() || !input.answer.trim() || !input.locale.trim()) return false;
  if (!input.contentType.trim()) return false;
  return true;
}

export function isWebsiteKompisFaqEditorValid(input: WebsiteKompisFaqUpsertInput): boolean {
  return Boolean(
    input.title.trim() &&
      input.answer.trim() &&
      input.locale.trim() &&
      input.contentType.trim(),
  );
}
