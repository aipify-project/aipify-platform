import assert from "node:assert/strict";
import {
  shouldAutoSubmitHandoffQuery,
  shouldPopulateHandoffComposer,
} from "./handoff-query";

assert.equal(shouldAutoSubmitHandoffQuery("", true, null), false);
assert.equal(shouldAutoSubmitHandoffQuery("  ", true, null), false);
assert.equal(shouldAutoSubmitHandoffQuery(null, true, null), false);
assert.equal(shouldAutoSubmitHandoffQuery("hello", false, null), false);

assert.equal(shouldAutoSubmitHandoffQuery("hello", true, null), true);
assert.equal(shouldAutoSubmitHandoffQuery("hello", true, "hello"), false);
assert.equal(shouldAutoSubmitHandoffQuery("hello", true, "other"), true);
assert.equal(shouldAutoSubmitHandoffQuery("  hello  ", true, null), true);

assert.equal(shouldPopulateHandoffComposer(""), false);
assert.equal(shouldPopulateHandoffComposer("  "), false);
assert.equal(shouldPopulateHandoffComposer(null), false);
assert.equal(shouldPopulateHandoffComposer("hello"), true);
assert.equal(shouldPopulateHandoffComposer("  hello  "), true);

console.log("handoff-query tests passed");
