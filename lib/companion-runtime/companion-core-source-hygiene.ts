import assert from "node:assert/strict";
import { findForbiddenCustomerNamesInText } from "./companion-core-customer-name-invariant";

/** Assert Core production sources contain no customer/pilot names. */
export function assertCoreSourceFreeOfCustomerPilotNames(source: string, label: string): void {
  const found = findForbiddenCustomerNamesInText(source);
  assert.equal(
    found.length,
    0,
    `${label} must not contain customer/pilot names (${found.join(", ")})`,
  );
}
