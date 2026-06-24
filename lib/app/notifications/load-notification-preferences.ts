import { recordPreferencesLoadAttempt } from "@/lib/app/notifications/preferences-load-diagnostics";
import type { AppOrganizationContextState } from "@/lib/tenant/resolve-app-organization-context";
import type { PresenceNotificationPreferences } from "@/lib/presence/notification-state";
import { parsePresenceNotificationPreferences } from "@/lib/presence/unified-notification-feed/preferences";

export type NotificationPreferencesLoadError =
  | "organization_missing"
  | "permission_missing"
  | "page_load_error"
  | "subscription_required"
  | "entitlement_locked"
  | "access_denied";

type PreferencesApiPayload = {
  access_state?: AppOrganizationContextState;
  error?: string;
  has_customer?: boolean;
};

export type NotificationPreferencesLoadResult = {
  preferences: PresenceNotificationPreferences | null;
  error: NotificationPreferencesLoadError | null;
  httpStatus: number | null;
};

function mapAccessStateToLoadError(
  accessState: AppOrganizationContextState | undefined,
  httpStatus: number,
): NotificationPreferencesLoadError {
  switch (accessState) {
    case "organization_missing":
    case "membership_missing":
    case "user_not_provisioned":
      return "organization_missing";
    case "permission_missing":
      return "permission_missing";
    case "subscription_inactive":
    case "license_inactive":
      return "subscription_required";
    case "entitlement_missing":
      return "entitlement_locked";
    case "database_execution_error":
      return "page_load_error";
    default:
      if (httpStatus >= 500) return "page_load_error";
      if (httpStatus === 409) return "organization_missing";
      if (httpStatus === 403) return "permission_missing";
      if (httpStatus === 402) return "subscription_required";
      return "access_denied";
  }
}

export async function fetchNotificationPreferences(
  source = "fetchNotificationPreferences",
  stableRequestKey: string | null = null,
): Promise<NotificationPreferencesLoadResult> {
  recordPreferencesLoadAttempt({
    stableRequestKey,
    source,
    outcome: "start",
  });

  try {
    const res = await fetch("/api/presence/preferences", { cache: "no-store" });
    const body = (await res.json()) as PreferencesApiPayload & Record<string, unknown>;

    if (!res.ok) {
      const error = mapAccessStateToLoadError(body.access_state, res.status);
      recordPreferencesLoadAttempt({
        stableRequestKey,
        source,
        outcome: "error",
        httpStatus: res.status,
        errorCode: error,
      });
      return {
        preferences: null,
        error,
        httpStatus: res.status,
      };
    }

    const parsed = parsePresenceNotificationPreferences(body);
    if (!parsed) {
      const error: NotificationPreferencesLoadError =
        body.has_customer === false ? "organization_missing" : "page_load_error";
      recordPreferencesLoadAttempt({
        stableRequestKey,
        source,
        outcome: "error",
        httpStatus: res.status,
        errorCode: error,
      });
      return {
        preferences: null,
        error,
        httpStatus: res.status,
      };
    }

    recordPreferencesLoadAttempt({
      stableRequestKey,
      source,
      outcome: "success",
      httpStatus: res.status,
    });
    return { preferences: parsed, error: null, httpStatus: res.status };
  } catch {
    recordPreferencesLoadAttempt({
      stableRequestKey,
      source,
      outcome: "error",
      errorCode: "page_load_error",
    });
    return { preferences: null, error: "page_load_error", httpStatus: null };
  }
}

export function resolvePreferencesLoadErrorMessage(
  error: NotificationPreferencesLoadError,
  messages: {
    organizationMissing: string;
    pageLoadError: string;
    accessDenied: string;
    subscriptionRequired: string;
    permissionMissing: string;
    entitlementLocked: string;
  },
): string {
  switch (error) {
    case "organization_missing":
      return messages.organizationMissing;
    case "permission_missing":
      return messages.permissionMissing;
    case "subscription_required":
      return messages.subscriptionRequired;
    case "entitlement_locked":
      return messages.entitlementLocked;
    case "page_load_error":
      return messages.pageLoadError;
    default:
      return messages.accessDenied;
  }
}
