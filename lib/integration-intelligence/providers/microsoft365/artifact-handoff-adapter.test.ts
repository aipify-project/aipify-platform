import assert from "node:assert/strict";
import {
  microsoftExcelArtifactHandoffAdapter,
  microsoftPowerpointArtifactHandoffAdapter,
  microsoftWordArtifactHandoffAdapter,
} from "./artifact-handoff-adapter";
import {
  MICROSOFT365_HANDOFF_READINESS,
  resolveMicrosoft365HandoffAction,
} from "./connect-capabilities-audit";
import {
  getExternalArtifactHandoffAdapter,
  getExternalArtifactHandoffProviderReadiness,
} from "@/lib/integration-intelligence/external-artifact-handoff/registry";

assert.equal(MICROSOFT365_HANDOFF_READINESS, "partial");
assert.equal(
  resolveMicrosoft365HandoffAction(
    "microsoft_word",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ),
  "artifact.handoff.onedrive_upload",
);
assert.equal(
  resolveMicrosoft365HandoffAction("microsoft_excel", "text/csv"),
  "artifact.handoff.onedrive_upload",
);
assert.equal(resolveMicrosoft365HandoffAction("microsoft_word", "text/plain"), "artifact.handoff.onedrive_upload");

assert.equal(getExternalArtifactHandoffProviderReadiness("microsoft_word", false), "partial");
assert.equal(getExternalArtifactHandoffProviderReadiness("microsoft_word", true), "adapter_available");

const previewDisconnected = microsoftWordArtifactHandoffAdapter.buildPreview({
  attachment_id: "att-1",
  conversation_id: "conv-1",
  filename: "Brief.docx",
  mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  category: "document",
  byte_size: 1024,
  connection_connected: false,
});
assert.equal(previewDisconnected.adapter_readiness, "partial");
assert.equal(previewDisconnected.handoff_action, "artifact.handoff.onedrive_upload");
assert.equal(previewDisconnected.requires_explicit_consent, true);

const baseExecuteInput = {
  provider_key: "microsoft_word",
  attachment_id: "att-1",
  conversation_id: "conv-1",
  user_id: "user-1",
  tenant_id: "tenant-1",
  company_id: "company-1",
  filename: "Brief.docx",
  mime_type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  file_bytes: Buffer.from("docx-bytes"),
};

async function runMicrosoft365AdapterTests() {
  const noConsent = await microsoftWordArtifactHandoffAdapter.execute({
    ...baseExecuteInput,
    consent_granted: false,
    access_token: "token",
  });
  assert.equal(noConsent.ok, false);
  assert.equal(noConsent.status, "consent_required");

  const noToken = await microsoftWordArtifactHandoffAdapter.execute({
    ...baseExecuteInput,
    consent_granted: true,
    access_token: null,
  });
  assert.equal(noToken.ok, false);
  assert.equal(noToken.status, "connection_missing");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/me/drive/root:/") && url.endsWith(":/content")) {
      return new Response(
        JSON.stringify({
          id: "item-word-1",
          name: "Brief.docx",
          webUrl: "https://onedrive.live.com/edit?id=item-word-1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ message: "unexpected" }), { status: 500 });
  };

  try {
    const success = await microsoftWordArtifactHandoffAdapter.execute({
      ...baseExecuteInput,
      consent_granted: true,
      access_token: "token",
    });
    assert.equal(success.ok, true);
    assert.equal(success.status, "success");
    assert.equal(success.external_reference, "item-word-1");
    assert.match(String(success.open_url), /onedrive/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

void runMicrosoft365AdapterTests().then(() => {
  assert.equal(getExternalArtifactHandoffAdapter("microsoft_word")?.provider_key, "microsoft_word");
  assert.equal(getExternalArtifactHandoffAdapter("microsoft_excel")?.provider_key, "microsoft_excel");
  assert.equal(
    getExternalArtifactHandoffAdapter("microsoft_powerpoint")?.provider_key,
    "microsoft_powerpoint",
  );
  assert.equal(microsoftExcelArtifactHandoffAdapter.provider_key, "microsoft_excel");
  assert.equal(microsoftPowerpointArtifactHandoffAdapter.provider_key, "microsoft_powerpoint");
  console.log("providers/microsoft365/artifact-handoff-adapter.test.ts: all assertions passed");
});
