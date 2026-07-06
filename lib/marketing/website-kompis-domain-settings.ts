import {
  mapCustomerDomainRecordToActivationStatus,
  type WebsiteKompisDomainActivationStatus,
} from "@/lib/marketing/website-kompis-domain-activation";
import {
  normalizeWebsiteKompisInstallConfig,
  type WebsiteKompisInstallConfig,
} from "@/lib/marketing/website-kompis-install-config";
import type { WebsiteKompisInstallConfigRpcResult } from "@/lib/marketing/website-kompis-install-config-storage";
import type { WebsiteKompisLicensedAvailability } from "@/lib/marketing/website-kompis-licensed-availability";

export type WebsiteKompisDomainSettingsRecord = {
  domainId: string;
  domain: string;
  verificationStatus?: string | null;
  domainStatus?: string | null;
};

export type WebsiteKompisDomainSettingsView = {
  domainId: string;
  domain: string;
  availability: WebsiteKompisLicensedAvailability;
  canManage: boolean;
  activationStatus: WebsiteKompisDomainActivationStatus;
  installId: string | null;
  metadataUrl: string | null;
  config: WebsiteKompisInstallConfig;
};

export function isWebsiteKompisDomainVerified(record: WebsiteKompisDomainSettingsRecord): boolean {
  return (
    record.verificationStatus === "verified" &&
    record.domainStatus === "active"
  );
}

export function buildWebsiteKompisMetadataUrl(input: {
  origin: string;
  installId: string;
  domain: string;
}): string {
  const params = new URLSearchParams({
    installId: input.installId,
    domain: input.domain,
  });
  return `${input.origin.replace(/\/$/, "")}/api/embed/companion/launcher-icon?${params.toString()}`;
}

export function buildWebsiteKompisDomainSettingsView(input: {
  record: WebsiteKompisDomainSettingsRecord;
  availability: WebsiteKompisLicensedAvailability;
  canManage: boolean;
  installId?: string | null;
  metadataOrigin?: string;
  rpcResult?: WebsiteKompisInstallConfigRpcResult | null;
}): WebsiteKompisDomainSettingsView {
  const config = normalizeWebsiteKompisInstallConfig(
    input.rpcResult?.normalized_config ?? input.rpcResult?.config,
  );

  const activationStatus = mapCustomerDomainRecordToActivationStatus({
    verificationStatus: input.record.verificationStatus,
    status: input.record.domainStatus,
    enabled: config.enabled,
  });

  const installId = input.installId ?? input.rpcResult?.install_id ?? null;
  const metadataUrl =
    installId && input.metadataOrigin
      ? buildWebsiteKompisMetadataUrl({
          origin: input.metadataOrigin,
          installId,
          domain: input.record.domain,
        })
      : null;

  return {
    domainId: input.record.domainId,
    domain: input.record.domain,
    availability: input.availability,
    canManage: input.canManage,
    activationStatus,
    installId,
    metadataUrl,
    config,
  };
}

export function buildWebsiteKompisSettingsPatch(body: Record<string, unknown>): Record<string, unknown> {
  const patch: Record<string, unknown> = {};

  if ("enabled" in body) {
    patch.enabled = body.enabled;
  }
  if ("iconVariant" in body) {
    patch.iconVariant = body.iconVariant;
  }
  if ("fallbackTone" in body) {
    patch.fallbackTone = body.fallbackTone;
  }
  if ("welcomeMessageVariant" in body) {
    patch.welcomeMessageVariant = body.welcomeMessageVariant;
  }
  if ("sources" in body && body.sources && typeof body.sources === "object") {
    patch.sources = body.sources;
  }

  return patch;
}
