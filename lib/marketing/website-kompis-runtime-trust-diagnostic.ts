import "server-only";

import { timingSafeEqual } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  sanitizePublicCompanionDomain,
  sanitizePublicCompanionInstallId,
} from "@/lib/marketing/public-companion-tenant-faq";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN_HEADER = "x-aipify-diagnostic-token";

export const WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FAILURE_STAGES = [
  "none",
  "missing_guard",
  "missing_input",
  "service_role_config",
  "service_role_select",
  "domain_binding",
  "install",
  "domain_install_mismatch",
  "unknown",
] as const;

export type WebsiteKompisRuntimeTrustDiagnosticFailureStage =
  (typeof WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FAILURE_STAGES)[number];

export type WebsiteKompisRuntimeTrustDiagnosticResponse = {
  ok: boolean;
  serviceRoleConfigured: boolean;
  serviceRoleSelectWorked: boolean;
  domainInputPresent: boolean;
  installIdInputPresent: boolean;
  domainBindingFound: boolean;
  verifiedActiveDomainBinding: boolean;
  installFound: boolean;
  installActive: boolean;
  domainInstallMatch: boolean;
  canReadExpectedBinding: boolean;
  failureStage: WebsiteKompisRuntimeTrustDiagnosticFailureStage;
};

export const FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS = [
  "tenant_id",
  "customer_id",
  "user_id",
  "profile_id",
  "membership_id",
  "tenantId",
  "installId",
  "domain",
  "serviceRoleKey",
  "anonKey",
  "supabaseUrl",
  "stack",
  "headers",
  "cookies",
] as const;

export const WEBSITE_KOMPIS_METADATA_PIPELINE_FAILURE_STAGES = [
  "none",
  "visitor_context",
  "trust",
  "availability",
  "install_config",
  "metadata_merge",
  "unexpected",
] as const;

export type WebsiteKompisMetadataPipelineFailureStage =
  (typeof WEBSITE_KOMPIS_METADATA_PIPELINE_FAILURE_STAGES)[number];

export type WebsiteKompisMetadataPipelineDiagnosticResponse = {
  ok: boolean;
  mode: "metadataPipeline";
  visitorContextOk: boolean;
  trustTrusted: boolean;
  trustReason: string | null;
  availabilityAvailable: boolean;
  availabilityReason: string | null;
  installConfigLoaded: boolean;
  installConfigEnabled: boolean | null;
  finalMetadataEnabled: boolean;
  finalMetadataAvailable: boolean;
  finalUnavailableReason: string | null;
  failureStage: WebsiteKompisMetadataPipelineFailureStage;
};

export const WEBSITE_KOMPIS_AVAILABILITY_PROBE_FAILURE_STAGES = [
  "none",
  "trust",
  "license_rpc",
  "license_status",
  "entitlement_rpc",
  "entitlement_missing",
  "unexpected",
] as const;

export type WebsiteKompisAvailabilityProbeFailureStage =
  (typeof WEBSITE_KOMPIS_AVAILABILITY_PROBE_FAILURE_STAGES)[number];

export const WEBSITE_KOMPIS_AVAILABILITY_PROBE_EVALUATOR_BRANCHES = [
  "trust",
  "licenseResolvable",
  "licenseActive",
  "entitlementNull",
  "entitlementMissing",
  "available",
  "unexpected",
] as const;

export type WebsiteKompisAvailabilityProbeEvaluatorBranch =
  (typeof WEBSITE_KOMPIS_AVAILABILITY_PROBE_EVALUATOR_BRANCHES)[number];

export const WEBSITE_KOMPIS_LICENSE_STATUS_BUCKETS = [
  "active",
  "inactive",
  "unrecognized",
  "missing",
] as const;

export type WebsiteKompisLicenseStatusBucket =
  (typeof WEBSITE_KOMPIS_LICENSE_STATUS_BUCKETS)[number];

export type WebsiteKompisAvailabilityProbeDiagnosticResponse = {
  ok: boolean;
  mode: "availabilityProbe";
  trustTrusted: boolean;
  trustReason: string | null;
  entitlementRpcOk: boolean;
  entitlementEnabled: boolean | null;
  licenseRpcOk: boolean;
  licenseStatusPresent: boolean;
  licenseStatusBucket: WebsiteKompisLicenseStatusBucket;
  evaluatorBranch: WebsiteKompisAvailabilityProbeEvaluatorBranch;
  availabilityAvailable: boolean;
  availabilityReason: string | null;
  failureStage: WebsiteKompisAvailabilityProbeFailureStage;
};

const AVAILABILITY_PROBE_ALLOWED_RESPONSE_KEYS = new Set<
  keyof WebsiteKompisAvailabilityProbeDiagnosticResponse
>([
  "ok",
  "mode",
  "trustTrusted",
  "trustReason",
  "entitlementRpcOk",
  "entitlementEnabled",
  "licenseRpcOk",
  "licenseStatusPresent",
  "licenseStatusBucket",
  "evaluatorBranch",
  "availabilityAvailable",
  "availabilityReason",
  "failureStage",
]);

const METADATA_PIPELINE_ALLOWED_RESPONSE_KEYS = new Set<
  keyof WebsiteKompisMetadataPipelineDiagnosticResponse
>([
  "ok",
  "mode",
  "visitorContextOk",
  "trustTrusted",
  "trustReason",
  "availabilityAvailable",
  "availabilityReason",
  "installConfigLoaded",
  "installConfigEnabled",
  "finalMetadataEnabled",
  "finalMetadataAvailable",
  "finalUnavailableReason",
  "failureStage",
]);

const LICENSE_STATUS_BUCKET_ACTIVE = new Set(["active", "grace_period"]);
const LICENSE_STATUS_BUCKET_INACTIVE = new Set(["paused", "suspended", "cancelled"]);

const ACTIVE_INSTALL_STATUSES = ["ready", "installing", "active", "warning"] as const;

type ServiceRoleClient = Pick<SupabaseClient, "from">;

type DomainBindingRow = {
  installation_id?: string | null;
  verification_status?: string | null;
  status?: string | null;
};

type InstallationRow = {
  id?: string | null;
  customer_id?: string | null;
  company_id?: string | null;
  site_url?: string | null;
};

export type WebsiteKompisRuntimeTrustDiagnosticProbe = {
  serviceRoleConfigured: boolean;
  serviceRoleSelectWorked: boolean;
  domainInputPresent: boolean;
  installIdInputPresent: boolean;
  domainBindingFound: boolean;
  verifiedActiveDomainBinding: boolean;
  installFound: boolean;
  installActive: boolean;
  domainInstallMatch: boolean;
  hasResolvableBinding: boolean;
};

const ALLOWED_RESPONSE_KEYS = new Set<keyof WebsiteKompisRuntimeTrustDiagnosticResponse>([
  "ok",
  "serviceRoleConfigured",
  "serviceRoleSelectWorked",
  "domainInputPresent",
  "installIdInputPresent",
  "domainBindingFound",
  "verifiedActiveDomainBinding",
  "installFound",
  "installActive",
  "domainInstallMatch",
  "canReadExpectedBinding",
  "failureStage",
]);

function constantTimeEqualString(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);

  if (providedBuffer.length !== expectedBuffer.length) {
    timingSafeEqual(providedBuffer, providedBuffer);
    return false;
  }

  return timingSafeEqual(providedBuffer, expectedBuffer);
}

export function isWebsiteKompisDiagnosticGuardConfigured(): boolean {
  return Boolean(
    process.env.CRON_SECRET?.trim() || process.env.WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN?.trim(),
  );
}

export function verifyWebsiteKompisDiagnosticToken(
  provided: string | null | undefined,
): boolean {
  if (!provided?.trim()) {
    return false;
  }

  if (!isWebsiteKompisDiagnosticGuardConfigured()) {
    return false;
  }

  const token = provided.trim();
  const configuredSecrets = [
    process.env.CRON_SECRET?.trim(),
    process.env.WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN?.trim(),
  ].filter((secret): secret is string => Boolean(secret));

  return configuredSecrets.some((secret) => constantTimeEqualString(token, secret));
}

export function sanitizeWebsiteKompisRuntimeTrustDiagnosticResponse(
  value: Record<string, unknown>,
): WebsiteKompisRuntimeTrustDiagnosticResponse {
  const sanitized = {} as Record<string, unknown>;

  for (const key of ALLOWED_RESPONSE_KEYS) {
    if (key in value) {
      sanitized[key] = value[key];
    }
  }

  for (const forbidden of FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS) {
    delete sanitized[forbidden];
  }

  return sanitized as WebsiteKompisRuntimeTrustDiagnosticResponse;
}

export function evaluateWebsiteKompisRuntimeTrustDiagnostic(
  probe: WebsiteKompisRuntimeTrustDiagnosticProbe,
): WebsiteKompisRuntimeTrustDiagnosticResponse {
  const canReadExpectedBinding =
    probe.serviceRoleConfigured &&
    probe.serviceRoleSelectWorked &&
    probe.hasResolvableBinding;

  let failureStage: WebsiteKompisRuntimeTrustDiagnosticFailureStage = "none";

  if (!probe.domainInputPresent && !probe.installIdInputPresent) {
    failureStage = "missing_input";
  } else if (!probe.serviceRoleConfigured) {
    failureStage = "service_role_config";
  } else if (!probe.serviceRoleSelectWorked) {
    failureStage = "service_role_select";
  } else if (
    probe.domainInputPresent &&
    (!probe.domainBindingFound || !probe.verifiedActiveDomainBinding)
  ) {
    failureStage = "domain_binding";
  } else if (
    probe.installIdInputPresent &&
    (!probe.installFound || !probe.installActive)
  ) {
    failureStage = "install";
  } else if (
    probe.domainInputPresent &&
    probe.installIdInputPresent &&
    probe.domainBindingFound &&
    probe.verifiedActiveDomainBinding &&
    probe.installFound &&
    probe.installActive &&
    !probe.domainInstallMatch
  ) {
    failureStage = "domain_install_mismatch";
  } else if (!canReadExpectedBinding) {
    failureStage = "unknown";
  }

  return sanitizeWebsiteKompisRuntimeTrustDiagnosticResponse({
    ok: failureStage === "none" && canReadExpectedBinding,
    serviceRoleConfigured: probe.serviceRoleConfigured,
    serviceRoleSelectWorked: probe.serviceRoleSelectWorked,
    domainInputPresent: probe.domainInputPresent,
    installIdInputPresent: probe.installIdInputPresent,
    domainBindingFound: probe.domainBindingFound,
    verifiedActiveDomainBinding: probe.verifiedActiveDomainBinding,
    installFound: probe.installFound,
    installActive: probe.installActive,
    domainInstallMatch: probe.domainInstallMatch,
    canReadExpectedBinding,
    failureStage,
  });
}

async function resolveTenantIdForInstallRecord(
  admin: ServiceRoleClient,
  install: InstallationRow,
): Promise<string | null> {
  if (typeof install.customer_id === "string" && install.customer_id.trim()) {
    return install.customer_id.trim();
  }

  if (typeof install.company_id === "string" && install.company_id.trim()) {
    const { data: customer, error: customerError } = await admin
      .from("customers")
      .select("id")
      .eq("company_id", install.company_id)
      .maybeSingle();

    if (customerError || !customer) {
      return null;
    }

    const customerRecord = customer as { id?: string | null };
    return typeof customerRecord.id === "string" ? customerRecord.id : null;
  }

  return null;
}

async function loadActiveInstallation(
  admin: ServiceRoleClient,
  installId: string,
): Promise<InstallationRow | null> {
  const { data, error } = await admin
    .from("installations")
    .select("id, customer_id, company_id, site_url")
    .eq("id", installId)
    .is("revoked_at", null)
    .in("status", [...ACTIVE_INSTALL_STATUSES])
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const record = data as InstallationRow;
  return typeof record.id === "string" ? record : null;
}

async function loadAnyInstallation(
  admin: ServiceRoleClient,
  installId: string,
): Promise<InstallationRow | null> {
  const { data, error } = await admin
    .from("installations")
    .select("id")
    .eq("id", installId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  const record = data as InstallationRow;
  return typeof record.id === "string" ? record : null;
}

async function loadVerifiedActiveCustomerDomain(
  admin: ServiceRoleClient,
  input: { tenantId: string; domain: string },
): Promise<DomainBindingRow | null> {
  const { data, error } = await admin
    .from("customer_domains")
    .select("installation_id, verification_status, status")
    .eq("customer_id", input.tenantId)
    .eq("domain", input.domain)
    .eq("verification_status", "verified")
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as DomainBindingRow;
}

async function loadDomainBindingByDomain(
  admin: ServiceRoleClient,
  domain: string,
): Promise<{ row: DomainBindingRow | null; selectFailed: boolean }> {
  const { data, error } = await admin
    .from("customer_domains")
    .select("installation_id, verification_status, status")
    .eq("domain", domain)
    .maybeSingle();

  if (error) {
    return { row: null, selectFailed: true };
  }

  return { row: (data as DomainBindingRow | null) ?? null, selectFailed: false };
}

async function resolveInstallIdForTenantDomain(
  admin: ServiceRoleClient,
  tenantId: string,
  domain: string,
  installationId: string | null,
): Promise<{ installId: string | null; selectFailed: boolean }> {
  if (installationId) {
    const install = await loadActiveInstallation(admin, installationId);
    if (!install) {
      return { installId: null, selectFailed: false };
    }

    const installTenantId = await resolveTenantIdForInstallRecord(admin, install);
    if (installTenantId !== tenantId) {
      return { installId: null, selectFailed: false };
    }

    return { installId: installationId, selectFailed: false };
  }

  const { data: installs, error } = await admin
    .from("installations")
    .select("id, site_url, customer_id, company_id")
    .eq("customer_id", tenantId)
    .is("revoked_at", null)
    .in("status", [...ACTIVE_INSTALL_STATUSES]);

  if (error || !Array.isArray(installs)) {
    return { installId: null, selectFailed: Boolean(error) };
  }

  const normalizedDomain = domain.trim().toLowerCase();
  for (const row of installs) {
    const record = row as InstallationRow;
    if (!record.id || !record.site_url) continue;
    const siteDomain = sanitizePublicCompanionDomain(record.site_url);
    if (siteDomain === normalizedDomain) {
      return { installId: record.id, selectFailed: false };
    }
  }

  return { installId: null, selectFailed: false };
}

async function findVerifiedActiveDomainBindingForInstall(
  admin: ServiceRoleClient,
  tenantId: string,
  installId: string,
  siteDomain: string | null,
): Promise<DomainBindingRow | null> {
  const { data: boundDomains, error: boundError } = await admin
    .from("customer_domains")
    .select("installation_id, verification_status, status")
    .eq("customer_id", tenantId)
    .eq("installation_id", installId)
    .eq("verification_status", "verified")
    .eq("status", "active");

  if (!boundError && Array.isArray(boundDomains) && boundDomains.length > 0) {
    return boundDomains[0] as DomainBindingRow;
  }

  if (boundError) {
    return null;
  }

  if (!siteDomain) {
    return null;
  }

  return loadVerifiedActiveCustomerDomain(admin, { tenantId, domain: siteDomain });
}

function isVerifiedActiveDomainBinding(row: DomainBindingRow | null): boolean {
  return row?.verification_status === "verified" && row?.status === "active";
}

function domainBindingMatchesInstall(
  row: DomainBindingRow | null,
  installId: string,
): boolean {
  if (!row) {
    return false;
  }

  return row.installation_id == null || row.installation_id === installId;
}

export async function runWebsiteKompisRuntimeTrustDiagnostic(input: {
  domain?: string | null;
  installId?: string | null;
}): Promise<WebsiteKompisRuntimeTrustDiagnosticResponse> {
  const domainInputPresent = Boolean(input.domain?.trim());
  const installIdInputPresent = Boolean(input.installId?.trim());
  const requestedDomain = sanitizePublicCompanionDomain(input.domain ?? null);
  const requestedInstallId = sanitizePublicCompanionInstallId(input.installId ?? null);

  const baseProbe: WebsiteKompisRuntimeTrustDiagnosticProbe = {
    serviceRoleConfigured: false,
    serviceRoleSelectWorked: true,
    domainInputPresent,
    installIdInputPresent,
    domainBindingFound: false,
    verifiedActiveDomainBinding: false,
    installFound: false,
    installActive: false,
    domainInstallMatch: false,
    hasResolvableBinding: false,
  };

  if (!requestedDomain && !requestedInstallId) {
    return evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe);
  }

  let admin: ServiceRoleClient;
  try {
    admin = createServiceRoleClient();
    baseProbe.serviceRoleConfigured = true;
  } catch {
    return evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe);
  }

  if (requestedInstallId && requestedDomain) {
    const install = await loadActiveInstallation(admin, requestedInstallId);
    if (!install) {
      const anyInstall = await loadAnyInstallation(admin, requestedInstallId);
      baseProbe.installFound = Boolean(anyInstall);
      baseProbe.installActive = Boolean(install);
    } else {
      baseProbe.installFound = true;
      baseProbe.installActive = true;
    }

    const domainLookup = await loadDomainBindingByDomain(admin, requestedDomain);
    if (domainLookup.selectFailed) {
      baseProbe.serviceRoleSelectWorked = false;
    } else if (domainLookup.row) {
      baseProbe.domainBindingFound = true;
      baseProbe.verifiedActiveDomainBinding = isVerifiedActiveDomainBinding(domainLookup.row);
      baseProbe.domainInstallMatch = domainBindingMatchesInstall(
        domainLookup.row,
        requestedInstallId,
      );
    }

    baseProbe.hasResolvableBinding =
      baseProbe.verifiedActiveDomainBinding &&
      baseProbe.installActive &&
      baseProbe.domainInstallMatch;

    return evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe);
  }

  if (requestedDomain) {
    const { data, error } = await admin
      .from("customer_domains")
      .select("customer_id, installation_id, verification_status, status")
      .eq("domain", requestedDomain)
      .eq("verification_status", "verified")
      .eq("status", "active")
      .maybeSingle();

    if (error) {
      baseProbe.serviceRoleSelectWorked = false;
      return evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe);
    }

    if (data) {
      baseProbe.domainBindingFound = true;
      baseProbe.verifiedActiveDomainBinding = true;
      const domainRecord = data as DomainBindingRow & { customer_id?: string | null };
      const tenantId =
        typeof domainRecord.customer_id === "string" ? domainRecord.customer_id : null;

      if (tenantId) {
        const resolved = await resolveInstallIdForTenantDomain(
          admin,
          tenantId,
          requestedDomain,
          domainRecord.installation_id ?? null,
        );

        if (resolved.selectFailed) {
          baseProbe.serviceRoleSelectWorked = false;
        } else if (resolved.installId) {
          baseProbe.installFound = true;
          baseProbe.installActive = true;
          baseProbe.domainInstallMatch = true;
          baseProbe.hasResolvableBinding = true;
        }
      }
    } else {
      const lookup = await loadDomainBindingByDomain(admin, requestedDomain);
      if (lookup.selectFailed) {
        baseProbe.serviceRoleSelectWorked = false;
      } else {
        baseProbe.domainBindingFound = Boolean(lookup.row);
        baseProbe.verifiedActiveDomainBinding = isVerifiedActiveDomainBinding(lookup.row);
      }
    }

    return evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe);
  }

  const install = await loadActiveInstallation(admin, requestedInstallId!);
  if (!install) {
    const anyInstall = await loadAnyInstallation(admin, requestedInstallId!);
    baseProbe.installFound = Boolean(anyInstall);
    baseProbe.installActive = false;
  } else {
    baseProbe.installFound = true;
    baseProbe.installActive = true;

    const tenantId = await resolveTenantIdForInstallRecord(admin, install);
    const siteDomain = sanitizePublicCompanionDomain(install.site_url ?? null);
    const domainRecord =
      tenantId != null
        ? await findVerifiedActiveDomainBindingForInstall(
            admin,
            tenantId,
            requestedInstallId!,
            siteDomain,
          )
        : null;

    baseProbe.domainBindingFound = Boolean(domainRecord);
    baseProbe.verifiedActiveDomainBinding = isVerifiedActiveDomainBinding(domainRecord);
    baseProbe.domainInstallMatch = domainBindingMatchesInstall(
      domainRecord,
      requestedInstallId!,
    );
    baseProbe.hasResolvableBinding = baseProbe.verifiedActiveDomainBinding;
  }

  return evaluateWebsiteKompisRuntimeTrustDiagnostic(baseProbe);
}

export function sanitizeWebsiteKompisMetadataPipelineDiagnosticResponse(
  value: Record<string, unknown>,
): WebsiteKompisMetadataPipelineDiagnosticResponse {
  const sanitized = {} as Record<string, unknown>;

  for (const key of METADATA_PIPELINE_ALLOWED_RESPONSE_KEYS) {
    if (key in value) {
      sanitized[key] = value[key];
    }
  }

  for (const forbidden of FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS) {
    delete sanitized[forbidden];
  }

  sanitized.mode = "metadataPipeline";

  return sanitized as WebsiteKompisMetadataPipelineDiagnosticResponse;
}

export function evaluateWebsiteKompisMetadataPipelineDiagnostic(input: {
  hasInstallSelector: boolean;
  visitorContextOk: boolean;
  trustTrusted: boolean;
  trustReason: string | null;
  availabilityAvailable: boolean;
  availabilityReason: string | null;
  installConfigLoaded: boolean;
  installConfigEnabled: boolean | null;
  finalMetadataEnabled: boolean;
  finalMetadataAvailable: boolean;
  finalUnavailableReason: string | null;
}): WebsiteKompisMetadataPipelineDiagnosticResponse {
  let failureStage: WebsiteKompisMetadataPipelineFailureStage = "unexpected";

  if (!input.hasInstallSelector || !input.visitorContextOk) {
    failureStage = "visitor_context";
  } else if (!input.trustTrusted) {
    failureStage = "trust";
  } else if (!input.availabilityAvailable) {
    failureStage = "availability";
  } else if (input.installConfigLoaded && input.installConfigEnabled !== true) {
    failureStage = "install_config";
  } else if (input.finalMetadataEnabled && input.finalMetadataAvailable) {
    failureStage = "none";
  } else if (
    input.trustTrusted &&
    input.availabilityAvailable &&
    input.installConfigEnabled === true
  ) {
    failureStage = "metadata_merge";
  }

  return sanitizeWebsiteKompisMetadataPipelineDiagnosticResponse({
    ok: failureStage === "none",
    mode: "metadataPipeline",
    visitorContextOk: input.visitorContextOk,
    trustTrusted: input.trustTrusted,
    trustReason: input.trustReason,
    availabilityAvailable: input.availabilityAvailable,
    availabilityReason: input.availabilityReason,
    installConfigLoaded: input.installConfigLoaded,
    installConfigEnabled: input.installConfigEnabled,
    finalMetadataEnabled: input.finalMetadataEnabled,
    finalMetadataAvailable: input.finalMetadataAvailable,
    finalUnavailableReason: input.finalUnavailableReason,
    failureStage,
  });
}

export async function runWebsiteKompisMetadataPipelineDiagnostic(input: {
  domain?: string | null;
  installId?: string | null;
  requestHost?: string | null;
}): Promise<WebsiteKompisMetadataPipelineDiagnosticResponse> {
  const {
    buildWebsiteKompisLicensedDisabledPublicMetadata,
    getWebsiteKompisInstallConfigForPublicRequest,
    toWebsiteKompisPublicInstallMetadata,
  } = await import("@/lib/marketing/website-kompis-install-config");
  const { mapWebsiteKompisAvailabilityToPublicReason } = await import(
    "@/lib/marketing/website-kompis-licensed-availability"
  );
  const {
    hasPublicCompanionVisitorContext,
    resolvePublicCompanionVisitorContext,
  } = await import("@/lib/marketing/public-companion-tenant-faq");
  const {
    resolveWebsiteKompisLicensedAvailabilityForPublicTenant,
    resolveWebsiteKompisPublicInstallDomainTrust,
  } = await import("@/lib/marketing/website-kompis-licensed-availability-server");

  const installId = input.installId ?? null;
  const domain = input.domain ?? null;
  const hasInstallSelector = Boolean(installId?.trim() || domain?.trim());

  const visitorContext = resolvePublicCompanionVisitorContext({
    clientDomain: domain,
    requestHost: input.requestHost ?? null,
    installId,
  });
  const visitorContextOk = hasPublicCompanionVisitorContext(visitorContext);

  if (!hasInstallSelector || !visitorContextOk) {
    const disabled = buildWebsiteKompisLicensedDisabledPublicMetadata("not_available");
    return evaluateWebsiteKompisMetadataPipelineDiagnostic({
      hasInstallSelector,
      visitorContextOk,
      trustTrusted: false,
      trustReason: null,
      availabilityAvailable: false,
      availabilityReason: null,
      installConfigLoaded: false,
      installConfigEnabled: null,
      finalMetadataEnabled: disabled.enabled,
      finalMetadataAvailable: disabled.available === false,
      finalUnavailableReason: disabled.reason ?? "not_available",
    });
  }

  const trust = await resolveWebsiteKompisPublicInstallDomainTrust({
    installId,
    domain,
  });

  if (!trust.trusted) {
    const disabled = buildWebsiteKompisLicensedDisabledPublicMetadata(
      mapWebsiteKompisAvailabilityToPublicReason(trust.reason),
    );
    return evaluateWebsiteKompisMetadataPipelineDiagnostic({
      hasInstallSelector,
      visitorContextOk,
      trustTrusted: false,
      trustReason: trust.reason,
      availabilityAvailable: false,
      availabilityReason: null,
      installConfigLoaded: false,
      installConfigEnabled: null,
      finalMetadataEnabled: disabled.enabled,
      finalMetadataAvailable: disabled.available === false,
      finalUnavailableReason: disabled.reason ?? null,
    });
  }

  const availability = trust.tenantId
    ? await resolveWebsiteKompisLicensedAvailabilityForPublicTenant(trust.tenantId)
    : { available: false as const, reason: "license_unknown" as const };

  if (!availability.available) {
    const disabled = buildWebsiteKompisLicensedDisabledPublicMetadata(
      mapWebsiteKompisAvailabilityToPublicReason(availability.reason),
    );
    return evaluateWebsiteKompisMetadataPipelineDiagnostic({
      hasInstallSelector,
      visitorContextOk,
      trustTrusted: true,
      trustReason: trust.reason,
      availabilityAvailable: false,
      availabilityReason: availability.reason,
      installConfigLoaded: false,
      installConfigEnabled: null,
      finalMetadataEnabled: disabled.enabled,
      finalMetadataAvailable: disabled.available === false,
      finalUnavailableReason: disabled.reason ?? null,
    });
  }

  const installConfig = await getWebsiteKompisInstallConfigForPublicRequest({
    installId: trust.installId ?? installId,
    domain: trust.domain ?? domain,
    requestHost: input.requestHost ?? null,
  });

  const publicMetadata = installConfig.enabled
    ? toWebsiteKompisPublicInstallMetadata(installConfig)
    : buildWebsiteKompisLicensedDisabledPublicMetadata("not_available");

  return evaluateWebsiteKompisMetadataPipelineDiagnostic({
    hasInstallSelector,
    visitorContextOk,
    trustTrusted: true,
    trustReason: trust.reason,
    availabilityAvailable: true,
    availabilityReason: availability.reason,
    installConfigLoaded: true,
    installConfigEnabled: installConfig.enabled,
    finalMetadataEnabled: publicMetadata.enabled,
    finalMetadataAvailable: publicMetadata.available !== false,
    finalUnavailableReason: publicMetadata.reason ?? null,
  });
}

export function bucketWebsiteKompisLicenseStatusForProbe(
  status: string | null | undefined,
): WebsiteKompisLicenseStatusBucket {
  if (typeof status !== "string") return "missing";
  const normalized = status.trim();
  if (!normalized) return "missing";
  if (LICENSE_STATUS_BUCKET_ACTIVE.has(normalized)) return "active";
  if (LICENSE_STATUS_BUCKET_INACTIVE.has(normalized)) return "inactive";
  return "unrecognized";
}

export function resolveWebsiteKompisAvailabilityProbeEvaluatorBranch(input: {
  trustTrusted: boolean;
  licenseRpcOk: boolean;
  licenseStatusPresent: boolean;
  licenseStatusBucket: WebsiteKompisLicenseStatusBucket;
  entitlementRpcOk: boolean;
  entitlementEnabled: boolean | null;
  availabilityAvailable: boolean;
}): WebsiteKompisAvailabilityProbeEvaluatorBranch {
  if (!input.trustTrusted) return "trust";
  if (!input.licenseRpcOk || !input.licenseStatusPresent || input.licenseStatusBucket === "missing") {
    return "licenseResolvable";
  }
  if (input.licenseStatusBucket === "unrecognized" || input.licenseStatusBucket === "inactive") {
    return "licenseActive";
  }
  if (!input.entitlementRpcOk || input.entitlementEnabled === null) return "entitlementNull";
  if (input.entitlementEnabled === false) return "entitlementMissing";
  if (input.availabilityAvailable) return "available";
  return "unexpected";
}

export function resolveWebsiteKompisAvailabilityProbeFailureStage(input: {
  trustTrusted: boolean;
  licenseRpcOk: boolean;
  licenseStatusPresent: boolean;
  licenseStatusBucket: WebsiteKompisLicenseStatusBucket;
  entitlementRpcOk: boolean;
  entitlementEnabled: boolean | null;
  availabilityAvailable: boolean;
  evaluatorBranch: WebsiteKompisAvailabilityProbeEvaluatorBranch;
}): WebsiteKompisAvailabilityProbeFailureStage {
  if (!input.trustTrusted) return "trust";
  if (!input.licenseRpcOk || !input.licenseStatusPresent || input.licenseStatusBucket === "missing") {
    return "license_rpc";
  }
  if (input.licenseStatusBucket === "unrecognized" || input.licenseStatusBucket === "inactive") {
    return "license_status";
  }
  if (!input.entitlementRpcOk || input.entitlementEnabled === null) return "entitlement_rpc";
  if (input.entitlementEnabled === false) return "entitlement_missing";
  if (input.availabilityAvailable && input.evaluatorBranch === "available") return "none";
  return "unexpected";
}

export function sanitizeWebsiteKompisAvailabilityProbeDiagnosticResponse(
  value: Record<string, unknown>,
): WebsiteKompisAvailabilityProbeDiagnosticResponse {
  const sanitized = {} as Record<string, unknown>;

  for (const key of AVAILABILITY_PROBE_ALLOWED_RESPONSE_KEYS) {
    if (key in value) {
      sanitized[key] = value[key];
    }
  }

  for (const forbidden of FORBIDDEN_WEBSITE_KOMPIS_RUNTIME_TRUST_DIAGNOSTIC_FIELDS) {
    delete sanitized[forbidden];
  }

  sanitized.mode = "availabilityProbe";

  return sanitized as WebsiteKompisAvailabilityProbeDiagnosticResponse;
}

export function evaluateWebsiteKompisAvailabilityProbeDiagnostic(input: {
  trustTrusted: boolean;
  trustReason: string | null;
  entitlementRpcOk: boolean;
  entitlementEnabled: boolean | null;
  licenseRpcOk: boolean;
  licenseStatusPresent: boolean;
  licenseStatusBucket: WebsiteKompisLicenseStatusBucket;
  availabilityAvailable: boolean;
  availabilityReason: string | null;
}): WebsiteKompisAvailabilityProbeDiagnosticResponse {
  const evaluatorBranch = resolveWebsiteKompisAvailabilityProbeEvaluatorBranch({
    trustTrusted: input.trustTrusted,
    licenseRpcOk: input.licenseRpcOk,
    licenseStatusPresent: input.licenseStatusPresent,
    licenseStatusBucket: input.licenseStatusBucket,
    entitlementRpcOk: input.entitlementRpcOk,
    entitlementEnabled: input.entitlementEnabled,
    availabilityAvailable: input.availabilityAvailable,
  });

  const failureStage = resolveWebsiteKompisAvailabilityProbeFailureStage({
    trustTrusted: input.trustTrusted,
    licenseRpcOk: input.licenseRpcOk,
    licenseStatusPresent: input.licenseStatusPresent,
    licenseStatusBucket: input.licenseStatusBucket,
    entitlementRpcOk: input.entitlementRpcOk,
    entitlementEnabled: input.entitlementEnabled,
    availabilityAvailable: input.availabilityAvailable,
    evaluatorBranch,
  });

  return sanitizeWebsiteKompisAvailabilityProbeDiagnosticResponse({
    ok: failureStage === "none",
    mode: "availabilityProbe",
    trustTrusted: input.trustTrusted,
    trustReason: input.trustReason,
    entitlementRpcOk: input.entitlementRpcOk,
    entitlementEnabled: input.entitlementEnabled,
    licenseRpcOk: input.licenseRpcOk,
    licenseStatusPresent: input.licenseStatusPresent,
    licenseStatusBucket: input.licenseStatusBucket,
    evaluatorBranch,
    availabilityAvailable: input.availabilityAvailable,
    availabilityReason: input.availabilityReason,
    failureStage,
  });
}

async function probeWebsiteKompisAvailabilityDependencies(tenantId: string): Promise<{
  entitlementRpcOk: boolean;
  entitlementEnabled: boolean | null;
  licenseRpcOk: boolean;
  licenseStatusPresent: boolean;
  licenseStatusBucket: WebsiteKompisLicenseStatusBucket;
  licenseServiceStatus: string | null;
}> {
  const { createServiceRoleClient } = await import("@/lib/supabase/service-role");
  const { WEBSITE_KOMPIS_CAPABILITY_KEY } = await import(
    "@/lib/marketing/website-kompis-licensed-availability"
  );

  let entitlementRpcOk = false;
  let entitlementEnabled: boolean | null = null;
  let licenseRpcOk = false;
  let licenseStatusPresent = false;
  let licenseServiceStatus: string | null = null;

  let admin: Pick<SupabaseClient, "rpc">;
  try {
    admin = createServiceRoleClient();
  } catch {
    return {
      entitlementRpcOk: false,
      entitlementEnabled: null,
      licenseRpcOk: false,
      licenseStatusPresent: false,
      licenseStatusBucket: "missing",
      licenseServiceStatus: null,
    };
  }

  try {
    const { data, error } = await admin.rpc("is_tenant_module_enabled", {
      p_tenant_id: tenantId,
      p_module_key: WEBSITE_KOMPIS_CAPABILITY_KEY,
    });
    if (error) {
      entitlementRpcOk = false;
      entitlementEnabled = null;
    } else {
      entitlementRpcOk = true;
      entitlementEnabled = data === true;
    }
  } catch {
    entitlementRpcOk = false;
    entitlementEnabled = null;
  }

  try {
    const { data, error } = await admin.rpc("resolve_license_service_status", {
      p_customer_id: tenantId,
    });
    if (error || typeof data !== "string") {
      licenseRpcOk = false;
      licenseServiceStatus = null;
    } else {
      licenseRpcOk = true;
      licenseServiceStatus = data;
      licenseStatusPresent = data.trim().length > 0;
    }
  } catch {
    licenseRpcOk = false;
    licenseServiceStatus = null;
  }

  return {
    entitlementRpcOk,
    entitlementEnabled,
    licenseRpcOk,
    licenseStatusPresent,
    licenseStatusBucket: bucketWebsiteKompisLicenseStatusForProbe(licenseServiceStatus),
    licenseServiceStatus,
  };
}

export async function runWebsiteKompisAvailabilityProbeDiagnostic(input: {
  domain?: string | null;
  installId?: string | null;
  requestHost?: string | null;
}): Promise<WebsiteKompisAvailabilityProbeDiagnosticResponse> {
  const { evaluateWebsiteKompisLicensedAvailability } = await import(
    "@/lib/marketing/website-kompis-licensed-availability"
  );
  const {
    hasPublicCompanionVisitorContext,
    resolvePublicCompanionVisitorContext,
  } = await import("@/lib/marketing/public-companion-tenant-faq");
  const { resolveWebsiteKompisPublicInstallDomainTrust } = await import(
    "@/lib/marketing/website-kompis-licensed-availability-server"
  );

  const installId = input.installId ?? null;
  const domain = input.domain ?? null;
  const hasInstallSelector = Boolean(installId?.trim() || domain?.trim());

  const visitorContext = resolvePublicCompanionVisitorContext({
    clientDomain: domain,
    requestHost: input.requestHost ?? null,
    installId,
  });
  const visitorContextOk = hasPublicCompanionVisitorContext(visitorContext);

  if (!hasInstallSelector || !visitorContextOk) {
    return evaluateWebsiteKompisAvailabilityProbeDiagnostic({
      trustTrusted: false,
      trustReason: null,
      entitlementRpcOk: false,
      entitlementEnabled: null,
      licenseRpcOk: false,
      licenseStatusPresent: false,
      licenseStatusBucket: "missing",
      availabilityAvailable: false,
      availabilityReason: null,
    });
  }

  const trust = await resolveWebsiteKompisPublicInstallDomainTrust({
    installId,
    domain,
  });

  if (!trust.trusted || !trust.tenantId) {
    return evaluateWebsiteKompisAvailabilityProbeDiagnostic({
      trustTrusted: false,
      trustReason: trust.reason,
      entitlementRpcOk: false,
      entitlementEnabled: null,
      licenseRpcOk: false,
      licenseStatusPresent: false,
      licenseStatusBucket: "missing",
      availabilityAvailable: false,
      availabilityReason: null,
    });
  }

  const probe = await probeWebsiteKompisAvailabilityDependencies(trust.tenantId);

  const availability = evaluateWebsiteKompisLicensedAvailability({
    licenseServiceStatus: probe.licenseServiceStatus,
    entitlementEnabled: probe.entitlementEnabled,
    domainVerified: true,
    installTrusted: true,
    licenseResolvable: probe.licenseServiceStatus != null,
  });

  return evaluateWebsiteKompisAvailabilityProbeDiagnostic({
    trustTrusted: true,
    trustReason: trust.reason,
    entitlementRpcOk: probe.entitlementRpcOk,
    entitlementEnabled: probe.entitlementEnabled,
    licenseRpcOk: probe.licenseRpcOk,
    licenseStatusPresent: probe.licenseStatusPresent,
    licenseStatusBucket: probe.licenseStatusBucket,
    availabilityAvailable: availability.available,
    availabilityReason: availability.reason,
  });
}
