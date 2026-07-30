/**
 * Shared types for the Website Release Verification (staging) layer.
 * Client + server safe — no Supabase imports here.
 */

import type { WebsiteCmsManifest } from "@/lib/website-cms/types";

export type WebsiteStagingEnvironmentStatus = "active" | "attention" | "archived";

export type WebsiteStagingFixtureStatus = "active" | "archived";

export type WebsiteStagingRunStatus = "pending" | "running" | "passed" | "failed" | "partial" | "blocked";

export type WebsiteStagingRunPhase =
  | "initialized"
  | "first_candidate_built"
  | "first_preview_created"
  | "first_published"
  | "first_verified"
  | "second_candidate_built"
  | "second_preview_created"
  | "second_published"
  | "second_verified"
  | "rolled_back"
  | "rollback_verified"
  | "completed";

export type WebsiteStagingEnvironmentSummary = {
  id: string;
  organizationId: string;
  websiteId: string | null;
  installationId: string | null;
  domainId: string | null;
  stagingHostKey: string;
  status: WebsiteStagingEnvironmentStatus;
  retention: string;
  accessTokenPresent: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type WebsiteStagingFixtureSummary = {
  id: string;
  fixtureKey: string;
  pagePath: string;
  locale: string;
  status: WebsiteStagingFixtureStatus;
  retention: string;
  initialChecksum: string | null;
  updatedChecksum: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type WebsiteStagingRuntimeVerification = {
  verified: boolean;
  reason: string;
  domain?: string;
  checkedAt?: string;
};

export type WebsiteStagingRunSummary = {
  id: string;
  environmentId: string;
  organizationId: string;
  websiteId: string | null;
  fixtureId: string | null;
  status: WebsiteStagingRunStatus;
  currentPhase: WebsiteStagingRunPhase;
  baselineVersionId: string | null;
  firstCandidateId: string | null;
  firstPublishOperationId: string | null;
  secondCandidateId: string | null;
  secondPublishOperationId: string | null;
  rollbackOperationId: string | null;
  previewRefs: readonly Record<string, unknown>[];
  expectedChecksums: Record<string, unknown>;
  actualChecksums: Record<string, unknown>;
  safeErrorCode: string | null;
  startedAt: string | null;
  completedAt: string | null;
  idempotencyKey: string;
  createdAt: string | null;
  updatedAt: string | null;
  idempotentReplay?: boolean;
  runtimeVerification?: WebsiteStagingRuntimeVerification;
};

export type WebsiteStagingRunListItem = {
  id: string;
  fixtureId: string | null;
  status: WebsiteStagingRunStatus;
  currentPhase: WebsiteStagingRunPhase;
  safeErrorCode: string | null;
  startedAt: string | null;
  completedAt: string | null;
  updatedAt: string | null;
  firstPublishOperationId?: string | null;
  secondPublishOperationId?: string | null;
  rollbackOperationId?: string | null;
  expectedChecksums?: Record<string, unknown>;
  actualChecksums?: Record<string, unknown>;
};

export type WebsiteStagingControlPlane = {
  appLicenseActive: boolean;
  websiteKompisCapability: boolean;
  canonicalDelivery: boolean;
  acknowledgementOk: boolean;
  noindexRequired: boolean;
  productionIsolation: boolean;
  currentVersionId: string | null;
  currentVersionNumber: number | null;
  latestRunId: string | null;
  latestPhase: WebsiteStagingRunPhase | null;
  firstPublishPresent: boolean;
  secondPublishPresent: boolean;
  rollbackPresent: boolean;
  expectedChecksum: string | null;
  actualChecksum: string | null;
  checksumMatch: boolean;
  durationSeconds: number | null;
  auditReference: string | null;
  blockers: readonly string[];
};

export type WebsiteStagingKpis = {
  totalRuns: number;
  passedRuns: number;
  failedRuns: number;
  blockedRuns: number;
  lastRunAt: string | null;
};

export type WebsiteStagingVerificationOverview = {
  environment: WebsiteStagingEnvironmentSummary | null;
  fixtures: readonly WebsiteStagingFixtureSummary[];
  runs: readonly WebsiteStagingRunListItem[];
  kpis: WebsiteStagingKpis;
  control: WebsiteStagingControlPlane;
};

export type WebsiteStagingAccessToken = {
  token: string;
  expiresAt: string;
};

export type WebsiteStagingEnsureResult = {
  environmentId: string;
  organizationId: string;
  websiteId: string | null;
  installationId: string | null;
  domainId: string | null;
  stagingHostKey: string;
  status: WebsiteStagingEnvironmentStatus;
  created: boolean;
  idempotentReplay: boolean;
  website: { id: string; status: string; currentVersionId: string | null } | null;
  accessToken: WebsiteStagingAccessToken | null;
  accessTokenPresent: boolean;
};

export type WebsiteStagingFixtureCreateResult = {
  id: string;
  environmentId: string;
  fixtureKey: string;
  pagePath: string;
  locale: string;
  status: WebsiteStagingFixtureStatus;
  created: boolean;
  idempotentReplay: boolean;
};

export type WebsiteStagingFixtureArchiveResult = {
  id: string;
  status: WebsiteStagingFixtureStatus;
  idempotentReplay: boolean;
};

export type WebsiteStagingPublicResolvedToken =
  | {
      ok: true;
      environmentId: string;
      websiteId: string;
      versionId: string;
      versionNumber: number;
      defaultLocale: string;
      activeLocales: readonly string[];
      manifest: WebsiteCmsManifest;
      contentChecksum: string;
      manifestChecksum: string;
      publishedAt: string | null;
      noindex: true;
    }
  | { ok: false; reason: string };

/** Aggregate APP/CMS readiness — never includes staging internals. */
export type WebsiteReleaseChainReadinessStatus =
  | "verified"
  | "code_ready"
  | "running"
  | "attention"
  | "blocked";

export type WebsiteReleaseChainReadiness = {
  status: WebsiteReleaseChainReadinessStatus;
  lastCompletedAt: string | null;
  hasVerificationHistory: boolean;
};
