import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildSoftwareCatalogViewModel,
  CANONICAL_HOSTS_PACK_KEY,
  computeSoftwareCatalogPartial,
} from "@/lib/app-portal/software-catalog/adapter";
import {
  isTechnicalIdentifier,
  resolveCustomerFacingModuleName,
  resolveModuleCatalogStatus,
  unwrapBusinessPackIdentityPayload,
} from "@/lib/app-portal/software-catalog/module-presentation";

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
          {
            module_key: "support_ai",
            module_name: "Support",
            enabled: true,
            licensed: true,
            status: "enabled",
          },
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
    const currentPackageCard = view.items.find((item) => item.id === "package:business");
    assert.equal(currentPackageCard?.valueProposition, "Operations package");
    assert.notEqual(
      currentPackageCard?.valueProposition,
      "Operational clarity for growing teams",
      "English backend positioning must not override package copy"
    );

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

  it("hides raw module keys and never marks available as included", () => {
    const view = buildSoftwareCatalogViewModel({
      billingRaw: {
        has_customer: true,
        current_package: {
          package_key: "starter",
          package_name: "Aipify Starter",
          description: "",
          features: [],
        },
      },
      modulesRaw: {
        has_customer: true,
        installed_modules: [
          { module_key: "additional_automation", licensed: true, enabled: true, status: "enabled" },
          { module_key: "admin_assistant_engine", licensed: true, enabled: true, status: "enabled" },
          {
            module_key: "support_ai",
            module_name: "Support Specialist",
            licensed: true,
            enabled: true,
            status: "enabled",
          },
        ],
        available_modules: [
          { module_key: "advanced_analytics", licensed: false },
          { module_key: "insights", module_name: "Insights" },
        ],
      },
      identityDashboardRaw: { has_access: true, packs: [] },
    });

    assert.equal(
      view.items.some((item) => item.name === "additional_automation"),
      false
    );
    assert.equal(
      view.items.some((item) => item.canonicalKey === "admin_assistant_engine"),
      false
    );
    assert.ok(view.items.some((item) => item.canonicalKey === "support_ai"));
    const insights = view.items.find((item) => item.canonicalKey === "insights");
    assert.equal(insights?.status, "available");
    assert.equal(insights?.included, false);
    assert.equal(view.sections.businessPacks, false);
    assert.equal(view.partial, false);
  });

  it("unwraps hosts landing identity and soft-fails empty packs without hard partial", () => {
    const view = buildSoftwareCatalogViewModel({
      billingRaw: {
        has_customer: true,
        current_package: {
          package_key: "starter",
          package_name: "Aipify Starter",
          description: "",
          features: [],
        },
      },
      modulesRaw: { has_customer: true },
      identityDashboardRaw: { has_access: false, packs: [] },
      hostsLandingRaw: {
        found: true,
        identity: {
          pack_key: CANONICAL_HOSTS_PACK_KEY,
          pack_name: "Aipify Hosts",
          status: "active",
          short_description: "Hospitality pack",
          features: ["Property operations"],
          landing_route: "/app/marketplace/packs/aipify_hosts",
        },
      },
    });
    assert.ok(view.sections.businessPacks);
    assert.ok(view.items.some((item) => item.canonicalKey === CANONICAL_HOSTS_PACK_KEY));
    assert.equal(view.partial, false);
  });

  it("marks unavailable packs without hard partial for empty identity", () => {
    const view = buildSoftwareCatalogViewModel({
      billingRaw: {
        has_customer: true,
        current_package: {
          package_key: "starter",
          package_name: "Aipify Starter",
          description: "",
          features: [],
        },
      },
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
    assert.ok(view.diagnostics.includes("aipify_hosts_unavailable"));
    const commerce = view.items.find((item) => item.canonicalKey === "aipify_commerce");
    assert.equal(commerce?.status, "unavailable");
    assert.equal(computeSoftwareCatalogPartial(view.diagnostics), false);
  });

  it("applies localized package copy when provided", () => {
    const view = buildSoftwareCatalogViewModel({
      billingRaw: {
        has_customer: true,
        current_package: {
          package_key: "business",
          package_name: "Aipify Business",
          description: "English only",
          features: [],
        },
      },
      modulesRaw: { has_customer: true },
      identityDashboardRaw: { has_access: true, packs: [] },
      localizePackage: (key) =>
        key === "business"
          ? {
              name: "Aipify Business",
              description: "For organisasjoner med ansatte og interne prosesser.",
            }
          : null,
    });
    assert.equal(
      view.currentPackage?.description,
      "For organisasjoner med ansatte og interne prosesser."
    );
  });

  it("localizes starter features and hides unknown technical labels", () => {
    const view = buildSoftwareCatalogViewModel({
      billingRaw: {
        has_customer: true,
        current_package: {
          package_key: "starter",
          package_name: "Aipify Starter",
          description: "English starter",
          features: ["Install Engine", "FAQ Knowledge", "plain language feature", "raw.feature_key"],
        },
        positioning: "Backend positioning must stay hidden",
      },
      modulesRaw: { has_customer: true },
      identityDashboardRaw: { has_access: true, packs: [] },
      localizePackage: (key) =>
        key === "starter"
          ? {
              name: "Aipify Starter",
              description: "For virksomheter som starter med Aipify — supportassistanse og FAQ-kunnskap.",
            }
          : null,
      localizeFeature: (feature) => {
        if (feature === "Install Engine") return "Veiledet installasjon";
        if (feature === "FAQ Knowledge") return "FAQ-kunnskap";
        return null;
      },
    });
    const card = view.items.find((item) => item.id === "package:starter");
    assert.equal(
      card?.description,
      "For virksomheter som starter med Aipify — supportassistanse og FAQ-kunnskap."
    );
    assert.equal(card?.valueProposition, card?.description);
    assert.deepEqual(card?.features, [
      "Veiledet installasjon",
      "FAQ-kunnskap",
      "plain language feature",
    ]);
  });
});

describe("module presentation entitlement badges", () => {
  it("detects technical identifiers", () => {
    assert.equal(isTechnicalIdentifier("additional_automation"), true);
    assert.equal(isTechnicalIdentifier("admin_assistant_engine"), true);
    assert.equal(isTechnicalIdentifier("aipify_companion_presence"), true);
    assert.equal(isTechnicalIdentifier("Support Specialist"), false);
  });

  it("hides missing display names", () => {
    assert.equal(
      resolveCustomerFacingModuleName({ moduleKey: "advanced_analytics" }),
      null
    );
    assert.equal(
      resolveCustomerFacingModuleName({
        moduleKey: "support_ai",
        localizedName: "Support Specialist",
      }),
      "Support Specialist"
    );
  });

  it("included only with canonical licensed+enabled proof", () => {
    assert.equal(
      resolveModuleCatalogStatus({
        licensed: true,
        enabled: true,
        status: "enabled",
      }).status,
      "included"
    );
    assert.equal(
      resolveModuleCatalogStatus({ licensed: false, enabled: false }).status,
      "available"
    );
    assert.equal(
      resolveModuleCatalogStatus({ licensed: true, enabled: false, status: "enabled" }).status,
      "unavailable"
    );
    assert.equal(
      resolveModuleCatalogStatus({ status: "pending_activation" }).status,
      "pending_approval"
    );
    assert.equal(resolveModuleCatalogStatus({}).status, "unavailable");
  });

  it("unwraps nested identity landing payloads", () => {
    const identity = unwrapBusinessPackIdentityPayload({
      found: true,
      identity: { pack_key: "aipify_hosts", pack_name: "Aipify Hosts" },
    });
    assert.equal(identity?.pack_key, "aipify_hosts");
  });
});
