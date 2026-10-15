/**
 * Platform Support — APP ticket SoT READ adapter (Phase A / inactive).
 *
 * Server-side only. Calls proposed Core RPCs only when both the apply flag and
 * the feature gate are true. Until then: fail-closed — no fake tickets, no
 * legacy queue mixing, no service-role bypass.
 *
 * Core RPCs (NOT_APPLIED until named apply YES):
 *   list_platform_app_portal_support_requests
 *   get_platform_app_portal_support_request
 *   get_platform_app_portal_support_request_counts
 */

import {
  APP_PORTAL_SUPPORT_CHANNEL_VALUES,
  PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN,
  PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
  PLATFORM_SUPPORT_TICKETS_READ_RPCS,
  PLATFORM_SUPPORT_TICKETS_READ_ROLES,
  PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
} from "./support-tickets-cross-tenant-read-contract";

/** Explicit Platform feature gate — stays false until a separate activation job. */
export const PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE = false;

export const PLATFORM_SUPPORT_TICKETS_READ_ADAPTER_ID =
  "platform_support_tickets_read_adapter_v1" as const;

export type PlatformSupportTicketsReadDenialCode =
  | "feature_gate_off"
  | "rpc_not_applied"
  | "ui_not_wired"
  | "unauthorized"
  | "forbidden"
  | "not_found"
  | "invalid_argument"
  | "rpc_unavailable"
  | "unknown";

export type PlatformSupportTicketsListParams = {
  status?: string | null;
  channel?: string | null;
  category?: string | null;
  priority?: string | null;
  companyId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
  sort?: string | null;
  page?: number | null;
  pageSize?: number | null;
};

export type PlatformSupportTicketsListItem = {
  id: string;
  company_id: string;
  company_name: string | null;
  title: string;
  description_preview: string;
  category: string;
  priority: string;
  status: string;
  channel: string;
  source_locale: null;
  related_module: string | null;
  assigned_support_owner_id: string | null;
  attachment_count: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
};

export type PlatformSupportTicketsReadDenied = {
  ok: false;
  code: PlatformSupportTicketsReadDenialCode;
  message: string;
  source: "app_portal_support_requests";
  rpcConnected: boolean;
  featureGate: boolean;
  uiWired: boolean;
  live: false;
};

export type PlatformSupportTicketsListOk = {
  ok: true;
  live: true;
  source: "app_portal_support_requests";
  privacy_note: string;
  channel_values: readonly string[];
  items: PlatformSupportTicketsListItem[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
  filters: Record<string, unknown>;
};

export type PlatformSupportTicketsGetOk = {
  ok: true;
  live: true;
  found: true;
  source: "app_portal_support_requests";
  privacy_note: string;
  item: Record<string, unknown>;
  timeline: unknown[];
};

export type PlatformSupportTicketsCountsOk = {
  ok: true;
  live: true;
  source: "app_portal_support_requests";
  privacy_note: string;
  counts: {
    total: number;
    open: number;
    waiting: number;
    resolved_or_closed: number;
  };
};

/**
 * Product-facing channel link status for the four intended inboxes.
 * Only values with confirmed ticket ingest are linked.
 */
export const PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK = {
  aipify_public_site: {
    desiredLabel: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.public_aipify_site.desiredLabel,
    linked: false as const,
    status: "NOT_LINKED" as const,
    sotChannels: [] as const,
    note: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.public_aipify_site.today,
  },
  kompis_web: {
    desiredLabel: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.kompis_web.desiredLabel,
    linked: false as const,
    status: "NOT_LINKED" as const,
    sotChannels: [] as const,
    note: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.kompis_web.today,
  },
  kompis_bedrift_app: {
    desiredLabel: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.kompis_bedrift_app.desiredLabel,
    linked: true as const,
    status: "LINKED_SOT" as const,
    sotChannels: ["app_portal"] as const,
    note: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.kompis_bedrift_app.today,
  },
  sellers_partners: {
    desiredLabel: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.sellers_partners.desiredLabel,
    linked: false as const,
    status: "NOT_LINKED" as const,
    sotChannels: [] as const,
    note: PLATFORM_SUPPORT_FOUR_CHANNEL_MAPPING_PLAN.sellers_partners.today,
  },
} as const;

/** Allowed Core channel filter values only — never invent product labels as filters. */
export const PLATFORM_SUPPORT_ALLOWED_CHANNEL_FILTERS =
  APP_PORTAL_SUPPORT_CHANNEL_VALUES;

export function canInvokePlatformSupportTicketsReadRpc(): boolean {
  // Flags are intentionally literal-false until named apply/activation jobs flip them.
  // Cast through boolean so typecheck does not treat `false === true` as a hard error.
  const rpcConnected = PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED as boolean;
  const featureGate = PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE as boolean;
  return rpcConnected && featureGate;
}

export function getPlatformSupportTicketsReadGateState() {
  return {
    adapterId: PLATFORM_SUPPORT_TICKETS_READ_ADAPTER_ID,
    rpcConnected: PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
    featureGate: PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE,
    uiWired: PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
    live: canInvokePlatformSupportTicketsReadRpc(),
    allowedRoles: PLATFORM_SUPPORT_TICKETS_READ_ROLES,
    rpcNames: PLATFORM_SUPPORT_TICKETS_READ_RPCS,
    allowedChannelFilters: PLATFORM_SUPPORT_ALLOWED_CHANNEL_FILTERS,
    productChannelLink: PLATFORM_SUPPORT_PRODUCT_CHANNEL_LINK,
    sourceLocaleInvent: false as const,
  };
}

function deny(
  code: PlatformSupportTicketsReadDenialCode,
  message: string,
): PlatformSupportTicketsReadDenied {
  return {
    ok: false,
    code,
    message,
    source: "app_portal_support_requests",
    rpcConnected: PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED,
    featureGate: PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE,
    uiWired: PLATFORM_SUPPORT_TICKETS_READ_UI_WIRED,
    live: false,
  };
}

export function denyInactivePlatformSupportTicketsRead(): PlatformSupportTicketsReadDenied {
  if (!PLATFORM_SUPPORT_TICKETS_READ_RPC_CONNECTED) {
    return deny(
      "rpc_not_applied",
      "APP ticket SoT read RPCs are not applied on Core yet.",
    );
  }
  if (!PLATFORM_SUPPORT_TICKETS_READ_FEATURE_GATE) {
    return deny(
      "feature_gate_off",
      "Platform Support ticket read feature gate is off.",
    );
  }
  return deny("unknown", "Platform Support ticket read is inactive.");
}

function isAccessDeniedMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("platform portal access denied") ||
    m.includes("access denied") ||
    m.includes("not authorized") ||
    m.includes("permission") ||
    m.includes("forbidden")
  );
}

function isMissingRpcMessage(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("could not find the function") ||
    (m.includes("function") && m.includes("does not exist")) ||
    m.includes("42883") ||
    m.includes("pgrst202")
  );
}

function clampPageSize(raw: number | null | undefined): number {
  const n = Number.isFinite(raw as number) ? Math.trunc(raw as number) : 25;
  return Math.min(Math.max(n, 1), 50);
}

function clampPage(raw: number | null | undefined): number {
  const n = Number.isFinite(raw as number) ? Math.trunc(raw as number) : 1;
  return Math.max(n, 1);
}

function normalizeChannelFilter(
  channel: string | null | undefined,
): string | null | PlatformSupportTicketsReadDenied {
  if (channel == null || String(channel).trim() === "") return null;
  const value = String(channel).trim();
  if (
    !(PLATFORM_SUPPORT_ALLOWED_CHANNEL_FILTERS as readonly string[]).includes(
      value,
    )
  ) {
    return deny(
      "invalid_argument",
      "Channel filter must be an existing SoT channel value.",
    );
  }
  return value;
}

/** Minimal RPC surface — accepts SupabaseClient or test stubs. */
type RpcClient = {
  // Intentionally loose: supabase-js returns a thenable builder, not Promise.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rpc: (fn: string, args?: Record<string, unknown>) => any;
};

/**
 * List APP SoT tickets for Platform operators.
 * Fail-closed while RPC/gate inactive — never returns placeholder rows.
 */
export async function listPlatformSupportTickets(
  supabase: RpcClient,
  params: PlatformSupportTicketsListParams = {},
): Promise<PlatformSupportTicketsListOk | PlatformSupportTicketsReadDenied> {
  if (!canInvokePlatformSupportTicketsReadRpc()) {
    return denyInactivePlatformSupportTicketsRead();
  }

  const channel = normalizeChannelFilter(params.channel);
  if (channel && typeof channel === "object" && channel.ok === false) {
    return channel;
  }

  const { data, error } = await supabase.rpc(
    "list_platform_app_portal_support_requests",
    {
      p_status: params.status ?? null,
      p_channel: channel,
      p_category: params.category ?? null,
      p_priority: params.priority ?? null,
      p_company_id: params.companyId ?? null,
      p_date_from: params.dateFrom ?? null,
      p_date_to: params.dateTo ?? null,
      p_search: params.search ?? null,
      p_sort: params.sort ?? null,
      p_page: clampPage(params.page),
      p_page_size: clampPageSize(params.pageSize),
    },
  );

  if (error) {
    const message = error.message ?? "";
    if (isAccessDeniedMessage(message)) {
      return deny("forbidden", "Forbidden");
    }
    if (isMissingRpcMessage(message)) {
      return deny("rpc_unavailable", "Support ticket read RPC is unavailable.");
    }
    return deny("unknown", "Unable to list support tickets.");
  }

  const row =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  if (!row || row.ok !== true) {
    return deny("unknown", "Unable to list support tickets.");
  }

  const items = Array.isArray(row.items) ? row.items : [];
  const pagination =
    row.pagination && typeof row.pagination === "object"
      ? (row.pagination as Record<string, unknown>)
      : {};

  return {
    ok: true,
    live: true,
    source: "app_portal_support_requests",
    privacy_note:
      typeof row.privacy_note === "string"
        ? row.privacy_note
        : "Platform Support read of APP ticket SoT.",
    channel_values: APP_PORTAL_SUPPORT_CHANNEL_VALUES,
    items: items as PlatformSupportTicketsListItem[],
    pagination: {
      page: Number(pagination.page) || 1,
      page_size: Number(pagination.page_size) || 25,
      total: Number(pagination.total) || 0,
      total_pages: Number(pagination.total_pages) || 0,
    },
    filters:
      row.filters && typeof row.filters === "object"
        ? (row.filters as Record<string, unknown>)
        : {},
  };
}

export async function getPlatformSupportTicket(
  supabase: RpcClient,
  id: string | null | undefined,
): Promise<
  | PlatformSupportTicketsGetOk
  | PlatformSupportTicketsReadDenied
  | (PlatformSupportTicketsReadDenied & { found: false })
> {
  if (!canInvokePlatformSupportTicketsReadRpc()) {
    return denyInactivePlatformSupportTicketsRead();
  }

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return {
      ...deny("not_found", "Support ticket not found."),
      found: false as const,
    };
  }

  const { data, error } = await supabase.rpc(
    "get_platform_app_portal_support_request",
    { p_id: id },
  );

  if (error) {
    const message = error.message ?? "";
    if (isAccessDeniedMessage(message)) {
      return deny("forbidden", "Forbidden");
    }
    if (isMissingRpcMessage(message)) {
      return deny("rpc_unavailable", "Support ticket read RPC is unavailable.");
    }
    return deny("unknown", "Unable to load support ticket.");
  }

  const row =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;

  if (!row || row.found === false || row.ok === false) {
    return {
      ...deny("not_found", "Support ticket not found."),
      found: false as const,
    };
  }

  return {
    ok: true,
    live: true,
    found: true,
    source: "app_portal_support_requests",
    privacy_note:
      typeof row.privacy_note === "string"
        ? row.privacy_note
        : "Platform Support detail read of APP ticket SoT.",
    item:
      row.item && typeof row.item === "object"
        ? (row.item as Record<string, unknown>)
        : {},
    timeline: Array.isArray(row.timeline) ? row.timeline : [],
  };
}

export async function getPlatformSupportTicketCounts(
  supabase: RpcClient,
): Promise<PlatformSupportTicketsCountsOk | PlatformSupportTicketsReadDenied> {
  if (!canInvokePlatformSupportTicketsReadRpc()) {
    return denyInactivePlatformSupportTicketsRead();
  }

  const { data, error } = await supabase.rpc(
    "get_platform_app_portal_support_request_counts",
  );

  if (error) {
    const message = error.message ?? "";
    if (isAccessDeniedMessage(message)) {
      return deny("forbidden", "Forbidden");
    }
    if (isMissingRpcMessage(message)) {
      return deny("rpc_unavailable", "Support ticket read RPC is unavailable.");
    }
    return deny("unknown", "Unable to load support ticket counts.");
  }

  const row =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  if (!row || row.ok !== true) {
    return deny("unknown", "Unable to load support ticket counts.");
  }

  const counts =
    row.counts && typeof row.counts === "object"
      ? (row.counts as Record<string, unknown>)
      : {};

  return {
    ok: true,
    live: true,
    source: "app_portal_support_requests",
    privacy_note:
      typeof row.privacy_note === "string"
        ? row.privacy_note
        : "Counts are APP ticket SoT only.",
    counts: {
      total: Number(counts.total) || 0,
      open: Number(counts.open) || 0,
      waiting: Number(counts.waiting) || 0,
      resolved_or_closed: Number(counts.resolved_or_closed) || 0,
    },
  };
}

/** Map adapter denial to HTTP status for thin API routes. */
export function httpStatusForSupportTicketsReadDenial(
  code: PlatformSupportTicketsReadDenialCode,
): number {
  switch (code) {
    case "unauthorized":
      return 401;
    case "forbidden":
      return 403;
    case "not_found":
      return 404;
    case "invalid_argument":
      return 400;
    case "feature_gate_off":
    case "rpc_not_applied":
    case "ui_not_wired":
    case "rpc_unavailable":
      return 503;
    default:
      return 500;
  }
}
