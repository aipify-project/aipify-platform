/**
 * Platform Admin list loaders for SELGERE ops pages.
 * Service-role reads after `guardPrivilegedPlatformApi` — never invent sales/commission rows.
 */
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type Row = Record<string, unknown>;

/** Service-role client type; tests may inject a minimal stand-in. */
export type CspAdminClient = ReturnType<typeof createServiceRoleClient>;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

function bool(v: unknown): boolean | null {
  return typeof v === "boolean" ? v : null;
}

export type CspAttributionLinkRow = {
  id: string;
  partnerId: string;
  code: string;
  channelOrigin: string | null;
  active: boolean;
  createdAt: string | null;
  clickCount: number;
  uniqueVisits: number;
  registrationCount: number;
  partnerName: string | null;
};

export type CspLeadSaleRow = {
  id: string;
  kind: "registration" | "qualified_sale";
  partnerId: string;
  partnerName: string | null;
  productId: string | null;
  productKey: string | null;
  status: string | null;
  attributedAt: string | null;
  amount: number | null;
  currency: string | null;
  paidPeriodsCount: number | null;
};

export type CspAuditEventRow = {
  id: string;
  action: string;
  actorKind: string | null;
  subjectTable: string | null;
  subjectId: string | null;
  createdAt: string | null;
  detail: Record<string, unknown> | null;
};

export type CspCommissionRateRow = {
  id: string;
  productId: string;
  productKey: string | null;
  productTitle: string | null;
  amount: number | null;
  currency: string | null;
  effectiveFrom: string | null;
  createdAt: string | null;
};

export type CspSellerRankRow = {
  partnerId: string;
  displayName: string | null;
  country: string | null;
  status: string;
  clicks: number;
  registrations: number;
  qualifiedSales: number;
  avatarUrl: string | null;
};

export type PlatformListResult<T> =
  | { kind: "ok"; rows: T[] }
  | { kind: "error"; detail?: string };

async function partnerNameMap(
  admin: CspAdminClient,
  ids: string[],
): Promise<Map<string, { name: string | null; country: string | null; status: string; avatarUrl: string | null }>> {
  const map = new Map<string, { name: string | null; country: string | null; status: string; avatarUrl: string | null }>();
  if (ids.length === 0) return map;
  const unique = [...new Set(ids)];
  const { data, error } = await admin
    .from("csp_partner_profiles")
    .select("id, display_name, country, status, auth_user_id")
    .in("id", unique);
  if (error || !data) return map;

  const authIds = data.map((r) => str((r as Row).auth_user_id)).filter((v): v is string => !!v);
  const avatarByAuth = new Map<string, string | null>();
  for (const authId of authIds.slice(0, 50)) {
    try {
      const { data: userData } = await admin.auth.admin.getUserById(authId);
      const meta = (userData?.user?.user_metadata ?? {}) as Row;
      avatarByAuth.set(
        authId,
        str(meta.avatar_url) ?? str(meta.profile_image_url) ?? str(meta.picture) ?? null,
      );
    } catch {
      avatarByAuth.set(authId, null);
    }
  }

  for (const raw of data) {
    const r = raw as Row;
    const id = str(r.id);
    if (!id) continue;
    const authUserId = str(r.auth_user_id);
    map.set(id, {
      name: str(r.display_name),
      country: str(r.country),
      status: str(r.status) ?? "unknown",
      avatarUrl: authUserId ? avatarByAuth.get(authUserId) ?? null : null,
    });
  }
  return map;
}

export async function listCspAttributionLinks(adminOverride?: CspAdminClient): Promise<PlatformListResult<CspAttributionLinkRow>> {
  try {
    const admin = adminOverride ?? createServiceRoleClient();
    const { data: links, error } = await admin
      .from("csp_attribution_links")
      .select("id, partner_id, code, channel_origin, active, created_at")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return { kind: "error", detail: error.message };
    const rows = (links ?? []) as Row[];
    const linkIds = rows.map((r) => str(r.id)).filter((v): v is string => !!v);
    const partnerIds = rows.map((r) => str(r.partner_id)).filter((v): v is string => !!v);
    const names = await partnerNameMap(admin, partnerIds);

    const clickByLink = new Map<string, number>();
    const uniqueByLink = new Map<string, number>();
    const regByLink = new Map<string, number>();

    if (linkIds.length > 0) {
      const { data: events } = await admin
        .from("csp_attribution_events")
        .select("link_id, event_type")
        .in("link_id", linkIds)
        .limit(10000);
      for (const raw of events ?? []) {
        const e = raw as Row;
        const linkId = str(e.link_id);
        if (!linkId) continue;
        const type = (str(e.event_type) ?? "").toLowerCase();
        if (type === "click" || type === "link_click") {
          clickByLink.set(linkId, (clickByLink.get(linkId) ?? 0) + 1);
        }
        if (type === "unique_visit" || type === "visit" || type === "unique_click") {
          uniqueByLink.set(linkId, (uniqueByLink.get(linkId) ?? 0) + 1);
        }
      }
      const { data: regs } = await admin
        .from("csp_attributed_registrations")
        .select("link_id")
        .in("link_id", linkIds)
        .limit(5000);
      for (const raw of regs ?? []) {
        const linkId = str((raw as Row).link_id);
        if (!linkId) continue;
        regByLink.set(linkId, (regByLink.get(linkId) ?? 0) + 1);
      }
    }

    return {
      kind: "ok",
      rows: rows.flatMap((r) => {
        const id = str(r.id);
        const partnerId = str(r.partner_id);
        const code = str(r.code);
        if (!id || !partnerId || !code) return [];
        const partner = names.get(partnerId);
        return [
          {
            id,
            partnerId,
            code,
            channelOrigin: str(r.channel_origin),
            active: bool(r.active) ?? false,
            createdAt: str(r.created_at),
            clickCount: clickByLink.get(id) ?? 0,
            uniqueVisits: uniqueByLink.get(id) ?? clickByLink.get(id) ?? 0,
            registrationCount: regByLink.get(id) ?? 0,
            partnerName: partner?.name ?? null,
          },
        ];
      }),
    };
  } catch (e) {
    return { kind: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

export async function listCspLeadsAndSales(adminOverride?: CspAdminClient): Promise<PlatformListResult<CspLeadSaleRow>> {
  try {
    const admin = adminOverride ?? createServiceRoleClient();
    const { data: sales, error: salesError } = await admin
      .from("csp_qualified_sales")
      .select(
        "id, partner_id, product_id, status, attributed_at, snapshot_amount, snapshot_currency, paid_periods_count, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (salesError) return { kind: "error", detail: salesError.message };

    const { data: regs } = await admin
      .from("csp_attributed_registrations")
      .select("id, partner_id, attributed_at, registered_at, created_at")
      .order("created_at", { ascending: false })
      .limit(500);

    const productIds = (sales ?? [])
      .map((r) => str((r as Row).product_id))
      .filter((v): v is string => !!v);
    const productKeyById = new Map<string, string>();
    if (productIds.length > 0) {
      const { data: products } = await admin
        .from("csp_sales_products")
        .select("id, product_key")
        .in("id", [...new Set(productIds)]);
      for (const raw of products ?? []) {
        const r = raw as Row;
        const id = str(r.id);
        const key = str(r.product_key);
        if (id && key) productKeyById.set(id, key);
      }
    }

    const partnerIds = [
      ...(sales ?? []).map((r) => str((r as Row).partner_id)),
      ...(regs ?? []).map((r) => str((r as Row).partner_id)),
    ].filter((v): v is string => !!v);
    const names = await partnerNameMap(admin, partnerIds);

    const saleRows: CspLeadSaleRow[] = (sales ?? []).flatMap((raw) => {
      const r = raw as Row;
      const id = str(r.id);
      const partnerId = str(r.partner_id);
      if (!id || !partnerId) return [];
      const productId = str(r.product_id);
      return [
        {
          id,
          kind: "qualified_sale",
          partnerId,
          partnerName: names.get(partnerId)?.name ?? null,
          productId,
          productKey: productId ? productKeyById.get(productId) ?? null : null,
          status: str(r.status),
          attributedAt: str(r.attributed_at) ?? str(r.created_at),
          amount: num(r.snapshot_amount),
          currency: str(r.snapshot_currency),
          paidPeriodsCount: num(r.paid_periods_count),
        },
      ];
    });

    const regRows: CspLeadSaleRow[] = (regs ?? []).flatMap((raw) => {
      const r = raw as Row;
      const id = str(r.id);
      const partnerId = str(r.partner_id);
      if (!id || !partnerId) return [];
      return [
        {
          id,
          kind: "registration",
          partnerId,
          partnerName: names.get(partnerId)?.name ?? null,
          productId: null,
          productKey: null,
          status: "attributed",
          attributedAt: str(r.attributed_at) ?? str(r.registered_at) ?? str(r.created_at),
          amount: null,
          currency: null,
          paidPeriodsCount: null,
        },
      ];
    });

    const merged = [...saleRows, ...regRows].sort((a, b) => {
      const at = a.attributedAt ?? "";
      const bt = b.attributedAt ?? "";
      return bt.localeCompare(at);
    });

    return { kind: "ok", rows: merged };
  } catch (e) {
    return { kind: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

export async function listCspAuditEvents(limit = 200, adminOverride?: CspAdminClient): Promise<PlatformListResult<CspAuditEventRow>> {
  try {
    const admin = adminOverride ?? createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_audit_events")
      .select("id, actor_kind, action, subject_table, subject_id, detail, created_at")
      .order("created_at", { ascending: false })
      .limit(Math.min(Math.max(limit, 1), 500));
    if (error) return { kind: "error", detail: error.message };
    return {
      kind: "ok",
      rows: (data ?? []).flatMap((raw) => {
        const r = raw as Row;
        const id = str(r.id);
        const action = str(r.action);
        if (!id || !action) return [];
        const detail =
          r.detail && typeof r.detail === "object" && !Array.isArray(r.detail)
            ? (r.detail as Record<string, unknown>)
            : null;
        return [
          {
            id,
            action,
            actorKind: str(r.actor_kind),
            subjectTable: str(r.subject_table),
            subjectId: str(r.subject_id),
            createdAt: str(r.created_at),
            detail,
          },
        ];
      }),
    };
  } catch (e) {
    return { kind: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

export async function listCspCommissionRates(adminOverride?: CspAdminClient): Promise<PlatformListResult<CspCommissionRateRow>> {
  try {
    const admin = adminOverride ?? createServiceRoleClient();
    const { data: rates, error } = await admin
      .from("csp_commission_rate_versions")
      .select("id, product_id, amount, currency, effective_from, created_at")
      .order("effective_from", { ascending: false })
      .limit(500);
    if (error) return { kind: "error", detail: error.message };

    const productIds = (rates ?? [])
      .map((r) => str((r as Row).product_id))
      .filter((v): v is string => !!v);
    const productById = new Map<string, { key: string | null; title: string | null }>();
    if (productIds.length > 0) {
      const { data: products } = await admin
        .from("csp_sales_products")
        .select("id, product_key")
        .in("id", [...new Set(productIds)]);
      for (const raw of products ?? []) {
        const r = raw as Row;
        const id = str(r.id);
        if (!id) continue;
        const key = str(r.product_key);
        productById.set(id, { key, title: key });
      }
    }

    // Fallback: current product fixed amounts when no version history yet.
    if (!rates?.length) {
      const { data: products } = await admin
        .from("csp_sales_products")
        .select("id, product_key, fixed_commission_amount, currency, updated_at")
        .order("product_key");
      return {
        kind: "ok",
        rows: (products ?? []).flatMap((raw) => {
          const r = raw as Row;
          const id = str(r.id);
          if (!id) return [];
          const key = str(r.product_key);
          return [
            {
              id: `current-${id}`,
              productId: id,
              productKey: key,
              productTitle: key,
              amount: num(r.fixed_commission_amount),
              currency: str(r.currency),
              effectiveFrom: str(r.updated_at),
              createdAt: str(r.updated_at),
            },
          ];
        }),
      };
    }

    return {
      kind: "ok",
      rows: (rates ?? []).flatMap((raw) => {
        const r = raw as Row;
        const id = str(r.id);
        const productId = str(r.product_id);
        if (!id || !productId) return [];
        const product = productById.get(productId);
        return [
          {
            id,
            productId,
            productKey: product?.key ?? null,
            productTitle: product?.title ?? null,
            amount: num(r.amount),
            currency: str(r.currency),
            effectiveFrom: str(r.effective_from),
            createdAt: str(r.created_at),
          },
        ];
      }),
    };
  } catch (e) {
    return { kind: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

/** Rank sellers by click volume (default), then registrations, then qualified sales. */
export async function listCspSellerRanking(adminOverride?: CspAdminClient): Promise<PlatformListResult<CspSellerRankRow>> {
  try {
    const admin = adminOverride ?? createServiceRoleClient();
    const { data: partners, error } = await admin
      .from("csp_partner_profiles")
      .select("id, display_name, country, status, auth_user_id")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return { kind: "error", detail: error.message };

    const partnerIds = (partners ?? []).map((r) => str((r as Row).id)).filter((v): v is string => !!v);
    const names = await partnerNameMap(admin, partnerIds);

    const clicks = new Map<string, number>();
    const regs = new Map<string, number>();
    const sales = new Map<string, number>();

    const { data: links } = await admin.from("csp_attribution_links").select("id, partner_id").limit(2000);
    const linkToPartner = new Map<string, string>();
    for (const raw of links ?? []) {
      const r = raw as Row;
      const id = str(r.id);
      const partnerId = str(r.partner_id);
      if (id && partnerId) linkToPartner.set(id, partnerId);
    }
    const linkIds = [...linkToPartner.keys()];
    if (linkIds.length > 0) {
      const { data: events } = await admin
        .from("csp_attribution_events")
        .select("link_id, event_type")
        .in("link_id", linkIds)
        .limit(20000);
      for (const raw of events ?? []) {
        const e = raw as Row;
        const linkId = str(e.link_id);
        const partnerId = linkId ? linkToPartner.get(linkId) : null;
        if (!partnerId) continue;
        const type = (str(e.event_type) ?? "").toLowerCase();
        if (type.includes("click") || type === "visit" || type === "unique_visit") {
          clicks.set(partnerId, (clicks.get(partnerId) ?? 0) + 1);
        }
      }
    }

    const { data: regRows } = await admin.from("csp_attributed_registrations").select("partner_id").limit(5000);
    for (const raw of regRows ?? []) {
      const partnerId = str((raw as Row).partner_id);
      if (!partnerId) continue;
      regs.set(partnerId, (regs.get(partnerId) ?? 0) + 1);
    }

    const { data: saleRows } = await admin.from("csp_qualified_sales").select("partner_id").limit(5000);
    for (const raw of saleRows ?? []) {
      const partnerId = str((raw as Row).partner_id);
      if (!partnerId) continue;
      sales.set(partnerId, (sales.get(partnerId) ?? 0) + 1);
    }

    const ranked: CspSellerRankRow[] = (partners ?? []).flatMap((raw) => {
      const r = raw as Row;
      const id = str(r.id);
      if (!id) return [];
      const meta = names.get(id);
      return [
        {
          partnerId: id,
          displayName: meta?.name ?? str(r.display_name),
          country: meta?.country ?? str(r.country),
          status: meta?.status ?? str(r.status) ?? "unknown",
          clicks: clicks.get(id) ?? 0,
          registrations: regs.get(id) ?? 0,
          qualifiedSales: sales.get(id) ?? 0,
          avatarUrl: meta?.avatarUrl ?? null,
        },
      ];
    });

    ranked.sort((a, b) => {
      if (b.clicks !== a.clicks) return b.clicks - a.clicks;
      if (b.registrations !== a.registrations) return b.registrations - a.registrations;
      return b.qualifiedSales - a.qualifiedSales;
    });

    return { kind: "ok", rows: ranked };
  } catch (e) {
    return { kind: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}
