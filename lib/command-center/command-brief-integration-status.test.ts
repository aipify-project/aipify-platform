import assert from "node:assert/strict";
import type { AppPortalIntegrationConnection } from "@/lib/app-portal/integrations/types";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";
import {
  buildCommandBriefIntegrationStatus,
  mapAppPortalConnectionToIntegrationStatus,
} from "./command-brief-integration-status";

function shopifyConnection(
  overrides: Partial<AppPortalIntegrationConnection> = {}
): AppPortalIntegrationConnection {
  return {
    id: "conn-shopify",
    provider_key: "shopify",
    setup_type: "manual",
    status: "active",
    permission_level: "read_only",
    approved_scopes: ["read_products"],
    masked_credential_hint: "••••",
    last_test_success_at: "2026-06-20T12:00:00Z",
    last_test_failed_at: null,
    last_test_error: null,
    activated_at: "2026-06-20T11:00:00Z",
    deactivated_at: null,
    removed_at: null,
    ...overrides,
  };
}

const activeShopify = mapAppPortalConnectionToIntegrationStatus(shopifyConnection(), "Shopify");
assert.ok(activeShopify, "active Shopify connection is visible");
assert.equal(activeShopify?.title, "Shopify");
assert.equal(activeShopify?.status, "connected_verified");
assert.equal(activeShopify?.href, "/app/platform/integrations/connect/shopify");

const deactivatedShopify = mapAppPortalConnectionToIntegrationStatus(
  shopifyConnection({
    status: "inactive",
    activated_at: "2026-06-20T11:00:00Z",
    deactivated_at: "2026-06-20T13:00:00Z",
  }),
  "Shopify"
);
assert.ok(deactivatedShopify);
assert.equal(deactivatedShopify?.status, "not_activated");

assert.equal(
  mapAppPortalConnectionToIntegrationStatus(
    shopifyConnection({ removed_at: "2026-06-20T14:00:00Z" }),
    "Shopify"
  ),
  null
);

const demoSeedCenter: ExecutiveCommandCenter = {
  found: true,
  business_packs: [
    {
      pack_key: "support",
      pack_title: "Support Pack",
      summary: "Support Pack → Customer Events.",
      events_count: 12,
      alerts_count: 1,
    },
  ],
};

assert.equal(buildCommandBriefIntegrationStatus(demoSeedCenter).items.length, 0);

const merged = buildCommandBriefIntegrationStatus(demoSeedCenter, {
  connections: [
    shopifyConnection(),
    shopifyConnection({ id: "conn-shopify-dup" }),
  ],
  providerDisplayNames: { shopify: "Shopify" },
});
assert.equal(merged.items.length, 1);
assert.equal(merged.items[0]?.packKey, "shopify");

const withHostsPack: ExecutiveCommandCenter = {
  found: true,
  business_packs: [
    {
      pack_key: "hosts",
      pack_title: "Aipify Hosts",
      summary: "Guest operations pack is active.",
      events_count: 4,
      alerts_count: 0,
    },
  ],
};

const hostsAndShopify = buildCommandBriefIntegrationStatus(withHostsPack, {
  connections: [shopifyConnection()],
  providerDisplayNames: { shopify: "Shopify" },
});
assert.equal(hostsAndShopify.items.length, 2);

console.log("command-brief-integration-status.test.ts: all assertions passed");
