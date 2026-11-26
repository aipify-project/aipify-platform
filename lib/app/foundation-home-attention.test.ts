import assert from "node:assert/strict";
import {
  buildWebsiteKompisConnectionAttention,
  resolveWelcomeGreetingHour,
} from "@/lib/app/foundation-home-attention";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";

assert.equal(resolveWelcomeGreetingHour(8), "morning");
assert.equal(resolveWelcomeGreetingHour(14), "afternoon");
assert.equal(resolveWelcomeGreetingHour(21), "evening");

assert.deepEqual(buildWebsiteKompisConnectionAttention(null, "action_required"), []);
assert.deepEqual(buildWebsiteKompisConnectionAttention(false, "action_required"), []);
assert.deepEqual(buildWebsiteKompisConnectionAttention(true, "active"), []);
assert.deepEqual(buildWebsiteKompisConnectionAttention(true, null), []);

const setup = buildWebsiteKompisConnectionAttention(true, "unconfigured");
assert.equal(setup.length, 1);
assert.equal(setup[0]?.titleKey, "connectionNeedsSetup");
assert.equal(setup[0]?.href, FOUNDATION_NAV_BINDINGS.kompisWebConnection);

const pending = buildWebsiteKompisConnectionAttention(true, "pending");
assert.equal(pending[0]?.titleKey, "connectionPending");

const action = buildWebsiteKompisConnectionAttention(true, "error");
assert.equal(action[0]?.titleKey, "connectionNeedsAction");

console.log("foundation-home-attention.test.ts: all assertions passed");
