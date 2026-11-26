import assert from "node:assert/strict";
import test from "node:test";
import {
  CSP_UNREAD_INVALIDATE_EVENT,
  invalidateCspUnreadBadges,
  subscribeCspUnreadInvalidate,
} from "./unread-invalidate";

test("invalidateCspUnreadBadges notifies partner and platform subscribers", () => {
  const seen: Array<{ partner?: boolean; platform?: boolean }> = [];
  const stop = subscribeCspUnreadInvalidate((detail) => {
    seen.push(detail);
  });
  invalidateCspUnreadBadges({ partner: true, platform: false });
  invalidateCspUnreadBadges({ partner: false, platform: true });
  stop();
  assert.equal(CSP_UNREAD_INVALIDATE_EVENT, "aipify:csp-unread-invalidate");
  assert.deepEqual(seen, [
    { partner: true, platform: false },
    { partner: false, platform: true },
  ]);
});
