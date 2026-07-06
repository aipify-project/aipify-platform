import assert from "node:assert/strict";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

function installServerOnlyShim(): void {
  const moduleApi = require("node:module") as {
    Module: {
      _load: (request: string, parent: unknown, isMain: boolean) => unknown;
    };
  };
  const originalLoad = moduleApi.Module._load;
  moduleApi.Module._load = function (request, parent, isMain) {
    if (request === "server-only") {
      return {};
    }
    return originalLoad.call(this, request, parent, isMain);
  };
}

installServerOnlyShim();

import { buildWebsiteKompisDomainSettingsView } from "@/lib/marketing/website-kompis-domain-settings";

function runWebsiteKompisDomainSettingsTests() {
  const locked = buildWebsiteKompisDomainSettingsView({
    record: {
      domainId: "22222222-2222-4222-8222-222222222222",
      domain: "example-b.test",
      verificationStatus: "verified",
      domainStatus: "active",
    },
    availability: {
      available: false,
      reason: "entitlement_missing",
      capabilityKey: "website_kompis",
    },
    canManage: false,
    installId: null,
    metadataOrigin: "https://aipify.ai",
  });

  assert.equal(locked.canManage, false);
  assert.equal(locked.availability.reason, "entitlement_missing");
  assert.equal(locked.metadataUrl, null);

  const editable = buildWebsiteKompisDomainSettingsView({
    record: {
      domainId: "33333333-3333-4333-8333-333333333333",
      domain: "example-c.test",
      verificationStatus: "verified",
      domainStatus: "active",
    },
    availability: {
      available: true,
      reason: "available",
      capabilityKey: "website_kompis",
    },
    canManage: true,
    installId: "11111111-1111-4111-8111-111111111111",
    metadataOrigin: "https://aipify.ai",
    rpcResult: {
      ok: true,
      install_id: "11111111-1111-4111-8111-111111111111",
      normalized_config: {
        enabled: true,
        iconVariant: "companion-purple-dark",
      },
    },
  });

  assert.equal(editable.canManage, true);
  assert.match(editable.metadataUrl ?? "", /launcher-icon\?installId=/);
  assert.equal(editable.config.iconVariant, "companion-purple-dark");
  assert.equal(Object.hasOwn(editable.config as unknown as Record<string, unknown>, "tenantId"), false);

  console.log("website-kompis-domain-settings.test.ts: all assertions passed");
}

runWebsiteKompisDomainSettingsTests();
