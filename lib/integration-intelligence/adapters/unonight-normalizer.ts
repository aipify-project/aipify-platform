import type { UnonightPlatformSnapshotMetadata } from "@/lib/companion-platform-knowledge/platform-snapshot-tool";
import { isMissingReportedVersion } from "../normalize-text";
import type { NormalizedIntegrationToolResult, NormalizedPlatformSnapshotData } from "../types";

export function normalizeUnonightPlatformSnapshot(
  metadata: UnonightPlatformSnapshotMetadata,
): NormalizedPlatformSnapshotData {
  return {
    availability: metadata.status,
    environment: metadata.environment,
    version: isMissingReportedVersion(metadata.platform_version) ? null : metadata.platform_version.trim(),
    supportedLocales: metadata.supported_locales,
    activeModules: metadata.active_modules.map((key) => ({ key, active: true })),
    checkedAt: metadata.checked_at,
  };
}

export function buildUnonightSuccessResult(
  metadata: UnonightPlatformSnapshotMetadata,
): Extract<NormalizedIntegrationToolResult, { status: "success" }> {
  return {
    status: "success",
    provider: metadata.provider,
    capability: "platform_snapshot",
    data: normalizeUnonightPlatformSnapshot(metadata),
    source: {
      type: "verified_integration",
      readOnly: true,
      labelKey: "customerApp.companionPlatformKnowledge.platformSnapshot.sourceVerifiedIntegration",
    },
    toolName: metadata.tool,
  };
}

export function buildUnonightFailureResult(
  providerKey: string,
  failureCode: string,
): Extract<NormalizedIntegrationToolResult, { status: "failure" }> {
  return {
    status: "failure",
    provider: providerKey,
    capability: "platform_snapshot",
    failureCode,
    source: {
      type: "verified_integration",
      readOnly: true,
      labelKey: "customerApp.companionPlatformKnowledge.platformSnapshot.sourceVerifiedIntegration",
    },
    toolName: "get_unonight_platform_snapshot",
  };
}
