import type { AppStorePackListing } from "@/lib/app-store/types";
import type { BusinessPackActivationStatus } from "@/lib/business-pack-activation-gate";
import { formatPlanLabel } from "@/lib/core/plan-labels";
import type { Translator } from "@/lib/i18n/translate";

export type BusinessPackSettingsAccessState =
  | "active"
  | "no_installed_packs"
  | "plan_required"
  | "entitlement_missing"
  | "pending_activation"
  | "activation_failed"
  | "suspended"
  | "permission_missing"
  | "organization_context_missing"
  | "subscription_inactive"
  | "license_inactive"
  | "load_error";

export type BusinessPackSettingsPackRow = {
  pack_key: string;
  pack_name: string;
  pack_logo_url: string | null;
  short_description: string;
  version: string;
  display_status: string;
  display_status_key: string;
  activation_status: BusinessPackActivationStatus | null;
  installed_at: string | null;
  dependencies: string[];
  integrations: string[];
  access_summary: string;
  configure_href: string | null;
  workspace_route: string | null;
};

export type BusinessPackSettingsCenter = {
  found: boolean;
  access_state: BusinessPackSettingsAccessState;
  current_plan?: string;
  required_plan?: string;
  capability_summary?: string;
  upgrade_href?: string;
  return_href?: string;
  packs?: BusinessPackSettingsPackRow[];
  pending_pack_keys?: string[];
  failed_pack_keys?: string[];
};

const P = "customerApp.portalStructure.businessPackSettings";

export function buildBusinessPackSettingsLabels(t: Translator) {
  return {
    eyebrow: t(`${P}.eyebrow`),
    title: t(`${P}.title`),
    description: t(`${P}.description`),
    breadcrumbBusinessPacks: t(`${P}.breadcrumbBusinessPacks`),
    breadcrumbSettings: t(`${P}.breadcrumbSettings`),
    backToBusinessPacks: t(`${P}.backToBusinessPacks`),
    exploreAvailable: t(`${P}.exploreAvailable`),
    viewUpgradeOptions: t(`${P}.viewUpgradeOptions`),
    contactSales: t(`${P}.contactSales`),
    contactSupport: t(`${P}.contactSupport`),
    currentPlan: t(`${P}.currentPlan`),
    requiredPlan: t(`${P}.requiredPlan`),
    requiredPlanValue: t(`${P}.requiredPlanValue`),
    capabilitySummary: t(`${P}.capabilitySummary`),
    whatYouUnlock: t(`${P}.whatYouUnlock`),
    configure: t(`${P}.configure`),
    openWorkspace: t(`${P}.openWorkspace`),
    version: t(`${P}.version`),
    dependencies: t(`${P}.dependencies`),
    integrations: t(`${P}.integrations`),
    accessSummary: t(`${P}.accessSummary`),
    installedDate: t(`${P}.installedDate`),
    navRequiresUpgrade: t(`${P}.navRequiresUpgrade`),
    retry: t(`${P}.loadError.retry`),
    states: {
      planRequired: {
        title: t(`${P}.states.planRequired.title`),
        body: t(`${P}.states.planRequired.body`),
      },
      pendingActivation: {
        title: t(`${P}.states.pendingActivation.title`),
        body: t(`${P}.states.pendingActivation.body`),
      },
      activationFailed: {
        title: t(`${P}.states.activationFailed.title`),
        body: t(`${P}.states.activationFailed.body`),
      },
      suspended: {
        title: t(`${P}.states.suspended.title`),
        body: t(`${P}.states.suspended.body`),
      },
      noInstalledPacks: {
        title: t(`${P}.states.noInstalledPacks.title`),
        body: t(`${P}.states.noInstalledPacks.body`),
      },
      permissionMissing: {
        title: t(`${P}.states.permissionMissing.title`),
        body: t(`${P}.states.permissionMissing.body`),
      },
      organizationContextMissing: {
        title: t(`${P}.states.organizationContextMissing.title`),
        body: t(`${P}.states.organizationContextMissing.body`),
      },
      subscriptionInactive: {
        title: t(`${P}.states.subscriptionInactive.title`),
        body: t(`${P}.states.subscriptionInactive.body`),
      },
      licenseInactive: {
        title: t(`${P}.states.licenseInactive.title`),
        body: t(`${P}.states.licenseInactive.body`),
      },
      entitlementMissing: {
        title: t(`${P}.states.entitlementMissing.title`),
        body: t(`${P}.states.entitlementMissing.body`),
      },
    },
    valueCards: {
      packConfiguration: {
        title: t(`${P}.valueCards.packConfiguration.title`),
        description: t(`${P}.valueCards.packConfiguration.description`),
      },
      activationStatus: {
        title: t(`${P}.valueCards.activationStatus.title`),
        description: t(`${P}.valueCards.activationStatus.description`),
      },
      dependencies: {
        title: t(`${P}.valueCards.dependencies.title`),
        description: t(`${P}.valueCards.dependencies.description`),
      },
      accessManagement: {
        title: t(`${P}.valueCards.accessManagement.title`),
        description: t(`${P}.valueCards.accessManagement.description`),
      },
      healthValidation: {
        title: t(`${P}.valueCards.healthValidation.title`),
        description: t(`${P}.valueCards.healthValidation.description`),
      },
    },
    packStatus: {
      active: t(`${P}.packStatus.active`),
      activationInProgress: t(`${P}.packStatus.activationInProgress`),
      requiresAttention: t(`${P}.packStatus.requiresAttention`),
      activationFailed: t(`${P}.packStatus.activationFailed`),
      suspended: t(`${P}.packStatus.suspended`),
      updateAvailable: t(`${P}.packStatus.updateAvailable`),
    },
    loadError: {
      title: t(`${P}.loadError.title`),
      body: t(`${P}.loadError.body`),
      retry: t(`${P}.loadError.retry`),
    },
    planLabels: {
      starter: t("customerApp.portalStructure.planLabels.starter"),
      professional: t("customerApp.portalStructure.planLabels.professional"),
      growth: t("customerApp.portalStructure.planLabels.growth"),
      business: t("customerApp.portalStructure.planLabels.business"),
      enterprise: t("customerApp.portalStructure.planLabels.enterprise"),
      insights: t("customerApp.portalStructure.planLabels.insights"),
    },
  };
}

export type BusinessPackSettingsLabels = ReturnType<typeof buildBusinessPackSettingsLabels>;

export function formatBusinessPackSettingsPlanLabel(
  planKey: string | undefined,
  labels: BusinessPackSettingsLabels
): string {
  if (!planKey) return "";
  const normalized = planKey.trim().toLowerCase();
  const fromLabels = labels.planLabels[normalized as keyof typeof labels.planLabels];
  if (fromLabels) return fromLabels;
  return formatPlanLabel(planKey);
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function mapPackStatusKey(
  activationStatus: BusinessPackActivationStatus | null,
  cardStatus: string
): string {
  if (activationStatus === "pending_activation" || activationStatus === "validating") {
    return "activationInProgress";
  }
  if (activationStatus === "activation_failed") return "activationFailed";
  if (activationStatus === "suspended") return "suspended";
  if (cardStatus === "update_available") return "updateAvailable";
  if (cardStatus === "requires_attention") return "requiresAttention";
  if (activationStatus === "active" || cardStatus === "installed" || cardStatus === "active") {
    return "active";
  }
  return "active";
}

export function buildInstalledPackRows(
  listings: AppStorePackListing[],
  activationByPack: Map<string, BusinessPackActivationStatus>
): BusinessPackSettingsPackRow[] {
  return listings.map((listing) => {
    const activationStatus = activationByPack.get(listing.pack_key) ?? null;
    const displayStatusKey = mapPackStatusKey(activationStatus, listing.card_status);
    const modules = listing.included_modules.map((m) => m.module_name).filter(Boolean);
    return {
      pack_key: listing.pack_key,
      pack_name: listing.pack_name,
      pack_logo_url: listing.pack_logo_url,
      short_description: listing.short_description,
      version: listing.version,
      display_status: displayStatusKey,
      display_status_key: displayStatusKey,
      activation_status: activationStatus,
      installed_at: null,
      dependencies: modules.length > 0 ? modules : [],
      integrations: [],
      access_summary: listing.license_requirements,
      configure_href: `/app/business-packs/available?pack=${encodeURIComponent(listing.pack_key)}`,
      workspace_route: listing.workspace_route,
    };
  });
}

export function parseBusinessPackSettingsCenter(data: unknown): BusinessPackSettingsCenter | null {
  const row = asRecord(data);
  if (!row) return null;
  const accessState = String(row.access_state ?? "load_error") as BusinessPackSettingsAccessState;
  const packs = Array.isArray(row.packs)
    ? (row.packs as Record<string, unknown>[]).map((pack) => ({
        pack_key: String(pack.pack_key ?? ""),
        pack_name: String(pack.pack_name ?? pack.pack_key ?? ""),
        pack_logo_url: typeof pack.pack_logo_url === "string" ? pack.pack_logo_url : null,
        short_description: String(pack.short_description ?? ""),
        version: String(pack.version ?? ""),
        display_status: String(pack.display_status ?? ""),
        display_status_key: String(pack.display_status_key ?? "active"),
        activation_status:
          typeof pack.activation_status === "string"
            ? (pack.activation_status as BusinessPackActivationStatus)
            : null,
        installed_at: typeof pack.installed_at === "string" ? pack.installed_at : null,
        dependencies: Array.isArray(pack.dependencies) ? pack.dependencies.map(String) : [],
        integrations: Array.isArray(pack.integrations) ? pack.integrations.map(String) : [],
        access_summary: String(pack.access_summary ?? ""),
        configure_href: typeof pack.configure_href === "string" ? pack.configure_href : null,
        workspace_route: typeof pack.workspace_route === "string" ? pack.workspace_route : null,
      }))
    : undefined;

  return {
    found: row.found !== false,
    access_state: accessState,
    current_plan: typeof row.current_plan === "string" ? row.current_plan : undefined,
    required_plan: typeof row.required_plan === "string" ? row.required_plan : undefined,
    capability_summary:
      typeof row.capability_summary === "string" ? row.capability_summary : undefined,
    upgrade_href: typeof row.upgrade_href === "string" ? row.upgrade_href : undefined,
    return_href: typeof row.return_href === "string" ? row.return_href : undefined,
    packs,
    pending_pack_keys: Array.isArray(row.pending_pack_keys)
      ? row.pending_pack_keys.map(String)
      : undefined,
    failed_pack_keys: Array.isArray(row.failed_pack_keys)
      ? row.failed_pack_keys.map(String)
      : undefined,
  };
}

export function buildBusinessPackSettingsUpgradeHref(returnPath = "/app/business-packs/settings") {
  const params = new URLSearchParams({
    capability: "business_pack_settings",
    return: returnPath,
  });
  return `/app/billing/upgrade?${params.toString()}`;
}
