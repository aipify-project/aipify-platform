import assert from "node:assert/strict";
import path from "node:path";
import { findForbiddenCustomerNamesInText } from "./companion-core-customer-name-scan";
import { loadForbiddenCustomerPilotNames } from "./forbidden-customer-pilot-names";

const DEFAULT_REPO_ROOT = path.join(import.meta.dirname, "..", "..");

/** Certification-layer check — Core sources must not contain customer/pilot names. */
export function assertCoreSourceFreeOfCustomerPilotNames(
  source: string,
  label: string,
  repoRoot: string = DEFAULT_REPO_ROOT,
): void {
  const found = findForbiddenCustomerNamesInText(source, loadForbiddenCustomerPilotNames(repoRoot));
  assert.equal(
    found.length,
    0,
    `${label} must not contain customer/pilot names (${found.join(", ")})`,
  );
}
