import assert from "node:assert/strict";
import {
  KOMPIS_WEB_SIGNUP_HANDOFF_KEY,
  clearSignupHandoff,
  readSignupHandoff,
  writeSignupHandoff,
} from "./signup-handoff";

assert.equal(KOMPIS_WEB_SIGNUP_HANDOFF_KEY, "aipify.kompis_web.signup_collect.v1");
assert.doesNotMatch(KOMPIS_WEB_SIGNUP_HANDOFF_KEY, /email|password|token/i);

const memory = new Map<string, string>();
const storage = {
  getItem(key: string) {
    return memory.has(key) ? memory.get(key)! : null;
  },
  setItem(key: string, value: string) {
    memory.set(key, value);
  },
  removeItem(key: string) {
    memory.delete(key);
  },
};

Object.defineProperty(globalThis, "window", {
  value: { sessionStorage: storage },
  configurable: true,
  writable: true,
});

writeSignupHandoff({
  email: "you@company.com",
  website: "https://company.com",
  company: "Company AS",
  language: "en",
});

const handoff = readSignupHandoff();
assert.ok(handoff);
assert.equal(handoff.email, "you@company.com");
assert.equal(handoff.website, "https://company.com");
assert.equal(handoff.company, "Company AS");
assert.equal(handoff.language, "en");
assert.ok(!JSON.stringify(handoff).includes("?"));

clearSignupHandoff();
assert.equal(readSignupHandoff(), null);

storage.setItem(
  KOMPIS_WEB_SIGNUP_HANDOFF_KEY,
  JSON.stringify({
    email: "bad",
    website: "not-a-url",
    company: "",
    language: "xx",
  }),
);
assert.equal(readSignupHandoff(), null);

console.log("signup-handoff: PASS");
