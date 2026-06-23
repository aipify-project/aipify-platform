import assert from "node:assert/strict";
import { assertAttachmentTenantAccess, isAttachmentUsableForModel } from "./permissions";

const denied = assertAttachmentTenantAccess(
  {
    attachment_id: "a1",
    conversation_id: "conv-1",
  },
  {
    company_id: "tenant-a",
    user_id: "user-a",
    conversation_id: "conv-1",
    attachment_company_id: "tenant-b",
    attachment_user_id: "user-a",
  },
);
assert.equal(denied.allowed, false);
if (!denied.allowed) assert.equal(denied.code, "tenant_mismatch");

const allowed = assertAttachmentTenantAccess(
  {
    attachment_id: "a1",
    conversation_id: "conv-1",
  },
  {
    company_id: "tenant-a",
    user_id: "user-a",
    conversation_id: "conv-1",
    attachment_company_id: "tenant-a",
    attachment_user_id: "user-a",
  },
);
assert.equal(allowed.allowed, true);
assert.equal(isAttachmentUsableForModel("approved"), true);
assert.equal(isAttachmentUsableForModel("pending"), false);

console.log("artifact-context/permissions.test.ts: all assertions passed");
