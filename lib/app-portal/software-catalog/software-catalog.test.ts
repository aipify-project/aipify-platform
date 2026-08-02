import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSoftwareCatalogViewModel,
  CANONICAL_HOSTS_PACK_KEY,
} from "@/lib/app-portal/software-catalog/adapter";

describe("software catalog adapter", () => {
  it("maps packages modules and aipify_hosts without inventing prices", () => {
    const view = buildSoftwareCatalogViewModel({
      billingRaw: {
        has_customer: true,
        current_package: {
          package_key: "business",
          package_name: "Aipify Business",
          description: "Operations package",
          features: ["Support", "Knowledge"],
        },
        upgrade_options: [
          {
            package_key: "enterprise",
            package_name: "Aipify Enterprise",
            description: "Enterprise operations",
          },
        ],
        positioning: "Operational clarity for growing teams",
      },
      modulesRaw: {
        has_customer: true,
        current_package: "business",
        installed_modules: [
          { module_key: "support_ai", module_name: "Support", enabled: true, licensed: true },
        ],
        available_modules: [
          { module_key: "insights", module_name: "Insights", description: "Analytics module" },
        ],
      },
      identityDashboardRaw: {
        has_access: true,
        packs: [
          {
            pack_key: CANONICAL_HOSTS_PACK_KEY,
            pack_name: "Aipify Hosts",
            pack_category: "hospitality",
            status: "active",
            short_description: "Hospitality operations Business Pack",
            business_value_statement: "Run short-term rental operations with clarity",
            features: ["Property operations", "Guest communications"],
            landing_route: "/app/marketplace/packs/aipify_hosts",
            licensing_summary: "Capacity licensing",
          },
        ],
      },
      activationGates: [
        {
          pack_key: CANONICAL_HOSTS_PACK_KEY,
          activation_status: "pending_activation",
        },
      ],
    });

    assert.equal(view.found, true);
    assert.equal(view.referencePackKey, "aipify_hosts");
    assert.equal(view.currentPackage?.packageKey, "business");
    assert.ok(view.items.every((item) => item.price === null));

    const hosts = view.items.find((item) => item.canonicalKey === CANONICAL_HOSTS_PACK_KEY);
    assert.ok(hosts);
    assert.equal(hosts?.sourceType, "business_pack");
    assert.equal(hosts?.name, "Aipify Hosts");
    assert.equal(hosts?.status, "pending_approval");
    assert.equal(hosts?.detailsRoute, "/app/marketplace/packs/aipify_hosts");
    assert.doesNotMatch(JSON.stringify(hosts), /Airbnb Operations/);

    const enterprise = view.items.find((item) => item.canonicalKey === "enterprise");
    assert.equal(enterprise?.status, "available");
    const support = view.items.find((item) => item.canonicalKey === "support_ai");
    assert.equal(support?.status, "included");
  });

  it("marks unavailable packs and reports missing hosts diagnostics", () => {
    const view = buildSoftwareCatalogViewModel({
      billingRaw: { has_customer: true, current_package: {
        package_key: "starter",
        package_name: "Aipify Starter",
        description: "",
        features: [],
      } },
      modulesRaw: { has_customer: true },
      identityDashboardRaw: {
        has_access: true,
        packs: [
          {
            pack_key: "aipify_commerce",
            pack_name: "Aipify Commerce",
            status: "coming_soon",
            short_description: "Commerce pack",
          },
        ],
      },
    });
    assert.ok(view.diagnostics.includes("aipify_hosts_missing_from_identity"));
    const commerce = view.items.find((item) => item.canonicalKey === "aipify_commerce");
    assert.equal(commerce?.status, "unavailable");
  });
});
