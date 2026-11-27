/**
 * Platform ordinary primary-contact write (name + phone).
 * High-risk email / legal identity stay on update_platform_portal_customer_contact_email.
 * Persist only via security-definer RPC (SQL candidate until owner YES).
 */

import { isPlausibleE164 } from "@/lib/app/account-profile/phone";

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SECRET =
  /(sk-|rk_|bearer\s|password|secret|api[_-]?key|totp|mfa|authorization:)/i;

export const PRIMARY_CONTACT_WRITE_RPC =
  "update_platform_portal_customer_primary_contact" as const;

export type PlatformPrimaryContactWriteError =
  | "invalid_customer"
  | "invalid_full_name"
  | "invalid_phone"
  | "invalid_internal_reason"
  | "confirmation_required"
  | "nothing_to_update"
  | "unauthorized"
  | "forbidden"
  | "customer_not_found"
  | "update_failed"
  | "core_gate_pending"
  | "unknown";

export type PlatformPrimaryContactWriteInput = {
  customerId: string;
  fullName?: string;
  phone?: string;
  confirmation: boolean;
  internalReason: string;
  supportTicketReference?: string | null;
};

export type PlatformPrimaryContactWriteResult = {
  ok: true;
  customerId: string;
  previous: { fullName: string | null; phone: string | null };
  next: { fullName: string | null; phone: string | null };
  auditId: string | null;
};

export function parsePlatformPrimaryContactWriteInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: PlatformPrimaryContactWriteInput }
  | { ok: false; code: PlatformPrimaryContactWriteError } {
  if (!UUID.test(customerId)) return { ok: false, code: "invalid_customer" };
  const row =
    body && typeof body === "object" && !Array.isArray(body)
      ? (body as Record<string, unknown>)
      : null;
  if (!row) return { ok: false, code: "unknown" };
  if (row.confirmation !== true) return { ok: false, code: "confirmation_required" };

  const reason = String(row.internalReason ?? row.internal_reason ?? "").trim();
  if (reason.length < 3 || reason.length > 500 || SECRET.test(reason)) {
    return { ok: false, code: "invalid_internal_reason" };
  }

  const hasName =
    Object.prototype.hasOwnProperty.call(row, "fullName") ||
    Object.prototype.hasOwnProperty.call(row, "full_name");
  const hasPhone = Object.prototype.hasOwnProperty.call(row, "phone");
  if (!hasName && !hasPhone) return { ok: false, code: "nothing_to_update" };

  let fullName: string | undefined;
  if (hasName) {
    const raw = String(row.fullName ?? row.full_name ?? "").trim();
    if (raw.length < 1 || raw.length > 120) return { ok: false, code: "invalid_full_name" };
    fullName = raw;
  }

  let phone: string | undefined;
  if (hasPhone) {
    const raw = String(row.phone ?? "").trim();
    if (raw.length > 0 && !isPlausibleE164(raw)) {
      return { ok: false, code: "invalid_phone" };
    }
    phone = raw;
  }

  const ticket =
    typeof row.supportTicketReference === "string"
      ? row.supportTicketReference.trim().slice(0, 80)
      : typeof row.support_ticket_reference === "string"
        ? row.support_ticket_reference.trim().slice(0, 80)
        : null;

  return {
    ok: true,
    value: {
      customerId,
      fullName,
      phone,
      confirmation: true,
      internalReason: reason,
      supportTicketReference: ticket || null,
    },
  };
}

export type PrimaryContactWriteClients = {
  userClient: {
    rpc: (
      fn: string,
      args?: Record<string, unknown>,
    ) => PromiseLike<{ data: unknown; error: { message?: string; code?: string } | null }>;
  };
};

function mapRpcError(message: string | undefined): PlatformPrimaryContactWriteError {
  const m = (message ?? "").toLowerCase();
  if (m.includes("function") && (m.includes("does not exist") || m.includes("not found"))) {
    return "core_gate_pending";
  }
  if (m.includes("forbidden") || m.includes("not authorized") || m.includes("platform_admin")) {
    return "forbidden";
  }
  if (m.includes("not found") || m.includes("customer_not_found")) {
    return "customer_not_found";
  }
  if (m.includes("confirmation")) return "confirmation_required";
  if (m.includes("phone")) return "invalid_phone";
  if (m.includes("full_name") || m.includes("name")) return "invalid_full_name";
  return "update_failed";
}

/**
 * Persist primary contact name/phone via Core RPC.
 * Fail-closed with core_gate_pending until SQL candidate is applied.
 */
export async function writePlatformCustomerPrimaryContact(
  clients: PrimaryContactWriteClients,
  input: PlatformPrimaryContactWriteInput,
): Promise<
  | PlatformPrimaryContactWriteResult
  | { ok: false; code: PlatformPrimaryContactWriteError }
> {
  const { data, error } = await clients.userClient.rpc(PRIMARY_CONTACT_WRITE_RPC, {
    p_customer_id: input.customerId,
    p_full_name: input.fullName ?? null,
    p_phone: input.phone ?? null,
    p_update_full_name: input.fullName !== undefined,
    p_update_phone: input.phone !== undefined,
    p_confirmation: input.confirmation,
    p_internal_reason: input.internalReason,
    p_support_ticket_reference: input.supportTicketReference,
  });

  if (error) {
    return { ok: false, code: mapRpcError(error.message) };
  }

  const row =
    data && typeof data === "object" && !Array.isArray(data)
      ? (data as Record<string, unknown>)
      : null;
  if (!row || row.ok !== true) {
    const code =
      typeof row?.code === "string"
        ? (row.code as PlatformPrimaryContactWriteError)
        : "update_failed";
    return { ok: false, code };
  }

  const previous = (row.previous ?? {}) as Record<string, unknown>;
  const next = (row.next ?? {}) as Record<string, unknown>;

  return {
    ok: true,
    customerId: input.customerId,
    previous: {
      fullName: typeof previous.full_name === "string" ? previous.full_name : null,
      phone: typeof previous.phone === "string" ? previous.phone : null,
    },
    next: {
      fullName: typeof next.full_name === "string" ? next.full_name : null,
      phone: typeof next.phone === "string" ? next.phone : null,
    },
    auditId: typeof row.audit_id === "string" ? row.audit_id : null,
  };
}
