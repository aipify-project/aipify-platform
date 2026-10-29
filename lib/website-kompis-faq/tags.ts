import { WPKF_MAX_TAGS, WPKF_TAG_MAX_LENGTH } from "@/lib/website-kompis-faq/constants";

/**
 * FAQ editor / save tag contract (matches APP FAQ API sanitizeTags):
 * - Split on commas; spaces after commas are allowed.
 * - Trim each token; discard empty tokens.
 * - Preserve entered case; do not case-fold.
 * - Do not dedupe (API persists duplicates as entered; import CSV path may dedupe separately).
 * - Soft limits: each tag ≤ WPKF_TAG_MAX_LENGTH (50); at most WPKF_MAX_TAGS (20).
 * Over-limit inputs must fail validation in the editor — never silently truncate/drop.
 */

export type FaqTagsParseFailure = "tag_too_long" | "too_many_tags";

export type FaqTagsParseResult =
  | { ok: true; tags: string[] }
  | { ok: false; reason: FaqTagsParseFailure };

export function formatFaqTagsInput(tags: readonly string[]): string {
  return tags.join(", ");
}

export function parseFaqTagsInput(value: string): FaqTagsParseResult {
  const tags: string[] = [];
  for (const part of value.split(",")) {
    const tag = part.trim();
    if (!tag) continue;
    if (tag.length > WPKF_TAG_MAX_LENGTH) {
      return { ok: false, reason: "tag_too_long" };
    }
    tags.push(tag);
  }
  if (tags.length > WPKF_MAX_TAGS) {
    return { ok: false, reason: "too_many_tags" };
  }
  return { ok: true, tags };
}
