import assert from "node:assert/strict";
import {
  buildWebsiteKompisEmbedSessionStorageKey,
  readWebsiteKompisEmbedSession,
  sanitizeWebsiteKompisEmbedSessionState,
  writeWebsiteKompisEmbedSession,
} from "@/lib/marketing/website-kompis-embed-session";
import {
  isAllowedWebsiteKompisHostNavigateHref,
  sanitizeWebsiteKompisEmbedLocale,
} from "@/lib/marketing/website-kompis-embed";

assert.equal(
  buildWebsiteKompisEmbedSessionStorageKey("install", "customer.example"),
  "aipify.wk.session.v1:install:customer.example",
);

const now = Date.now();
const valid = sanitizeWebsiteKompisEmbedSessionState(
  {
    v: 1,
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "customer.example",
    open: true,
    locale: "no",
    updatedAt: now,
    messages: [{ id: "m1", role: "user", text: "Hei" }],
  },
  {
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "customer.example",
  },
  now,
);
assert.equal(valid?.open, true);
assert.equal(valid?.messages.length, 1);

assert.equal(
  sanitizeWebsiteKompisEmbedSessionState(
    {
      v: 1,
      installId: "11111111-1111-4111-8111-111111111111",
      domain: "other.example",
      open: true,
      locale: "no",
      updatedAt: now,
      messages: [],
    },
    {
      installId: "11111111-1111-4111-8111-111111111111",
      domain: "customer.example",
    },
    now,
  ),
  null,
);

const memory = new Map<string, string>();
const storage = {
  getItem: (key: string) => memory.get(key) ?? null,
  setItem: (key: string, value: string) => {
    memory.set(key, value);
  },
  removeItem: (key: string) => {
    memory.delete(key);
  },
};

assert.equal(
  writeWebsiteKompisEmbedSession(storage, {
    v: 1,
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "customer.example",
    open: true,
    locale: "en",
    updatedAt: now,
    messages: [{ id: "a", role: "assistant", text: "Hi" }],
  }),
  true,
);
assert.equal(
  readWebsiteKompisEmbedSession(storage, {
    installId: "11111111-1111-4111-8111-111111111111",
    domain: "customer.example",
  })?.locale,
  "en",
);

assert.equal(
  isAllowedWebsiteKompisHostNavigateHref("https://www.customer.example/no/faq", [
    "customer.example",
  ]),
  true,
);
assert.equal(
  isAllowedWebsiteKompisHostNavigateHref("javascript:alert(1)", ["customer.example"]),
  false,
);
assert.equal(
  isAllowedWebsiteKompisHostNavigateHref("https://evil.example/no/faq", ["customer.example"]),
  false,
);

assert.equal(sanitizeWebsiteKompisEmbedLocale("de"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("de-DE"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("xx"), "en");
assert.equal(sanitizeWebsiteKompisEmbedLocale("nb"), "no");

console.log("website-kompis-embed-session.test.ts: all assertions passed");
