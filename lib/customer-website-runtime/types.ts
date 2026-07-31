/** Customer Website Runtime Delivery V1 — shared contract types. */

export const CUSTOMER_WEBSITE_RUNTIME_CONTRACT = "customer_website_runtime_v1" as const;

export type CustomerWebsiteRuntimeContractVersion = typeof CUSTOMER_WEBSITE_RUNTIME_CONTRACT;

export type RuntimeAckStatus =
  | "verified"
  | "pending"
  | "attention"
  | "mismatch"
  | "stale"
  | "failed";

export type RuntimeHttpCheckStatus = RuntimeAckStatus | "blocked";

export type RuntimeFallbackMode = "customer_runtime" | "unavailable";

export type RuntimeRouteRef = {
  path: string;
  locale: string;
};

export type RuntimeContextResponse =
  | {
      ok: true;
      contractVersion: CustomerWebsiteRuntimeContractVersion;
      published: boolean;
      reason?: string;
      installationRef: string;
      organizationRef: string;
      websiteRef: string;
      domain: string;
      environment: string;
      versionRef?: string;
      versionNumber?: number;
      manifestChecksum?: string;
      defaultLocale: string;
      activeLocales: string[];
      publishedRoutes: RuntimeRouteRef[];
      mountedPaths: string[];
      homepageEnabled: boolean;
      fallbackMode: RuntimeFallbackMode;
      acknowledgementRequired: boolean;
      cacheToken: string;
      configVersion: number;
    }
  | { ok: false; reason: string };

export type RuntimePageResponse =
  | {
      ok: true;
      contractVersion: CustomerWebsiteRuntimeContractVersion;
      path: string;
      locale: string;
      fallbackLocale: string | null;
      versionRef: string;
      versionNumber: number;
      manifestChecksum: string;
      pageChecksum: string;
      title: string;
      content: Record<string, unknown>;
      seo: Record<string, unknown>;
      robots: string;
      cacheToken: string;
    }
  | { ok: false; reason: string };

export type RuntimeManifestResponse =
  | {
      ok: true;
      contractVersion: CustomerWebsiteRuntimeContractVersion;
      versionRef: string;
      versionNumber: number;
      manifestChecksum: string;
      defaultLocale: string;
      locales: string[];
      pages: Array<{
        path: string;
        locale: string;
        title: string;
        contentChecksum: string;
        revisionNumber: number;
      }>;
      cacheToken: string;
    }
  | { ok: false; reason: string };

export type RuntimeAcknowledgeInput = {
  path: string;
  locale?: string;
  observedManifestChecksum: string;
  observedPageChecksum: string;
  observedVersionRef?: string;
  runtimeAppVersion?: string;
  runtimeDeploymentRef?: string;
  httpStatus?: number;
  renderedAt?: string;
  idempotencyKey: string;
};

export const RUNTIME_PROOF_HEADERS = {
  version: "X-Aipify-Website-Version",
  manifestChecksum: "X-Aipify-Manifest-Checksum",
  pageChecksum: "X-Aipify-Page-Checksum",
  installation: "X-Aipify-Installation",
} as const;
