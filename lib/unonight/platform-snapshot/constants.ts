/** Unonight platform snapshot — read-only live platform metadata (separate from connection V1). */

export const UNONIGHT_PLATFORM_SNAPSHOT_PATH = "/api/aipify/v1/platform-snapshot";

export const UNONIGHT_PLATFORM_METADATA_SCOPE = "platform.metadata.read";

export const UNONIGHT_PLATFORM_SNAPSHOT_TIMEOUT_MS = 12_000;

export function buildUnonightPlatformSnapshotUrl(baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, "")}${UNONIGHT_PLATFORM_SNAPSHOT_PATH}`;
}
