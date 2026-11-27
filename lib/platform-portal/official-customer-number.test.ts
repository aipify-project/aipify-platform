import assert from "node:assert/strict";
import test from "node:test";
import { readOfficialCustomerNumber } from "./official-customer-number";

test("official customer number accepts only AIP-######", () => {
  assert.equal(readOfficialCustomerNumber("aip-000042"), "AIP-000042");
  assert.equal(readOfficialCustomerNumber("  AIP-000001  "), "AIP-000001");
  assert.equal(readOfficialCustomerNumber("11111111-1111-4111-8111-111111111111"), null);
  assert.equal(readOfficialCustomerNumber("AIP-INV-000001"), null);
  assert.equal(readOfficialCustomerNumber("AIP-1"), null);
  assert.equal(readOfficialCustomerNumber(null), null);
});
