import assert from "node:assert/strict";
import {
  assertClaimedPortalAllowed,
  classifyLivePresencePortal,
  distinctSignedInCount,
} from "./classify";

assert.equal(
  classifyLivePresencePortal({
    isPlatformAdmin: true,
    isSeller: true,
    isAppCustomer: true,
  }),
  "platform_admin",
);
assert.equal(
  classifyLivePresencePortal({
    isPlatformAdmin: false,
    isSeller: true,
    isAppCustomer: true,
  }),
  "seller",
);
assert.equal(
  classifyLivePresencePortal({
    isPlatformAdmin: false,
    isSeller: false,
    isAppCustomer: true,
  }),
  "app_customer",
);
assert.equal(
  classifyLivePresencePortal({
    isPlatformAdmin: false,
    isSeller: false,
    isAppCustomer: false,
  }),
  null,
);

assert.equal(
  assertClaimedPortalAllowed("seller", {
    isPlatformAdmin: false,
    isSeller: true,
    isAppCustomer: true,
  }),
  true,
);
assert.equal(
  assertClaimedPortalAllowed("platform_admin", {
    isPlatformAdmin: false,
    isSeller: true,
    isAppCustomer: true,
  }),
  false,
);

// Overlapping roles must not inflate signed-in via sum.
assert.equal(
  distinctSignedInCount({
    appCustomerUserIds: ["u1", "u2"],
    sellerUserIds: ["u2", "u3"],
    platformAdminUserIds: ["u3"],
  }),
  3,
);

console.log("live-presence/classify.test.ts: ok");
