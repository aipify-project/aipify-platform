import assert from "node:assert/strict";
import {
  formatPlatformDateOnly,
  formatPlatformDateTimeFull,
  formatPlatformDateTimeShort,
  formatPlatformDuration,
  formatPlatformRelativeTime,
  looksLikeRawIsoDateTime,
} from "./date-time";
import { toBcp47Locale } from "./bcp47";

const ISO = "2026-07-31T02:42:07.457174+00:00";
const ISO2 = "2026-07-29T18:52:18.611242+00:00";

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`ok ${name}`);
  } catch (error) {
    console.error(`fail ${name}`);
    throw error;
  }
}

test("BCP 47 locale mapping covers active locales", () => {
  assert.equal(toBcp47Locale("no"), "nb-NO");
  assert.equal(toBcp47Locale("en"), "en-GB");
  assert.equal(toBcp47Locale("sv"), "sv-SE");
  assert.equal(toBcp47Locale("es"), "es-ES");
});

test("full datetime never returns raw ISO", () => {
  const formatted = formatPlatformDateTimeFull(ISO, {
    locale: "no",
    timeZone: "Europe/Oslo",
    emptyFallback: "—",
    invalidFallback: "ugyldig",
  });
  assert.ok(!looksLikeRawIsoDateTime(formatted));
  assert.ok(!formatted.includes("T02:42:07"));
  assert.ok(!formatted.includes("+00:00"));
  assert.ok(!formatted.includes("Invalid Date"));
  assert.match(formatted, /2026/);
  assert.match(formatted, /juli/i);
});

test("short datetime stays compact and localized", () => {
  const formatted = formatPlatformDateTimeShort(ISO, {
    locale: "no",
    timeZone: "Europe/Oslo",
    emptyFallback: "—",
    invalidFallback: "ugyldig",
  });
  assert.ok(!looksLikeRawIsoDateTime(formatted));
  assert.ok(!formatted.includes("T02:"));
  assert.match(formatted, /31/);
  assert.match(formatted, /2026/);
});

test("null and invalid dates use controlled fallbacks", () => {
  assert.equal(
    formatPlatformDateTimeFull(null, {
      locale: "en",
      emptyFallback: "empty",
      invalidFallback: "invalid",
    }),
    "empty",
  );
  assert.equal(
    formatPlatformDateTimeFull("not-a-date", {
      locale: "en",
      emptyFallback: "empty",
      invalidFallback: "invalid",
    }),
    "invalid",
  );
  assert.equal(
    formatPlatformDateOnly("", {
      locale: "en",
      emptyFallback: "empty",
      invalidFallback: "invalid",
    }),
    "empty",
  );
});

test("relative time and duration are locale-aware", () => {
  const relative = formatPlatformRelativeTime(ISO2, {
    locale: "no",
    timeZone: "Europe/Oslo",
    emptyFallback: "—",
    invalidFallback: "ugyldig",
    now: Date.parse("2026-07-29T20:52:18.611242+00:00"),
  });
  assert.ok(relative.length > 0);
  assert.ok(!looksLikeRawIsoDateTime(relative));

  const duration = formatPlatformDuration(ISO2, ISO, {
    locale: "en",
    emptyFallback: "—",
    invalidFallback: "ugyldig",
  });
  assert.ok(duration.length > 0);
  assert.ok(!looksLikeRawIsoDateTime(duration));
});

test("looksLikeRawIsoDateTime detects forbidden patterns", () => {
  assert.equal(looksLikeRawIsoDateTime(ISO), true);
  assert.equal(looksLikeRawIsoDateTime("31. juli 2026 kl. 04:42"), false);
});

console.log("platform-presentation-quality date-time: all passed");
