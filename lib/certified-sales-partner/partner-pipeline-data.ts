/**
 * Partner-scoped leads/customers loaders — service-role reads filtered to the signed-in partner only.
 */
import { createServiceRoleClient } from "@/lib/supabase/service-role";

type Row = Record<string, unknown>;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

function num(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v))) return Number(v);
  return null;
}

export type PartnerLeadRow = {
  id: string;
  linkId: string | null;
  linkCode: string | null;
  attributedAt: string | null;
  registeredAt: string | null;
  status: "attributed";
};

export type PartnerCustomerSaleRow = {
  id: string;
  productId: string | null;
  productKey: string | null;
  status: string | null;
  attributedAt: string | null;
  firstConfirmedAt: string | null;
  paidPeriodsCount: number | null;
  amount: number | null;
  currency: string | null;
};

export type PartnerPipelineResult<T> =
  | { kind: "ok"; partnerId: string; rows: T[] }
  | { kind: "no_partner" }
  | { kind: "error"; detail?: string };

async function resolvePartnerIdForAuthUser(authUserId: string): Promise<string | null> {
  const admin = createServiceRoleClient();
  const { data, error } = await admin
    .from("csp_partner_profiles")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (error || !data) return null;
  return str((data as Row).id);
}

export async function listOwnCspLeads(authUserId: string): Promise<PartnerPipelineResult<PartnerLeadRow>> {
  try {
    const partnerId = await resolvePartnerIdForAuthUser(authUserId);
    if (!partnerId) return { kind: "no_partner" };
    const admin = createServiceRoleClient();
    const { data: regs, error } = await admin
      .from("csp_attributed_registrations")
      .select("id, link_id, attributed_at, registered_at, created_at")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return { kind: "error", detail: error.message };

    const linkIds = (regs ?? []).map((r) => str((r as Row).link_id)).filter((v): v is string => !!v);
    const codeByLink = new Map<string, string>();
    if (linkIds.length > 0) {
      const { data: links } = await admin
        .from("csp_attribution_links")
        .select("id, code, partner_id")
        .eq("partner_id", partnerId)
        .in("id", [...new Set(linkIds)]);
      for (const raw of links ?? []) {
        const r = raw as Row;
        const id = str(r.id);
        const code = str(r.code);
        if (id && code) codeByLink.set(id, code);
      }
    }

    return {
      kind: "ok",
      partnerId,
      rows: (regs ?? []).flatMap((raw) => {
        const r = raw as Row;
        const id = str(r.id);
        if (!id) return [];
        const linkId = str(r.link_id);
        return [
          {
            id,
            linkId,
            linkCode: linkId ? codeByLink.get(linkId) ?? null : null,
            attributedAt: str(r.attributed_at) ?? str(r.created_at),
            registeredAt: str(r.registered_at),
            status: "attributed" as const,
          },
        ];
      }),
    };
  } catch (e) {
    return { kind: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}

export async function listOwnCspCustomerSales(
  authUserId: string,
): Promise<PartnerPipelineResult<PartnerCustomerSaleRow>> {
  try {
    const partnerId = await resolvePartnerIdForAuthUser(authUserId);
    if (!partnerId) return { kind: "no_partner" };
    const admin = createServiceRoleClient();
    const { data: sales, error } = await admin
      .from("csp_qualified_sales")
      .select(
        "id, product_id, status, attributed_at, first_confirmed_at, paid_periods_count, snapshot_amount, snapshot_currency, created_at",
      )
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) return { kind: "error", detail: error.message };

    const productIds = (sales ?? [])
      .map((r) => str((r as Row).product_id))
      .filter((v): v is string => !!v);
    const keyById = new Map<string, string>();
    if (productIds.length > 0) {
      const { data: products } = await admin
        .from("csp_sales_products")
        .select("id, product_key")
        .in("id", [...new Set(productIds)]);
      for (const raw of products ?? []) {
        const r = raw as Row;
        const id = str(r.id);
        const key = str(r.product_key);
        if (id && key) keyById.set(id, key);
      }
    }

    return {
      kind: "ok",
      partnerId,
      rows: (sales ?? []).flatMap((raw) => {
        const r = raw as Row;
        const id = str(r.id);
        if (!id) return [];
        const productId = str(r.product_id);
        return [
          {
            id,
            productId,
            productKey: productId ? keyById.get(productId) ?? null : null,
            status: str(r.status),
            attributedAt: str(r.attributed_at) ?? str(r.created_at),
            firstConfirmedAt: str(r.first_confirmed_at),
            paidPeriodsCount: num(r.paid_periods_count),
            amount: num(r.snapshot_amount),
            currency: str(r.snapshot_currency),
          },
        ];
      }),
    };
  } catch (e) {
    return { kind: "error", detail: e instanceof Error ? e.message : String(e) };
  }
}
