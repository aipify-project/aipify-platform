import assert from "node:assert/strict";
import {
  formatFaqTagsInput,
  parseFaqTagsInput,
} from "@/lib/website-kompis-faq/tags";
import { WPKF_MAX_TAGS, WPKF_TAG_MAX_LENGTH } from "@/lib/website-kompis-faq/constants";

// Regression: the old controlled-input path split+filter(Boolean)+join erased a trailing comma.
function legacyBrokenOnChange(value: string): string {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean)
    .join(", ");
}

assert.equal(legacyBrokenOnChange("e-post,"), "e-post");
assert.equal(legacyBrokenOnChange("e-post, "), "e-post");

// Fixed path keeps the raw typing buffer; normalize only for save/readback.
assert.deepEqual(parseFaqTagsInput("e-post,"), { ok: true, tags: ["e-post"] });
assert.deepEqual(parseFaqTagsInput("e-post, varsler, meldinger"), {
  ok: true,
  tags: ["e-post", "varsler", "meldinger"],
});
assert.deepEqual(parseFaqTagsInput("  e-post ,  varsler , meldinger  "), {
  ok: true,
  tags: ["e-post", "varsler", "meldinger"],
});
assert.deepEqual(parseFaqTagsInput(""), { ok: true, tags: [] });
assert.deepEqual(parseFaqTagsInput("single"), { ok: true, tags: ["single"] });
assert.deepEqual(parseFaqTagsInput("Alpha, alpha"), {
  ok: true,
  tags: ["Alpha", "alpha"],
});

assert.equal(formatFaqTagsInput(["e-post", "varsler", "meldinger"]), "e-post, varsler, meldinger");
assert.equal(formatFaqTagsInput([]), "");

const tooLong = "x".repeat(WPKF_TAG_MAX_LENGTH + 1);
assert.deepEqual(parseFaqTagsInput(tooLong), { ok: false, reason: "tag_too_long" });

const tooMany = Array.from({ length: WPKF_MAX_TAGS + 1 }, (_, i) => `t${i}`).join(", ");
assert.deepEqual(parseFaqTagsInput(tooMany), { ok: false, reason: "too_many_tags" });

// Roundtrip: typed multi-tag → parse → format → parse
const typed = "e-post, varsler, meldinger";
const saved = parseFaqTagsInput(typed);
assert.equal(saved.ok, true);
if (saved.ok) {
  const shown = formatFaqTagsInput(saved.tags);
  assert.equal(shown, "e-post, varsler, meldinger");
  assert.deepEqual(parseFaqTagsInput(shown), saved);
}

console.log("website-kompis-faq-tags.test.ts: all assertions passed");
