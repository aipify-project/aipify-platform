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
  "serviceRoleKey",
  "anonKey",
  "supabaseUrl",
  "stack",
  "headers",
  "cookies",
] as const;

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
