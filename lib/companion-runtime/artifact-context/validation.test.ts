import assert from "node:assert/strict";
import { COMPANION_ATTACHMENT_MAX_BYTES } from "./constants";
import {
  validateCompanionAttachmentFile,
  validateAttachmentBatchCount,
  isAllowedAttachmentMime,
} from "./validation";

assert.equal(
  validateCompanionAttachmentFile({
    filename: "logo.png",
    mime_type: "image/png",
    byte_size: 1024,
  }).ok,
  true,
);

assert.equal(
  validateCompanionAttachmentFile({
    filename: "",
    mime_type: "image/png",
    byte_size: 1024,
  }).ok,
  false,
);

assert.equal(
  validateCompanionAttachmentFile({
    filename: "big.pdf",
    mime_type: "application/pdf",
    byte_size: COMPANION_ATTACHMENT_MAX_BYTES + 1,
  }).ok,
  false,
);

assert.equal(isAllowedAttachmentMime("application/x-msdownload"), false);
assert.equal(isAllowedAttachmentMime("text/plain"), true);
assert.equal(validateAttachmentBatchCount(4, 1), true);
assert.equal(validateAttachmentBatchCount(5, 1), false);

console.log("artifact-context/validation.test.ts: all assertions passed");
