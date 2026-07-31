/** Shared types for the Website CMS publish/rollback layer (client + server safe). */

export type WebsiteCmsWebsiteStatus = "provisioned" | "ready" | "attention" | "archived";

export type WebsiteCmsVersionStatus = "candidate" | "published" | "superseded" | "failed";

export type WebsiteCmsOperationKind = "publish" | "rollback" | "reconcile";

export type WebsiteCmsOperationStatus =
  | "pending_verification"
  | "pending_runtime"
  | "active"
  | "attention"
  | "failed";

export type WebsiteCmsWebsiteSummary = {
  id: string;
  status: WebsiteCmsWebsiteStatus;
  domainId: string | null;
  installationId: string | null;
  defaultLocale: string;
  activeLocales: readonly string[];
  currentVersionId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type WebsiteCmsVersionSummary = {
  id: string;
  versionNumber: number;
  status: WebsiteCmsVersionStatus;
  contentChecksum: string;
  manifestChecksum: string;
  changeSummary: string | null;
  previewVerifiedAt: string | null;
  createdAt: string | null;
};

export type WebsiteCmsCapabilities = {
  authoritativePageModel: boolean;
  draftCapability: boolean;
  previewCapability: boolean;
  publishCapability: boolean;
  rollbackCapability: boolean;
};

export type WebsiteCmsContext = {
  available: boolean;
  organizationId: string | null;
  domain: string | null;
  installationId: string | null;
  acknowledgementOk: boolean;
  website: WebsiteCmsWebsiteSummary | null;
  currentVersion: WebsiteCmsVersionSummary | null;
  capabilities: WebsiteCmsCapabilities;
};

export type WebsiteCmsPageSummary = {
  id: string;
  path: string;
  pageType: string;
  status: string;
  locales: readonly string[];
  latestRevisionNumber: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type WebsiteCmsRevision = {
  id: string;
  locale: string;
  revisionNumber: number;
  content: Record<string, unknown>;
  seo: Record<string, unknown>;
  sourceDraftId: string | null;
  contentChecksum: string;
  createdAt: string | null;
};

export type WebsiteCmsPageDetail = {
  id: string;
  websiteId: string;
  path: string;
  pageType: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  revisions: readonly WebsiteCmsRevision[];
};

export type WebsiteCmsManifestPage = {
  pageId: string;
  path: string;
  locale: string;
  revisionNumber: number;
  title: string;
  content: Record<string, unknown>;
  seo: Record<string, unknown>;
  contentChecksum: string;
};

export type WebsiteCmsManifest = {
  pages: readonly WebsiteCmsManifestPage[];
  extras: readonly Record<string, unknown>[];
  locales: readonly string[];
  defaultLocale: string;
  generatedAt: string | null;
  idempotencyKey?: string;
};

export type WebsiteCmsVersionDetail = WebsiteCmsVersionSummary & {
  websiteId: string;
  previousVersionId: string | null;
  sourceDraftIds: readonly string[];
  manifest: WebsiteCmsManifest;
  previews: readonly {
    id: string;
    locale: string;
    noindex: boolean;
    expiresAt: string;
    expired: boolean;
    createdAt: string | null;
  }[];
};

export type WebsiteCmsOperation = {
  id: string;
  operationKind: WebsiteCmsOperationKind;
  candidateVersionId: string | null;
  expectedCurrentVersionId: string | null;
  resultingVersionId: string | null;
  status: WebsiteCmsOperationStatus;
  internalReason: string | null;
  errorCode: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type WebsiteCmsRuntimeVerification = {
  verified: boolean;
  reason: string;
  domain?: string;
  checkedAt?: string;
};

export type WebsiteCmsPublicResolvedVersion = {
  ok: boolean;
  reason?: string;
  domain?: string;
  websiteId?: string;
  versionId?: string;
  versionNumber?: number;
  defaultLocale?: string;
  activeLocales?: readonly string[];
  manifest?: WebsiteCmsManifest;
  contentChecksum?: string;
  manifestChecksum?: string;
  publishedAt?: string;
};
