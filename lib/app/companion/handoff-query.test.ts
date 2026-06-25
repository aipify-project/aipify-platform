import assert from "node:assert/strict";
import { shouldAutoSubmitHandoffQuery } from "./handoff-query";

assert.equal(shouldAutoSubmitHandoffQuery("", true, null), false);
assert.equal(shouldAutoSubmitHandoffQuery("  ", true, null), false);
assert.equal(shouldAutoSubmitHandoffQuery(null, true, null), false);
assert.equal(shouldAutoSubmitHandoffQuery("hello", false, null), false);

assert.equal(shouldAutoSubmitHandoffQuery("hello", true, null), true);
assert.equal(shouldAutoSubmitHandoffQuery("hello", true, "hello"), false);
assert.equal(shouldAutoSubmitHandoffQuery("hello", true, "other"), true);
assert.equal(shouldAutoSubmitHandoffQuery("  hello  ", true, null), true);

console.log("handoff-query tests passed");
