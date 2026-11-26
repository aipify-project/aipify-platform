import assert from "node:assert/strict";
import {
  filterCspMessageRecipients,
  isCspMessageRecipientEligible,
  parseCspMessageRecipients,
  recipientDisplayLabel,
} from "./message-recipient-picker.ts";

async function main() {
  const rows = parseCspMessageRecipients({
    partners: [
      {
        id: "11111111-1111-4111-8111-111111111111",
        display_name: "Ada Seller",
        status: "approved",
        country: "NO",
      },
      { id: "not-a-uuid", display_name: "Bad", status: "approved" },
      {
        id: "22222222-2222-4222-8222-222222222222",
        displayName: "Camel",
        status: "suspended",
      },
    ],
  });
  assert.equal(rows.length, 2);
  assert.equal(rows[0]?.displayName, "Ada Seller");
  assert.equal(rows[1]?.displayName, "Camel");

  assert.equal(isCspMessageRecipientEligible("approved"), true);
  assert.equal(isCspMessageRecipientEligible("active"), true);
  assert.equal(isCspMessageRecipientEligible("certified"), true);
  assert.equal(isCspMessageRecipientEligible("in_academy"), true);
  assert.equal(isCspMessageRecipientEligible("suspended"), false);
  assert.equal(isCspMessageRecipientEligible("rejected"), false);
  assert.equal(isCspMessageRecipientEligible("under_review"), false);

  const recipients = parseCspMessageRecipients({
    partners: [
      {
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        display_name: "Nora Nord",
        status: "approved",
        country: "NO",
      },
      {
        id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
        display_name: "Sven Syd",
        status: "suspended",
        country: "SE",
      },
    ],
  });
  assert.equal(filterCspMessageRecipients(recipients, "nora").length, 1);
  assert.equal(filterCspMessageRecipients(recipients, "suspended").length, 1);
  assert.equal(filterCspMessageRecipients(recipients, "se").length, 1);
  assert.equal(filterCspMessageRecipients(recipients, "bbbbbbbb").length, 1);
  assert.equal(filterCspMessageRecipients(recipients, "zzzz").length, 0);

  assert.equal(
    recipientDisplayLabel(
      {
        id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
        displayName: null,
        status: "approved",
        country: null,
      },
      "Unnamed seller",
    ),
    "Unnamed seller",
  );

  console.log("message-recipient-picker tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
