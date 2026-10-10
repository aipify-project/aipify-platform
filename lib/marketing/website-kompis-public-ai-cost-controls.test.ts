import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: { _load: (request: string, parent: unknown, isMain: boolean) => unknown };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") return {};
    return originalLoad.call(this, request, parent, isMain);
  };
}

installServerOnlyShim();

async function main() {
  const askSource = readFileSync(
    path.join(root, "lib/marketing/public-companion-ask.ts"),
    "utf8",
  );

  assert.equal(
    /groundedCostControls\s*=\s*isPreviewEnv\s*\?\s*["']off["']/.test(askSource),
    false,
    "Preview must not set costControls=off for public embed",
  );
  assert.match(askSource, /reserveWebsiteKompisPublicAiCostControls/);
  assert.match(askSource, /costControls:\s*["']public_required["']/);
  assert.doesNotMatch(
    askSource,
    /ALLOWED_REQUEST_KEYS[\s\S]{0,400}costControls/,
    "costControls must not be a public request body key",
  );

  const {
    reserveWebsiteKompisPublicAiCostControls,
    WEBSITE_KOMPIS_PUBLIC_AI_COST_RPC_RESERVE,
  } = await import("./website-kompis-public-ai-cost-controls");

  assert.equal(
    WEBSITE_KOMPIS_PUBLIC_AI_COST_RPC_RESERVE,
    "reserve_website_kompis_public_ai_call",
  );

  const denied = await reserveWebsiteKompisPublicAiCostControls({
    visitorContext: { installId: null, domain: null },
  });
  assert.equal(denied.allowed, false);
  if (!denied.allowed) {
    assert.equal(denied.reason, "untrusted_binding");
  }

  process.env.NODE_ENV = "test";
  const harness = await reserveWebsiteKompisPublicAiCostControls({
    visitorContext: { installId: null, domain: null },
    testHarnessAllow: true,
  });
  assert.equal(harness.allowed, true);

  console.log("ok website-kompis-public-ai-cost-controls");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
