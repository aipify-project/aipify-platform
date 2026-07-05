import {
  normalizeWebsiteKompisInstallConfig,
  toWebsiteKompisPublicInstallMetadata,
  type WebsiteKompisInstallConfig,
  type WebsiteKompisPublicInstallMetadata,
} from "@/lib/marketing/website-kompis-install-config";
import {
  resolvePublicCompanionVisitorContext,
  sanitizePublicCompanionDomain,
  sanitizePublicCompanionInstallId,
  type PublicCompanionVisitorContext,
} from "@/lib/marketing/public-companion-tenant-faq";

export const WEBSITE_KOMPIS_DOMAIN_ACTIVATION_STATUSES = [
  "active",
  "disabled",
  "pending_verification",
] as const;

export type WebsiteKompisDomainActivationStatus =
  (typeof WEBSITE_KOMPIS_DOMAIN_ACTIVATION_STATUSES)[number];

export const WEBSITE_KOMPIS_ACTIVATE_DOMAIN_RPC = "activate_website_kompis_for_domain" as const;
export const WEBSITE_KOMPIS_DEACTIVATE_DOMAIN_RPC = "deactivate_website_kompis_for_domain" as const;

/** Internal Core contract — tenant/customer ids stay server-side only. */
export type WebsiteKompisDomainActivation = {
  installId: string;
  domain: string;
  status: WebsiteKompisDomainActivationStatus;
  config: WebsiteKompisInstallConfig;
};

/** Public-safe embed payload returned after activation. */
export type WebsiteKompisPublicEmbedPayload = {
  installId: string;
  domain: string;
  enabled: boolean;
  status: WebsiteKompisDomainActivationStatus;
  metadataUrl: string;
  normalizedConfig: WebsiteKompisPublicInstallMetadata;
};

const FORBIDDEN_PUBLIC_ACTIVATION_KEYS = new Set([
  "tenantId",
  "tenant_id",
  "customerId",
  "customer_id",
  "companyId",
  "company_id",
  "config",
]);

function parseActivationStatus(value: unknown): WebsiteKompisDomainActivationStatus {
  if (
    typeof value === "string" &&
    (WEBSITE_KOMPIS_DOMAIN_ACTIVATION_STATUSES as readonly string[]).includes(value)
  ) {
    return value as WebsiteKompisDomainActivationStatus;
  }
  return "disabled";
}

export function parseWebsiteKompisDomainActivationRpc(
  data: unknown,
): WebsiteKompisDomainActivation | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return null;
  }

  const record = data as Record<string, unknown>;
  if (record.ok !== true) {
    return null;
  }

  const installId = sanitizePublicCompanionInstallId(record.install_id ?? record.installId);
  const domain = sanitizePublicCompanionDomain(record.domain);
  if (!installId || !domain) {
    return null;
  }

  const config = normalizeWebsiteKompisInstallConfig(record.normalized_config ?? record.config);

  return {
    installId,
    domain,
    status: parseActivationStatus(record.status),
    config,
  };
}

export function buildWebsiteKompisPublicEmbedPayload(
  activation: WebsiteKompisDomainActivation,
  options: { metadataOrigin?: string } = {},
): WebsiteKompisPublicEmbedPayload {
  const origin = (options.metadataOrigin ?? "https://aipify.ai").replace(/\/$/, "");
  const params = new URLSearchParams({
    installId: activation.installId,
    domain: activation.domain,
  });

  return {
    installId: activation.installId,
    domain: activation.domain,
    enabled: activation.config.enabled,
    status: activation.status,
    metadataUrl: `${origin}/api/embed/companion/launcher-icon?${params.toString()}`,
    normalizedConfig: toWebsiteKompisPublicInstallMetadata(activation.config),
  };
}

export function mapCustomerDomainRecordToActivationStatus(input: {
  verificationStatus?: string | null;
  status?: string | null;
  enabled?: boolean | null;
}): WebsiteKompisDomainActivationStatus {
  if (input.enabled === false) {
    return "disabled";
  }

  if (input.verificationStatus !== "verified") {
    return "pending_verification";
  }

  if (input.status !== "active") {
    return "pending_verification";
  }

  return "active";
}

export function resolveWebsiteKompisTrustedVisitorContext(input: {
  clientDomain?: string | null;
  requestHost?: string | null;
  installId?: string | null;
}): PublicCompanionVisitorContext {
  return resolvePublicCompanionVisitorContext(input);
}

export function assertWebsiteKompisPublicActivationPayload(
  payload: WebsiteKompisPublicEmbedPayload,
): void {
  for (const key of FORBIDDEN_PUBLIC_ACTIVATION_KEYS) {
    if (Object.hasOwn(payload as unknown as Record<string, unknown>, key)) {
      throw new Error(`Public activation payload must not expose ${key}`);
    }
  }
  if (!payload.installId || !payload.domain) {
    throw new Error("Public activation payload requires installId and domain");
  }
}
