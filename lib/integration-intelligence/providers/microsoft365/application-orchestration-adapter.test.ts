import assert from "node:assert/strict";
import { executeMicrosoft365Action } from "./application-orchestration-adapter";
import { buildMicrosoft365DiscoverySnapshot } from "./graph-client";

async function runMicrosoft365OrchestrationTests() {
  const blocked = await executeMicrosoft365Action({
    application_key: "microsoft_word",
    operation: "create",
    consent_granted: false,
    access_token: "token",
  });
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reported_as_executed, false);
  assert.equal(blocked.failure_code, "consent_required");

  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input, init) => {
    const url = String(input);
    const method = init?.method ?? "GET";
    if (url.endsWith("/me")) {
      return new Response(
        JSON.stringify({ id: "user-1", displayName: "Test User", mail: "test@example.com" }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.endsWith("/me/drive")) {
      return new Response(JSON.stringify({ id: "drive-1" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (url.endsWith("/me/drive/root/children") && method === "POST") {
      return new Response(
        JSON.stringify({
          id: "item-create-1",
          name: "Document-2026-06-22.docx",
          webUrl: "https://onedrive.live.com/edit?id=item-create-1",
        }),
        { status: 201, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.includes("/me/drive/items/item-create-1/content") && method === "PUT") {
      return new Response(
        JSON.stringify({
          id: "item-create-1",
          name: "Document-2026-06-22.docx",
          webUrl: "https://onedrive.live.com/edit?id=item-create-1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    if (url.includes("/me/drive/items/item-open-1")) {
      return new Response(
        JSON.stringify({
          id: "item-open-1",
          name: "Existing.docx",
          webUrl: "https://onedrive.live.com/edit?id=item-open-1",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }
    return new Response(JSON.stringify({ message: "unexpected" }), { status: 500 });
  };

  try {
    const discovery = await buildMicrosoft365DiscoverySnapshot("token");
    assert.equal(discovery.ok, true);
    assert.equal(discovery.account?.email, "test@example.com");
    assert.equal(discovery.drive_available, true);
    assert.ok(discovery.capabilities.includes("document.create"));

    const created = await executeMicrosoft365Action({
      application_key: "microsoft_word",
      operation: "create",
      consent_granted: true,
      access_token: "token",
    });
    assert.equal(created.ok, true);
    assert.equal(created.reported_as_executed, true);
    assert.equal(created.external_reference, "item-create-1");
    assert.match(String(created.open_url), /onedrive/i);

    const opened = await executeMicrosoft365Action({
      application_key: "microsoft_word",
      operation: "open",
      consent_granted: true,
      access_token: "token",
      external_file_id: "item-open-1",
    });
    assert.equal(opened.ok, true);
    assert.equal(opened.external_reference, "item-open-1");
  } finally {
    globalThis.fetch = originalFetch;
  }
}

void runMicrosoft365OrchestrationTests().then(() => {
  console.log("providers/microsoft365/application-orchestration-adapter.test.ts: all assertions passed");
});
