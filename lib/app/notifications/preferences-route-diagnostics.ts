import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";

type PreferencesRouteLogInput = {
  phase: string;
  authUserId?: string | null;
  organizationId?: string | null;
  customerId?: string | null;
  httpStatus?: number;
  rpcError?: string | null;
  hasCustomer?: boolean | null;
  hasPreferencesObject?: boolean;
  preferenceKeys?: string[];
  parserAccepted?: boolean;
  accessState?: string | null;
  stableError?: string | null;
};

export function logPreferencesRouteDiagnostic(input: PreferencesRouteLogInput): void {
  if (process.env.NODE_ENV === "production") return;
  console.info("[presence/preferences GET]", input);
}

export function normalizePreferencesRpcPayload(data: unknown): unknown {
  if (typeof data === "string") {
    try {
      return JSON.parse(data) as unknown;
    } catch {
      return data;
    }
  }
  return data;
}

export function summarizePreferencesRpcPayload(data: unknown): {
  hasCustomer: boolean | null;
  hasPreferencesObject: boolean;
  preferenceKeys: string[];
  parserAccepted: boolean;
} {
  const record =
    data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  const prefs =
    record?.preferences && typeof record.preferences === "object"
      ? (record.preferences as Record<string, unknown>)
      : null;

  return {
    hasCustomer: typeof record?.has_customer === "boolean" ? record.has_customer : null,
    hasPreferencesObject: Boolean(prefs),
    preferenceKeys: prefs ? Object.keys(prefs).slice(0, 12) : [],
    parserAccepted: parsePresenceNotificationPreferences(data) !== null,
  };
}
