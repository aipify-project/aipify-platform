/**
 * Server-only. Partner-scoped read model for the canonical seller profile.
 * Callers must have passed the platform privileged guard. Every segment is read independently:
 * a segment that cannot be read is `null` (UI: "not reported"), never an invented empty value.
 */
import { isCspPartnerId } from "@/lib/certified-sales-partner/partner-admin-detail";
import {
  summarizeLedgerEarned,
  type SellerProfileAuditRow,
  type SellerProfileData,
  type SellerProfileLedgerEntry,
  type SellerProfileLink,
  type SellerProfileSale,
  type SellerProfileSettlement,
} from "@/lib/certified-sales-partner/seller-profile-view";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type Row = Record<string, unknown>;
type ServiceClient = ReturnType<typeof createServiceRoleClient>;

const LINK_LIMIT = 200;
const EVENT_LIMIT = 20000;
const SALE_LIMIT = 200;
const SETTLEMENT_LIMIT = 100;
const LEDGER_LIMIT = 500;
const AUDIT_LIMIT = 50;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

async function exactCount(
  run: () => PromiseLike<{ count: number | null; error: unknown }>,
): Promise<number | null> {
  try {
    const { count, error } = await run();
    return error || typeof count !== "number" ? null : count;
  } catch {
    return null;
  }
}

async function loadLinks(
  admin: ServiceClient,
  partnerId: string,
): Promise<{ links: SellerProfileLink[] | null; linkIds: string[]; clicks: number | null }> {
  try {
    const { data, error } = await admin
      .from("csp_attribution_links")
      .select("id, code, channel_origin, active, created_at")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(LINK_LIMIT);
    if (error || !Array.isArray(data)) return { links: null, linkIds: [], clicks: null };
    const rows = data as Row[];
    const linkIds = rows.map((r) => str(r.id)).filter((v): v is string => !!v);

    const clickByLink = new Map<string, number>();
    const regByLink = new Map<string, number>();
    let clicks: number | null = 0;
    if (linkIds.length > 0) {
      const events = await admin
        .from("csp_attribution_events")
        .select("link_id, event_type")
        .in("link_id", linkIds)
        .limit(EVENT_LIMIT);
      if (events.error || !Array.isArray(events.data)) {
        clicks = null;
      } else {
        for (const raw of events.data as Row[]) {
          const linkId = str(raw.link_id);
          if (!linkId || str(raw.event_type) !== "click") continue;
          clickByLink.set(linkId, (clickByLink.get(linkId) ?? 0) + 1);
        }
        // Truncated read → do not present a partial number as a total.
        clicks = events.data.length >= EVENT_LIMIT ? null : [...clickByLink.values()].reduce((a, b) => a + b, 0);
      }
      const regs = await admin
        .from("csp_attributed_registrations")
        .select("link_id")
        .eq("partner_id", partnerId)
        .limit(5000);
      if (!regs.error && Array.isArray(regs.data)) {
        for (const raw of regs.data as Row[]) {
          const linkId = str(raw.link_id);
          if (linkId) regByLink.set(linkId, (regByLink.get(linkId) ?? 0) + 1);
        }
      }
    }

    return {
      linkIds,
      clicks,
      links: rows.flatMap((r) => {
        const id = str(r.id);
        const code = str(r.code);
        if (!id || !code) return [];
        return [
          {
            id,
            code,
            channelOrigin: str(r.channel_origin),
            active: r.active === true,
            createdAt: str(r.created_at),
            clicks: clickByLink.get(id) ?? 0,
            registrations: regByLink.get(id) ?? 0,
          },
        ];
      }),
    };
  } catch {
    return { links: null, linkIds: [], clicks: null };
  }
}

async function loadSales(admin: ServiceClient, partnerId: string): Promise<SellerProfileSale[] | null> {
  try {
    const { data, error } = await admin
      .from("csp_qualified_sales")
      .select("id, product_id, status, attributed_at, snapshot_amount, snapshot_currency, paid_periods_count, created_at")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(SALE_LIMIT);
    if (error || !Array.isArray(data)) return null;
    const rows = data as Row[];
    const productIds = [...new Set(rows.map((r) => str(r.product_id)).filter((v): v is string => !!v))];
    const keyById = new Map<string, string>();
    if (productIds.length > 0) {
      const products = await admin.from("csp_sales_products").select("id, product_key").in("id", productIds);
      if (!products.error && Array.isArray(products.data)) {
        for (const p of products.data as Row[]) {
          const id = str(p.id);
          const key = str(p.product_key);
          if (id && key) keyById.set(id, key);
        }
      }
    }
    return rows.flatMap((r) => {
      const id = str(r.id);
      if (!id) return [];
      const productId = str(r.product_id);
      return [
        {
          id,
          productKey: productId ? (keyById.get(productId) ?? null) : null,
          status: str(r.status),
          attributedAt: str(r.attributed_at) ?? str(r.created_at),
          amount: num(r.snapshot_amount),
          currency: str(r.snapshot_currency),
          paidPeriodsCount: num(r.paid_periods_count),
        },
      ];
    });
  } catch {
    return null;
  }
}

async function loadSettlements(
  admin: ServiceClient,
  partnerId: string,
): Promise<SellerProfileSettlement[] | null> {
  try {
    const { data, error } = await admin
      .from("csp_monthly_settlements")
      .select("id, period_month, status, total_amount, currency, created_at")
      .eq("partner_id", partnerId)
      .order("period_month", { ascending: false })
      .limit(SETTLEMENT_LIMIT);
    if (error || !Array.isArray(data)) return null;
    return (data as Row[]).flatMap((r) => {
      const id = str(r.id);
      if (!id) return [];
      return [
        {
          id,
          periodMonth: str(r.period_month),
          status: str(r.status) ?? "unknown",
          totalAmount: num(r.total_amount),
          currency: str(r.currency),
          createdAt: str(r.created_at),
        },
      ];
    });
  } catch {
    return null;
  }
}

async function loadLedger(
  admin: ServiceClient,
  partnerId: string,
): Promise<SellerProfileData["ledger"]> {
  try {
    const { data, error } = await admin
      .from("csp_commission_ledger")
      .select("id, entry_type, amount, currency, created_at")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(LEDGER_LIMIT);
    if (error || !Array.isArray(data)) return null;
    const entries: SellerProfileLedgerEntry[] = (data as Row[]).flatMap((r) => {
      const id = str(r.id);
      const entryType = str(r.entry_type);
      if (!id || !entryType) return [];
      return [{ id, entryType, amount: num(r.amount), currency: str(r.currency), createdAt: str(r.created_at) }];
    });
    return {
      entries,
      earnedByCurrency: summarizeLedgerEarned(entries, data.length >= LEDGER_LIMIT),
    };
  } catch {
    return null;
  }
}

/** Audit events whose subject is the partner, one of its links, or one of its settlements. */
async function loadAudit(
  admin: ServiceClient,
  partnerId: string,
  linkIds: string[],
  settlementIds: string[],
): Promise<SellerProfileAuditRow[] | null> {
  try {
    const subjectIds = [partnerId, ...linkIds.slice(0, 100), ...settlementIds.slice(0, 100)];
    const { data, error } = await admin
      .from("csp_audit_events")
      .select("id, action, actor_kind, created_at")
      .in("subject_id", subjectIds)
      .order("created_at", { ascending: false })
      .limit(AUDIT_LIMIT);
    if (error || !Array.isArray(data)) return null;
    return (data as Row[]).flatMap((r) => {
      const id = str(r.id);
      const action = str(r.action);
      if (!id || !action) return [];
      return [{ id, action, actorKind: str(r.actor_kind), createdAt: str(r.created_at) }];
    });
  } catch {
    return null;
  }
}

export type CspPartnerProfileDataResult =
  | { kind: "found"; profile: SellerProfileData }
  | { kind: "not_found" }
  | { kind: "error" };

export async function fetchCspPartnerProfileData(partnerId: string): Promise<CspPartnerProfileDataResult> {
  if (!isCspPartnerId(partnerId)) return { kind: "not_found" };
  try {
    const admin = createServiceRoleClient();
    const exists = await admin.from("csp_partner_profiles").select("id").eq("id", partnerId).maybeSingle();
    if (exists.error) return { kind: "error" };
    if (!exists.data) return { kind: "not_found" };

    const [linkPart, sales, settlements, ledger, registrations, qualifiedSales, openSettlements] = await Promise.all([
      loadLinks(admin, partnerId),
      loadSales(admin, partnerId),
      loadSettlements(admin, partnerId),
      loadLedger(admin, partnerId),
      exactCount(() =>
        admin.from("csp_attributed_registrations").select("id", { count: "exact", head: true }).eq("partner_id", partnerId),
      ),
      exactCount(() =>
        admin.from("csp_qualified_sales").select("id", { count: "exact", head: true }).eq("partner_id", partnerId),
      ),
      exactCount(() =>
        admin
          .from("csp_monthly_settlements")
          .select("id", { count: "exact", head: true })
          .eq("partner_id", partnerId)
          .eq("status", "open"),
      ),
    ]);

    const audit = await loadAudit(
      admin,
      partnerId,
      linkPart.linkIds,
      (settlements ?? []).map((s) => s.id),
    );

    return {
      kind: "found",
      profile: {
        totals: {
          clicks: linkPart.clicks,
          registrations,
          qualifiedSales,
          openSettlements,
        },
        links: linkPart.links,
        sales,
        settlements,
        ledger,
        audit,
      },
    };
  } catch {
    return { kind: "error" };
  }
}
