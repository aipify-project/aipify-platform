import { isEccDemoModeEnabled, isSyntheticEccRecord } from "@/lib/command-center/ecc-tab-datasets";
import type { IntegrationCanonicalStatus } from "@/lib/app-portal/integrations/canonical-status";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

export type CommandBriefIntegrationStatusKey =
  | "connected_verified"
  | "read_only"
  | "needs_review"
  | "awaiting_setup"
  | "disconnected"
  | "not_activated";

export type CommandBriefIntegrationStatusItem = {
  id: string;
  packKey: string;
  title: string;
  titleLabelKey?: string;
  summary: string;
  status: CommandBriefIntegrationStatusKey;
  statusLabelKey: string;
  badgeType: "health" | "workflow" | "severity" | "access";
  badgeValue: string;
  eventsCount: number;
  alertsCount: number;
  latestActivity?: string;
  lastSync?: string;
  accessMode?: "read_only" | "full";
  accessModeLabelKey?: string;
  href: string;
  actionLabelKey: string;
};

const DEMO_ECC_PACK_KEYS = new Set(["support", "finance", "warehouse"]);
const DEMO_ECC_PACK_SUMMARY_PATTERN = /\bPack → .* Events\./i;

const PACK_TITLE_LABEL_KEYS: Record<string, string> = {
  hosts: "customerApp.executiveCommandCenter.commandBriefOverview.packNames.hosts",
  support: "customerApp.executiveCommandCenter.commandBriefOverview.packNames.support",
  finance: "customerApp.executiveCommandCenter.commandBriefOverview.packNames.finance",
  warehouse: "customerApp.executiveCommandCenter.commandBriefOverview.packNames.warehouse",
};

const INTEGRATION_STATUS_LABEL_KEYS: Record<CommandBriefIntegrationStatusKey, string> = {
  connected_verified:
    "customerApp.executiveCommandCenter.commandBriefOverview.integrationStatuses.connectedVerified",
  read_only: "customerApp.executiveCommandCenter.commandBriefOverview.integrationStatuses.readOnly",
  needs_review: "customerApp.executiveCommandCenter.commandBriefOverview.integrationStatuses.needsReview",
  awaiting_setup: "customerApp.executiveCommandCenter.commandBriefOverview.integrationStatuses.awaitingSetup",
  disconnected: "customerApp.executiveCommandCenter.commandBriefOverview.integrationStatuses.disconnected",
  not_activated: "customerApp.executiveCommandCenter.commandBriefOverview.integrationStatuses.notActivated",
};

const INTEGRATION_STATUS_BADGE: Record<
  CommandBriefIntegrationStatusKey,
  { type: CommandBriefIntegrationStatusItem["badgeType"]; value: string }
> = {
  connected_verified: { type: "health", value: "healthy" },
  read_only: { type: "access", value: "restricted" },
  needs_review: { type: "workflow", value: "awaiting_approval" },
  awaiting_setup: { type: "workflow", value: "pending" },
  disconnected: { type: "severity", value: "critical" },
  not_activated: { type: "workflow", value: "open" },
};

export function integrationStatusLabelKey(status: CommandBriefIntegrationStatusKey): string {
  return INTEGRATION_STATUS_LABEL_KEYS[status];
}

/** Map APP portal canonical integration status to Command Brief presentation. */
export function mapAppPortalCanonicalToCommandBriefStatus(
  canonical: IntegrationCanonicalStatus
): CommandBriefIntegrationStatusKey {
  switch (canonical) {
    case "active":
    case "verified":
      return "connected_verified";
    case "inactive":
      return "not_activated";
    case "verification_failed":
    case "revoked":
    case "removed":
      return "disconnected";
    case "credential_saved":
    case "verification_pending":
    case "not_configured":
      return "awaiting_setup";
    default:
      return "awaiting_setup";
  }
}

export function isDemoEccBusinessPack(record: Record<string, unknown>): boolean {
  if (isEccDemoModeEnabled()) return false;
  if (isSyntheticEccRecord(record)) return true;

  const key = String(record.pack_key ?? "").toLowerCase();
  const summary = String(record.summary ?? "");
  return DEMO_ECC_PACK_KEYS.has(key) && DEMO_ECC_PACK_SUMMARY_PATTERN.test(summary);
}

function deriveIntegrationStatus(record: Record<string, unknown>): CommandBriefIntegrationStatusKey {
  const alertsCount = Number(record.alerts_count ?? 0);
  const eventsCount = Number(record.events_count ?? 0);
  const packStatus = String(record.pack_status ?? record.status ?? "").toLowerCase();
  const accessMode = String(record.access_mode ?? "").toLowerCase();

  if (packStatus === "disconnected" || packStatus === "failed") return "disconnected";
  if (packStatus === "pending" || packStatus === "awaiting_setup") return "awaiting_setup";
  if (alertsCount > 0) return "needs_review";
  if (accessMode === "read_only" || accessMode === "readonly") return "read_only";
  if (eventsCount > 0) return "connected_verified";
  if (packStatus === "active" || packStatus === "connected") return "connected_verified";
  return "not_activated";
}

function resolvePackTitleLabelKey(packKey: string): string | undefined {
  return PACK_TITLE_LABEL_KEYS[packKey.toLowerCase()];
}

function resolvePackHref(packKey: string): string {
  if (packKey === "hosts") return "/app/aipify-hosts";
  return `/app/settings/modules?highlight=${encodeURIComponent(packKey)}`;
}

export function mapBusinessPackToIntegrationStatus(
  record: Record<string, unknown>
): CommandBriefIntegrationStatusItem | null {
  if (isDemoEccBusinessPack(record)) return null;

  const packKey = String(record.pack_key ?? "").trim();
  const title = String(record.pack_title ?? "").trim();
  if (!packKey && !title) return null;

  const status = deriveIntegrationStatus(record);
  const badge = INTEGRATION_STATUS_BADGE[status];
  const accessMode =
    status === "read_only"
      ? ("read_only" as const)
      : status === "connected_verified"
        ? ("full" as const)
        : undefined;

  return {
    id: packKey || title,
    packKey: packKey || title,
    title,
    titleLabelKey: resolvePackTitleLabelKey(packKey),
    summary: String(record.summary ?? ""),
    status,
    statusLabelKey: integrationStatusLabelKey(status),
    badgeType: badge.type,
    badgeValue: badge.value,
    eventsCount: Number(record.events_count ?? 0),
    alertsCount: Number(record.alerts_count ?? 0),
    latestActivity: typeof record.latest_activity === "string" ? record.latest_activity : undefined,
    lastSync: typeof record.last_sync_at === "string" ? record.last_sync_at : undefined,
    accessMode,
    accessModeLabelKey: accessMode
      ? `customerApp.executiveCommandCenter.commandBriefOverview.accessModes.${accessMode}`
      : undefined,
    href: resolvePackHref(packKey),
    actionLabelKey:
      status === "needs_review" || status === "awaiting_setup"
        ? "customerApp.executiveCommandCenter.commandBriefOverview.integrationActions.review"
        : "customerApp.executiveCommandCenter.commandBriefOverview.integrationActions.manage",
  };
}

export function buildCommandBriefIntegrationStatus(center: ExecutiveCommandCenter): {
  items: CommandBriefIntegrationStatusItem[];
  totalCount: number;
} {
  const items = (center.business_packs ?? [])
    .map((record) => mapBusinessPackToIntegrationStatus(record))
    .filter((item): item is CommandBriefIntegrationStatusItem => item != null);

  return {
    items,
    totalCount: items.length,
  };
}
