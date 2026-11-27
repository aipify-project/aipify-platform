import assert from "node:assert/strict";
import { parsePlatformPrimaryContactWriteInput } from "./customer-primary-contact-write";

const ID = "11111111-1111-4111-8111-111111111111";

{
  const bad = parsePlatformPrimaryContactWriteInput("nope", {});
  assert.equal(bad.ok, false);
}

{
  const bad = parsePlatformPrimaryContactWriteInput(ID, {
    fullName: "Ada",
    confirmation: false,
    internalReason: "customer moved",
  });
  assert.equal(bad.ok, false);
  if (!bad.ok) assert.equal(bad.code, "confirmation_required");
}

{
  const ok = parsePlatformPrimaryContactWriteInput(ID, {
    fullName: "Ada Lovelace",
    phone: "+4712345678",
    confirmation: true,
    internalReason: "Support ticket SUP-1234 — phone change",
    supportTicketReference: "SUP-1234",
  });
  assert.equal(ok.ok, true);
  if (ok.ok) {
    assert.equal(ok.value.fullName, "Ada Lovelace");
    assert.equal(ok.value.phone, "+4712345678");
    assert.equal(ok.value.supportTicketReference, "SUP-1234");
  }
}

{
  const badPhone = parsePlatformPrimaryContactWriteInput(ID, {
    phone: "123",
    confirmation: true,
    internalReason: "fix phone",
  });
  assert.equal(badPhone.ok, false);
  if (!badPhone.ok) assert.equal(badPhone.code, "invalid_phone");
}

console.log("customer-primary-contact-write.test.ts: ok");
