import assert from "node:assert/strict";
import {
  resolvePreferencesLoadErrorMessage,
  type NotificationPreferencesLoadError,
} from "@/lib/app/notifications/load-notification-preferences";

const messages = {
  organizationMissing: "Org missing",
  pageLoadError: "Page load error",
  accessDenied: "Access denied",
  subscriptionRequired: "Subscription required",
  permissionMissing: "Permission missing",
  entitlementLocked: "Entitlement locked",
};

const cases: Array<[NotificationPreferencesLoadError, string]> = [
  ["organization_missing", messages.organizationMissing],
  ["permission_missing", messages.permissionMissing],
  ["page_load_error", messages.pageLoadError],
  ["subscription_required", messages.subscriptionRequired],
  ["entitlement_locked", messages.entitlementLocked],
  ["access_denied", messages.accessDenied],
];

for (const [error, expected] of cases) {
  assert.equal(resolvePreferencesLoadErrorMessage(error, messages), expected);
}

console.log("load-notification-preferences.test.ts passed");
