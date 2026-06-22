import {
  UNONIGHT_ORGANIZATION_SLUG,
  resolveUnonightApiBaseUrl,
} from "@/lib/unonight/connection/constants";
import { assertProductionUnonightToken } from "@/lib/unonight/connection/placeholders";
import { isUnonightAipifyTokenFormat } from "@/lib/unonight-platform/constants";
import {
  UNONIGHT_PLATFORM_METADATA_SCOPE,
  UNONIGHT_PLATFORM_SNAPSHOT_TIMEOUT_MS,
  buildUnonightPlatformSnapshotUrl,
} from "./constants";
import {
  parseUnonightPlatformSnapshotDetailed,
  type UnonightPlatformSnapshotParseFailureCode,
  type UnonightPlatformSnapshotSuccess,
} from "./contract-parser";

export type UnonightPlatformSnapshotFailureCode =
  | "invalid_token"
  | "missing_required_scope"
  | "platform_snapshot_forbidden"
  | "endpoint_unreachable"
  | "response_invalid"
  | "organization_mismatch";

export type UnonightPlatformSnapshotTestResult =
  | { ok: true; snapshot: UnonightPlatformSnapshotSuccess; verifiedAt: string }
  | {
      ok: false;
      code: UnonightPlatformSnapshotFailureCode;
      technicalReason: string;
      parseCode?: UnonightPlatformSnapshotParseFailureCode;
    };

export type UnonightPlatformSnapshotTestInput = {
  bearerToken: string;
  baseUrl?: string | null;
  expectedOrganizationSlug?: string | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
};

function extractSafeErrorCode(payload: unknown): string | null {
  if (typeof payload !== "object" || payload === null) return null;
  const error = (payload as Record<string, unknown>).error;
  return typeof error === "string" ? error : null;
}

function mapHttpFailure(
  status: number,
  payload: unknown,
): UnonightPlatformSnapshotFailureCode {
  const errorCode = extractSafeErrorCode(payload);
  if (status === 403 && errorCode === "missing_scope") return "missing_required_scope";
  if (status === 403) return "platform_snapshot_forbidden";
  if (status === 401) return "invalid_token";
  return "endpoint_unreachable";
}

export async function testUnonightPlatformSnapshot(
  input: UnonightPlatformSnapshotTestInput,
): Promise<UnonightPlatformSnapshotTestResult> {
  try {
    assertProductionUnonightToken(input.bearerToken);
  } catch {
    return {
      ok: false,
      code: "invalid_token",
      technicalReason: "Token blocked or missing",
    };
  }

  if (!isUnonightAipifyTokenFormat(input.bearerToken)) {
    return {
      ok: false,
      code: "invalid_token",
      technicalReason: "Invalid token format",
    };
  }

  const baseUrl = resolveUnonightApiBaseUrl(input.baseUrl);
  const url = buildUnonightPlatformSnapshotUrl(baseUrl);
  const fetchImpl = input.fetchImpl ?? fetch;
  const timeoutMs = input.timeoutMs ?? UNONIGHT_PLATFORM_SNAPSHOT_TIMEOUT_MS;
  const expectedSlug = input.expectedOrganizationSlug?.trim() || UNONIGHT_ORGANIZATION_SLUG;

  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.bearerToken.trim()}`,
        Accept: "application/json",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    return {
      ok: false,
      code: "endpoint_unreachable",
      technicalReason: "Network error calling platform snapshot",
    };
  }

  if (response.status >= 300 && response.status < 400) {
    return {
      ok: false,
      code: "endpoint_unreachable",
      technicalReason: `Redirect response (${response.status})`,
    };
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    return {
      ok: false,
      code: "response_invalid",
      technicalReason: `Non-JSON response (${response.status})`,
    };
  }

  if (!response.ok) {
    const code = mapHttpFailure(response.status, payload);
    const errorCode = extractSafeErrorCode(payload);
    return {
      ok: false,
      code,
      technicalReason:
        code === "missing_required_scope"
          ? `Unonight rejected platform snapshot: missing ${UNONIGHT_PLATFORM_METADATA_SCOPE}`
          : errorCode
            ? `HTTP ${response.status} (${errorCode})`
            : `HTTP ${response.status}`,
    };
  }

  const parsed = parseUnonightPlatformSnapshotDetailed(payload);
  if (!parsed.ok) {
    return {
      ok: false,
      code: "response_invalid",
      technicalReason: parsed.reason,
      parseCode: parsed.code,
    };
  }

  if (parsed.snapshot.organization.id.toLowerCase() !== expectedSlug.toLowerCase()) {
    return {
      ok: false,
      code: "organization_mismatch",
      technicalReason: "Organization slug mismatch",
    };
  }

  return {
    ok: true,
    snapshot: parsed.snapshot,
    verifiedAt: new Date().toISOString(),
  };
}
