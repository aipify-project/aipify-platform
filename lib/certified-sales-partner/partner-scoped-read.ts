/**
 * Partner-scoped CSP reads (service role) — SERVER ONLY.
 *
 * Every query is filtered by the caller's own `partner_id` AND every returned row is re-checked
 * in memory against that id (defence in depth). `customer_org_id` is used only to join a lead to
 * its own sale on the server and is NEVER part of the returned payload. No payment method,
 * invoice, bank or customer-organisation data is selected for output.
 */
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { isCspPartnerPortalStatusAllowed } from "./partner-access";

export const CSP_PARTNER_LIST_LIMIT = 500;

type QueryResult = { data: unknown; error: { code?: string; message?: string } | null };

/** Minimal structural client so the read logic can be unit tested with a recording fake. */
export type CspListQuery = PromiseLike<QueryResult> & {
  select: (columns: string) => CspListQuery;
  eq: (column: string, value: string) => CspListQuery;
  in: (column: string, values: string[]) => CspListQuery;
  order: (column: string, options: { ascending: boolean }) => CspListQuery;
  limit: (count: number) => CspListQuery;
};
export type CspListClient = { from: (table: string) => CspListQuery };

export class CspScopedReadError extends Error {
  readonly kind: "not_applied" | "failed";
  constructor(kind: "not_applied" | "failed", message: string) {
    super(message);
    this.name = "CspScopedReadError";
    this.kind = kind;
  }
}

const NOT_APPLIED_CODES = ["42P01", "PGRST205", "PGRST202"];

function toError(error: { code?: string; message?: string }): CspScopedReadError {
  const message = error.message ?? error.code ?? "query_failed";
  const missing =
    (error.code !== undefined && NOT_APPLIED_CODES.includes(error.code)) ||
    /does not exist|schema cache/i.test(message);
  return new CspScopedReadError(missing ? "not_applied" : "failed", message);
}

function rec(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {};
}

async function rows(query: CspListQuery): Promise<Array<Record<string, unknown>>> {
  const { data, error } = await query;
  if (error) throw toError(error);
  if (data === null || data === undefined) return [];
  if (!Array.isArray(data)) throw new CspScopedReadError("failed", "unexpected_result_shape");
  return data.map(rec);
}

function requirePartnerId(partnerId: string): void {
  if (typeof partnerId !== "string" || partnerId.trim() === "") {
    throw new CspScopedReadError("failed", "partner_id_required");
  }
}

function ownRows(list: Array<Record<string, unknown>>, partnerId: string): Array<Record<string, unknown>> {
  return list.filter((row) => row.partner_id === partnerId);
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

async function loadProductKeys(client: CspListClient, productIds: string[]): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (productIds.length === 0) return map;
  // Product catalog is global reference data (not partner data); only ids from own rows are requested.
  const products = await rows(client.from("csp_sales_products").select("id, product_key").in("id", productIds));
  for (const p of products) {
    const id = str(p.id);
    const key = str(p.product_key);
    if (id && key) map.set(id, key);
  }
  return map;
}

export type CspLeadPayloadRow = {
  id: string | null;
  link_code: string | null;
  channel: string | null;
  attributed_at: string | null;
  registered_at: string | null;
  window_expires_at: string | null;
  product_key: string | null;
  sale_status: string | null;
};

/** Own attributed registrations (+ own link code/channel and own latest sale outcome). */
export async function loadCspPartnerLeads(client: CspListClient, partnerId: string): Promise<CspLeadPayloadRow[]> {
  requirePartnerId(partnerId);

  const registrations = ownRows(
    await rows(
      client
        .from("csp_attributed_registrations")
        .select("id, partner_id, link_id, customer_org_id, attributed_at, registered_at, window_expires_at")
        .eq("partner_id", partnerId)
        .order("registered_at", { ascending: false })
        .limit(CSP_PARTNER_LIST_LIMIT),
    ),
    partnerId,
  );
  if (registrations.length === 0) return [];

  const linkIds = [...new Set(registrations.map((r) => str(r.link_id)).filter((v): v is string => v !== null))];
  const orgIds = [...new Set(registrations.map((r) => str(r.customer_org_id)).filter((v): v is string => v !== null))];

  const links = new Map<string, { code: string | null; channel: string | null }>();
  if (linkIds.length > 0) {
    const linkRows = ownRows(
      await rows(
        client
          .from("csp_attribution_links")
          .select("id, partner_id, code, channel_origin")
          .eq("partner_id", partnerId)
          .in("id", linkIds),
      ),
      partnerId,
    );
    for (const l of linkRows) {
      const id = str(l.id);
      if (id) links.set(id, { code: str(l.code), channel: str(l.channel_origin) });
    }
  }

  // Own sales only, newest first, so the first one seen per customer is the latest outcome.
  const salesByOrg = new Map<string, { productId: string | null; status: string | null }>();
  if (orgIds.length > 0) {
    const saleRows = ownRows(
      await rows(
        client
          .from("csp_qualified_sales")
          .select("partner_id, customer_org_id, product_id, status, created_at")
          .eq("partner_id", partnerId)
          .in("customer_org_id", orgIds)
          .order("created_at", { ascending: false })
          .limit(CSP_PARTNER_LIST_LIMIT),
      ),
      partnerId,
    );
    for (const sale of saleRows) {
      const org = str(sale.customer_org_id);
      if (org && !salesByOrg.has(org)) {
        salesByOrg.set(org, { productId: str(sale.product_id), status: str(sale.status) });
      }
    }
  }
  const productKeys = await loadProductKeys(
    client,
    [...new Set([...salesByOrg.values()].map((s) => s.productId).filter((v): v is string => v !== null))],
  );

  return registrations.map((r) => {
    const link = str(r.link_id) ? links.get(str(r.link_id) as string) : undefined;
    const sale = str(r.customer_org_id) ? salesByOrg.get(str(r.customer_org_id) as string) : undefined;
    return {
      id: str(r.id),
      link_code: link?.code ?? null,
      channel: link?.channel ?? null,
      attributed_at: str(r.attributed_at),
      registered_at: str(r.registered_at),
      window_expires_at: str(r.window_expires_at),
      product_key: sale?.productId ? (productKeys.get(sale.productId) ?? null) : null,
      sale_status: sale?.status ?? null,
    };
  });
}

export type CspCustomerPayloadRow = {
  id: string | null;
  product_key: string | null;
  status: string | null;
  paid_periods_count: number | null;
  snapshot_amount: number | null;
  snapshot_currency: string | null;
  attributed_at: string | null;
  first_confirmed_at: string | null;
};

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

/** Own qualified sales — status, dates and commission snapshot only. */
export async function loadCspPartnerCustomers(
  client: CspListClient,
  partnerId: string,
): Promise<CspCustomerPayloadRow[]> {
  requirePartnerId(partnerId);

  const sales = ownRows(
    await rows(
      client
        .from("csp_qualified_sales")
        .select(
          "id, partner_id, product_id, status, attributed_at, first_confirmed_at, paid_periods_count, snapshot_amount, snapshot_currency, created_at",
        )
        .eq("partner_id", partnerId)
        .order("created_at", { ascending: false })
        .limit(CSP_PARTNER_LIST_LIMIT),
    ),
    partnerId,
  );
  if (sales.length === 0) return [];

  const productKeys = await loadProductKeys(
    client,
    [...new Set(sales.map((s) => str(s.product_id)).filter((v): v is string => v !== null))],
  );

  return sales.map((s) => ({
    id: str(s.id),
    product_key: str(s.product_id) ? (productKeys.get(str(s.product_id) as string) ?? null) : null,
    status: str(s.status),
    paid_periods_count: num(s.paid_periods_count),
    snapshot_amount: num(s.snapshot_amount),
    snapshot_currency: str(s.snapshot_currency),
    attributed_at: str(s.attributed_at),
    first_confirmed_at: str(s.first_confirmed_at),
  }));
}

export type CspPartnerScope =
  | { ok: true; partnerId: string; status: string }
  | { ok: false; reason: "partner_not_found" | "partner_not_active" | "lookup_failed" };

/**
 * Resolves the caller's own partner id from the SESSION user id (`csp_partner_profiles.auth_user_id`).
 * Never accepts a partner id from the client. Only approved/active-style statuses unlock reads.
 */
export async function resolveCspPartnerScope(authUserId: string): Promise<CspPartnerScope> {
  if (!authUserId) return { ok: false, reason: "partner_not_found" };
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_partner_profiles")
      .select("id, status")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (error) return { ok: false, reason: "lookup_failed" };
    if (!data) return { ok: false, reason: "partner_not_found" };
    const id = typeof data.id === "string" && data.id ? data.id : null;
    if (!id) return { ok: false, reason: "lookup_failed" };
    if (!isCspPartnerPortalStatusAllowed(data.status)) return { ok: false, reason: "partner_not_active" };
    return { ok: true, partnerId: id, status: data.status };
  } catch {
    return { ok: false, reason: "lookup_failed" };
  }
}

/** Service-role client typed for the partner-scoped readers. Server only. */
export function createCspListClient(): CspListClient {
  return createServiceRoleClient() as unknown as CspListClient;
}
