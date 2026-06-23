import assert from "node:assert/strict";
import { canvaArtifactHandoffAdapter } from "./artifact-handoff-adapter";
import {
  CANVA_HANDOFF_READINESS,
  resolveCanvaHandoffAction,
} from "./connect-capabilities-audit";
import {
  getExternalArtifactHandoffAdapter,
  getExternalArtifactHandoffProviderReadiness,
} from "@/lib/integration-intelligence/external-artifact-handoff/registry";

assert.equal(CANVA_HANDOFF_READINESS, "partial");
assert.equal(resolveCanvaHandoffAction("image/png"), "artifact.handoff.asset_upload");
assert.equal(resolveCanvaHandoffAction("application/pdf"), "artifact.handoff.design_import");
assert.equal(resolveCanvaHandoffAction("text/plain"), null);

assert.equal(getExternalArtifactHandoffProviderReadiness("canva", false), "partial");
assert.equal(getExternalArtifactHandoffProviderReadiness("canva", true), "adapter_available");
assert.equal(getExternalArtifactHandoffProviderReadiness("unknown"), "adapter_missing");

const previewDisconnected = canvaArtifactHandoffAdapter.buildPreview({
  attachment_id: "att-1",
  conversation_id: "conv-1",
  filename: "logo.png",
  mime_type: "image/png",
  category: "image",
  byte_size: 1024,
  connection_connected: false,
});
assert.equal(previewDisconnected.adapter_readiness, "partial");
assert.equal(previewDisconnected.handoff_action, "artifact.handoff.asset_upload");

const previewConnected = canvaArtifactHandoffAdapter.buildPreview({
  attachment_id: "att-1",
  conversation_id: "conv-1",
  filename: "logo.png",
  mime_type: "image/png",
  category: "image",
  byte_size: 1024,
  connection_connected: true,
});
assert.equal(previewConnected.adapter_readiness, "adapter_available");

const baseExecuteInput = {
  provider_key: "canva",
  attachment_id: "att-1",
  conversation_id: "conv-1",
  user_id: "user-1",
  tenant_id: "tenant-1",
  company_id: "company-1",
  filename: "logo.png",
  mime_type: "image/png",
  file_bytes: Buffer.from("fake"),
};

async function runCanvaArtifactHandoffAdapterTests() {
  const noConsent = await canvaArtifactHandoffAdapter.execute({
    ...baseExecuteInput,
    consent_granted: false,
    access_token: "token",
  });
  assert.equal(noConsent.ok, false);
  assert.equal(noConsent.status, "consent_required");

  const noToken = await canvaArtifactHandoffAdapter.execute({
    ...baseExecuteInput,
    consent_granted: true,
    access_token: null,
  });
  assert.equal(noToken.ok, false);
  assert.equal(noToken.status, "connection_missing");

  const unsupported = await canvaArtifactHandoffAdapter.execute({
    ...baseExecuteInput,
    mime_type: "text/plain",
    consent_granted: true,
    access_token: "token",
  });
  assert.equal(unsupported.ok, false);
  assert.equal(unsupported.status, "unsupported_artifact");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes("/asset-uploads") && !url.includes("/asset-uploads/")) {
      return new Response(
        JSON.stringify({
          job: { id: "job-1", status: "success" },
          asset: { id: "asset-abc" },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ message: "unexpected" }), { status: 500 });
  };

  try {
    const success = await canvaArtifactHandoffAdapter.execute({
      ...baseExecuteInput,
      consent_granted: true,
      access_token: "token",
    });
    assert.equal(success.ok, true);
    assert.equal(success.status, "success");
    assert.equal(success.external_reference, "asset-abc");
    assert.match(String(success.open_url), /canva\.com/);

    globalThis.fetch = async () =>
      new Response(JSON.stringify({ message: "rejected" }), { status: 403 });

    const failure = await canvaArtifactHandoffAdapter.execute({
      ...baseExecuteInput,
      consent_granted: true,
      access_token: "token",
    });
    assert.equal(failure.ok, false);
    assert.equal(failure.status, "failed");
    assert.equal(failure.external_reference, null);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

void runCanvaArtifactHandoffAdapterTests().then(() => {
  assert.equal(getExternalArtifactHandoffAdapter("canva")?.provider_key, "canva");
  console.log("providers/canva/artifact-handoff-adapter.test.ts: all assertions passed");
});
