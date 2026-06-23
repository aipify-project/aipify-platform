import assert from "node:assert/strict";
import {
  detectArtifactReferenceIntent,
  resolveActiveArtifactReference,
  selectDefaultActiveArtifact,
} from "./resolution";
import type { CompanionConversationAttachment } from "./types";

const sampleAttachments: CompanionConversationAttachment[] = [
  {
    attachment_id: "a-old",
    conversation_id: "conv-1",
    original_filename: "old-logo.png",
    mime_type: "image/png",
    category: "image",
    byte_size: 1000,
    security_status: "approved",
    provenance_source: "file_picker",
    created_at: "2026-01-01T10:00:00.000Z",
    preview_available: true,
  },
  {
    attachment_id: "a-new",
    conversation_id: "conv-1",
    original_filename: "new-logo.png",
    mime_type: "image/png",
    category: "image",
    byte_size: 2000,
    security_status: "approved",
    provenance_source: "drag_drop",
    created_at: "2026-01-02T10:00:00.000Z",
    preview_available: true,
  },
];

assert.equal(detectArtifactReferenceIntent("Can you use this logo?"), "this_logo");
assert.equal(detectArtifactReferenceIntent("bruk dette bildet"), "this_image");

const active = selectDefaultActiveArtifact(sampleAttachments);
assert.equal(active?.attachment_id, "a-new");

const resolved = resolveActiveArtifactReference({
  query: "Use this image in the header",
  activeArtifact: active,
  attachments: sampleAttachments,
});
assert.equal(resolved.attachment_id, "a-new");
assert.equal(resolved.confidence, "high");

const explicit = resolveActiveArtifactReference({
  query: "Use this image",
  activeArtifact: active,
  attachments: sampleAttachments,
  explicitAttachmentId: "a-old",
});
assert.equal(explicit.attachment_id, "a-old");
assert.equal(explicit.kind, "explicit_id");

console.log("artifact-context/resolution.test.ts: all assertions passed");
