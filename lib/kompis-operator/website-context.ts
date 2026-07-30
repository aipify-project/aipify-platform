import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { discoverOperatorLocales } from "./locales";

export type KompisWebsiteContext = {
  organizationId: string | null;
  organizationName: string | null;
  appLicenseActive: boolean;
  websiteKompisCapability: boolean;
  deliveryActive: boolean;
  acknowledgementOk: boolean;
  primaryDomain: string | null;
  runtimeDomain: string | null;
  installationId: string | null;
  installTrustOk: boolean;
  siteEnvironment: "production" | "unknown";
  supportedLocales: readonly string[];
  defaultLocale: string;
  draftCapability: boolean;
  previewCapability: boolean;
  publishCapability: boolean;
  rollbackCapability: boolean;
  authoritativePageModel: boolean;
  currentVersion: string | null;
  draftCount: number;
  lastPublishAt: string | null;
  conflicts: string[];
  publishUnavailableReason: string | null;
  rollbackUnavailableReason: string | null;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function resolveKompisWebsiteContext(
  supabase: SupabaseClient,
): Promise<KompisWebsiteContext> {
  const { data, error } = await supabase.rpc("get_app_kompis_operator_workspace");
  const workspace = error ? {} : asRecord(data);
  const organization = asRecord(workspace.organization);
  const parentLicense = asRecord(workspace.parent_license);
  const websiteKompis = asRecord(workspace.website_kompis);
  const locales = discoverOperatorLocales();

  const acknowledgementOk = websiteKompis.acknowledgement === true || websiteKompis.acknowledged === true;
  const capability =
    websiteKompis.enabled === true ||
    websiteKompis.capability === true ||
    websiteKompis.module_enabled === true ||
    acknowledgementOk;
  const domain =
    typeof websiteKompis.domain === "string"
      ? websiteKompis.domain
      : typeof websiteKompis.primary_domain === "string"
        ? websiteKompis.primary_domain
        : null;
  const installationId =
    typeof websiteKompis.installation_id === "string" ? websiteKompis.installation_id : null;

  let draftCount = 0;
  const draftsRes = await supabase.rpc("list_app_kompis_operator_drafts", { p_limit: 100 });
  if (!draftsRes.error) {
    const payload = asRecord(draftsRes.data);
    const drafts = Array.isArray(payload.drafts) ? payload.drafts : [];
    draftCount = drafts.filter((item) => {
      const kind = asRecord(item).draft_kind;
      return typeof kind === "string" && kind.startsWith("website_");
    }).length;
  }

  const publishUnavailableReason = "no_authoritative_website_cms_publish_path_v4";
  const rollbackUnavailableReason = "no_authoritative_website_version_rollback_path_v4";

  return {
    organizationId: typeof organization.id === "string" ? organization.id : null,
    organizationName:
      typeof organization.name === "string"
        ? organization.name
        : typeof organization.display_name === "string"
          ? organization.display_name
          : null,
    appLicenseActive:
      parentLicense.status === "active" ||
      parentLicense.active === true ||
      workspace.available === true,
    websiteKompisCapability: capability,
    deliveryActive: workspace.available === true,
    acknowledgementOk,
    primaryDomain: domain,
    runtimeDomain: domain,
    installationId,
    installTrustOk: Boolean(installationId) && acknowledgementOk,
    siteEnvironment: "production",
    supportedLocales: locales,
    defaultLocale: locales.includes("en" as never) ? "en" : locales[0] ?? "en",
    draftCapability: workspace.available === true,
    previewCapability: true,
    publishCapability: false,
    rollbackCapability: false,
    authoritativePageModel: false,
    currentVersion: null,
    draftCount,
    lastPublishAt: null,
    conflicts: [],
    publishUnavailableReason,
    rollbackUnavailableReason,
  };
}
