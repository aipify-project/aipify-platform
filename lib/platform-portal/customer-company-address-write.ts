/**
 * Platform ordinary company + invoice address write.
 * Legal name / organization number stay locked (high-risk identity).
 * Persist only via security-definer RPC (SQL candidate until owner YES).
 */

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const SECRET =
  /(sk-|rk_|bearer\s|password|secret|api[_-]?key|totp|mfa|authorization:)/i;

const E164 = /^\+[1-9][0-9]{6,14}$/;

export const COMPANY_ADDRESS_WRITE_RPC =
  "update_platform_portal_customer_company_address" as const;

/**
 * Flip to true only after the SQL candidate is applied and verified in Core.
 * Until then the Platform UI must stay locked with an honest Core-activation message.
 */
export const COMPANY_ADDRESS_WRITE_CORE_LIVE = false;

export type PlatformCompanyAddressWriteError =
  | "invalid_customer"
  | "invalid_display_name"
  | "invalid_website"
  | "invalid_company_phone"
  | "invalid_street"
  | "invalid_postal_code"
  | "invalid_city"
  | "invalid_country"
  | "invalid_invoice_street"
  | "invalid_invoice_postal_code"
  | "invalid_invoice_city"
  | "invalid_invoice_country"
  | "invalid_internal_reason"
  | "confirmation_required"
  | "nothing_to_update"
  | "unauthorized"
  | "forbidden"
  | "customer_not_found"
  | "registration_profile_missing"
  | "update_failed"
  | "core_gate_pending"
  | "unknown";

export type PlatformCompanyAddressWriteInput = {
  customerId: string;
  displayName?: string;
  website?: string;
  companyPhone?: string;
  street?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  updateCompany: boolean;
  invoiceStreet?: string;
  invoicePostalCode?: string;
  invoiceCity?: string;
  invoiceCountry?: string;
  updateInvoice: boolean;
  copyCompanyToInvoice: boolean;
  confirmation: boolean;
  internalReason: string;
  supportTicketReference?: string | null;
};

export type PlatformCompanyAddressWriteResult = {
  ok: true;
  customerId: string;
  previous: Record<string, unknown>;
  next: Record<string, unknown>;
  auditId: string | null;
};

function cleanOptionalText(value: unknown, max: number): string | undefined | "invalid" {
  if (value === undefined) return undefined;
  if (typeof value !== "string") return "invalid";
  const trimmed = value.trim();
  if (trimmed.length > max) return "invalid";
  return trimmed;
}

export function parsePlatformCompanyAddressWriteInput(
  customerId: string,
  body: unknown,
):
  | { ok: true; value: PlatformCompanyAddressWriteInput }
  | { ok: false; code: PlatformCompanyAddressWriteError } {
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

  const updateCompany = row.updateCompany === true || row.update_company === true;
  const updateInvoice = row.updateInvoice === true || row.update_invoice === true;
  const copyCompanyToInvoice =
    row.copyCompanyToInvoice === true || row.copy_company_to_invoice === true;

  if (!updateCompany && !updateInvoice) return { ok: false, code: "nothing_to_update" };

  const displayName = cleanOptionalText(row.displayName ?? row.display_name, 200);
  if (displayName === "invalid" || (typeof displayName === "string" && displayName.length < 1)) {
    return { ok: false, code: "invalid_display_name" };
  }

  const websiteRaw = cleanOptionalText(row.website, 500);
  if (websiteRaw === "invalid") return { ok: false, code: "invalid_website" };
  if (
    typeof websiteRaw === "string" &&
    websiteRaw.length > 0 &&
    (websiteRaw.toLowerCase().startsWith("javascript:") ||
      websiteRaw.toLowerCase().startsWith("data:"))
  ) {
    return { ok: false, code: "invalid_website" };
  }

  const companyPhone = cleanOptionalText(row.companyPhone ?? row.company_phone, 32);
  if (companyPhone === "invalid") return { ok: false, code: "invalid_company_phone" };
  if (typeof companyPhone === "string" && companyPhone.length > 0 && !E164.test(companyPhone)) {
    return { ok: false, code: "invalid_company_phone" };
  }

  const street = cleanOptionalText(row.street, 300);
  if (street === "invalid" || (typeof street === "string" && street.length < 1 && updateCompany && row.street !== undefined)) {
    return { ok: false, code: "invalid_street" };
  }

  const postalCode = cleanOptionalText(row.postalCode ?? row.postal_code, 32);
  if (postalCode === "invalid" || postalCode === "0000") {
    return { ok: false, code: "invalid_postal_code" };
  }

  const city = cleanOptionalText(row.city, 120);
  if (city === "invalid") return { ok: false, code: "invalid_city" };

  const countryRaw = cleanOptionalText(row.country, 2);
  if (countryRaw === "invalid") return { ok: false, code: "invalid_country" };
  const country =
    typeof countryRaw === "string" && countryRaw.length > 0
      ? countryRaw.toUpperCase()
      : countryRaw;
  if (typeof country === "string" && country.length > 0 && !/^[A-Z]{2}$/.test(country)) {
    return { ok: false, code: "invalid_country" };
  }

  const invoiceStreet = cleanOptionalText(row.invoiceStreet ?? row.invoice_street, 300);
  if (invoiceStreet === "invalid") return { ok: false, code: "invalid_invoice_street" };
  if (
    typeof invoiceStreet === "string" &&
    invoiceStreet.toLowerCase().includes("billing address pending")
  ) {
    return { ok: false, code: "invalid_invoice_street" };
  }

  const invoicePostal = cleanOptionalText(
    row.invoicePostalCode ?? row.invoice_postal_code,
    32,
  );
  if (invoicePostal === "invalid" || invoicePostal === "0000") {
    return { ok: false, code: "invalid_invoice_postal_code" };
  }

  const invoiceCity = cleanOptionalText(row.invoiceCity ?? row.invoice_city, 120);
  if (invoiceCity === "invalid") return { ok: false, code: "invalid_invoice_city" };

  const invoiceCountryRaw = cleanOptionalText(row.invoiceCountry ?? row.invoice_country, 2);
  if (invoiceCountryRaw === "invalid") return { ok: false, code: "invalid_invoice_country" };
  const invoiceCountry =
    typeof invoiceCountryRaw === "string" && invoiceCountryRaw.length > 0
      ? invoiceCountryRaw.toUpperCase()
      : invoiceCountryRaw;
  if (
    typeof invoiceCountry === "string" &&
    invoiceCountry.length > 0 &&
    !/^[A-Z]{2}$/.test(invoiceCountry)
  ) {
    return { ok: false, code: "invalid_invoice_country" };
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
      displayName: typeof displayName === "string" ? displayName : undefined,
      website: typeof websiteRaw === "string" ? websiteRaw : undefined,
      companyPhone: typeof companyPhone === "string" ? companyPhone : undefined,
      street: typeof street === "string" ? street : undefined,
      postalCode: typeof postalCode === "string" ? postalCode : undefined,
      city: typeof city === "string" ? city : undefined,
      country: typeof country === "string" ? country : undefined,
      updateCompany,
      invoiceStreet: typeof invoiceStreet === "string" ? invoiceStreet : undefined,
      invoicePostalCode: typeof invoicePostal === "string" ? invoicePostal : undefined,
      invoiceCity: typeof invoiceCity === "string" ? invoiceCity : undefined,
      invoiceCountry: typeof invoiceCountry === "string" ? invoiceCountry : undefined,
      updateInvoice,
      copyCompanyToInvoice,
      confirmation: true,
      internalReason: reason,
      supportTicketReference: ticket || null,
    },
  };
}

export type CompanyAddressWriteClients = {
  userClient: {
    rpc: (
      fn: string,
      args?: Record<string, unknown>,
    ) => PromiseLike<{ data: unknown; error: { message?: string; code?: string } | null }>;
  };
};

function mapRpcError(message: string | undefined): PlatformCompanyAddressWriteError {
  const m = (message ?? "").toLowerCase();
  if (m.includes("function") && (m.includes("does not exist") || m.includes("not found"))) {
    return "core_gate_pending";
  }
  if (m.includes("forbidden") || m.includes("not authorized") || m.includes("platform_admin")) {
    return "forbidden";
  }
  if (m.includes("customer_not_found")) return "customer_not_found";
  if (m.includes("registration_profile_missing")) return "registration_profile_missing";
  if (m.includes("confirmation")) return "confirmation_required";
  if (m.includes("display_name")) return "invalid_display_name";
  if (m.includes("website")) return "invalid_website";
  if (m.includes("company_phone") || m.includes("phone")) return "invalid_company_phone";
  if (m.includes("invoice_street")) return "invalid_invoice_street";
  if (m.includes("invoice_postal")) return "invalid_invoice_postal_code";
  if (m.includes("invoice_city")) return "invalid_invoice_city";
  if (m.includes("invoice_country")) return "invalid_invoice_country";
  if (m.includes("postal")) return "invalid_postal_code";
  if (m.includes("street")) return "invalid_street";
  if (m.includes("city")) return "invalid_city";
  if (m.includes("country")) return "invalid_country";
  return "update_failed";
}

export async function writePlatformCustomerCompanyAddress(
  clients: CompanyAddressWriteClients,
  input: PlatformCompanyAddressWriteInput,
): Promise<
  | PlatformCompanyAddressWriteResult
  | { ok: false; code: PlatformCompanyAddressWriteError }
> {
  if (!COMPANY_ADDRESS_WRITE_CORE_LIVE) {
    return { ok: false, code: "core_gate_pending" };
  }

  const { data, error } = await clients.userClient.rpc(COMPANY_ADDRESS_WRITE_RPC, {
    p_customer_id: input.customerId,
    p_display_name: input.displayName ?? null,
    p_website: input.website ?? null,
    p_company_phone: input.companyPhone ?? null,
    p_street: input.street ?? null,
    p_postal_code: input.postalCode ?? null,
    p_city: input.city ?? null,
    p_country: input.country ?? null,
    p_update_company: input.updateCompany,
    p_invoice_street: input.invoiceStreet ?? null,
    p_invoice_postal_code: input.invoicePostalCode ?? null,
    p_invoice_city: input.invoiceCity ?? null,
    p_invoice_country: input.invoiceCountry ?? null,
    p_update_invoice: input.updateInvoice,
    p_copy_company_to_invoice: input.copyCompanyToInvoice,
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
        ? (row.code as PlatformCompanyAddressWriteError)
        : "update_failed";
    return { ok: false, code };
  }

  return {
    ok: true,
    customerId: input.customerId,
    previous:
      row.previous && typeof row.previous === "object" && !Array.isArray(row.previous)
        ? (row.previous as Record<string, unknown>)
        : {},
    next:
      row.next && typeof row.next === "object" && !Array.isArray(row.next)
        ? (row.next as Record<string, unknown>)
        : {},
    auditId: typeof row.audit_id === "string" ? row.audit_id : null,
  };
}
