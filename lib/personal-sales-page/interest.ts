import { rejectClientSellerIdentity } from "./lead-gate";
import { classifyPersonalSalesCode } from "./contract";

export type InterestError =
  | "invalid_email"
  | "invalid_name"
  | "acknowledgement_required"
  | "invalid"
  | "closed"
  | "rejected_identity"
  | "invalid_product"
  | "rate_limited"
  | "core_pending";

export type NormalizedInterest = {
  code: string;
  email: string;
  displayName: string;
  productKey: string;
  locale: string;
  idempotencyKey: string;
  followUpAcknowledged: true;
  companyWebsite: string;
};

const EMAIL = /^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,}$/;
const LOCALES = new Set(["en", "no", "sv", "da", "pl", "uk", "es"]);

export function validatePersonalPageInterest(
  body: unknown,
): { ok: true; value: NormalizedInterest } | { ok: false; error: InterestError } {
  if (!body || typeof body !== "object") return { ok: false, error: "invalid" };
  if (rejectClientSellerIdentity(body)) return { ok: false, error: "rejected_identity" };
  const row = body as Record<string, unknown>;
  const companyWebsite = typeof row.company_website === "string" ? row.company_website.trim() : "";
  if (companyWebsite) return { ok: false, error: "closed" };
  if (row.follow_up_acknowledged !== true) return { ok: false, error: "acknowledgement_required" };

  const code = typeof row.code === "string" ? row.code.trim() : "";
  if (!code || classifyPersonalSalesCode(code) === "invalid") return { ok: false, error: "closed" };

  const email = typeof row.email === "string" ? row.email.trim().toLowerCase() : "";
  const displayName =
    typeof row.display_name === "string" ? row.display_name.replace(/[<>]/g, "").trim().slice(0, 120) : "";
  const productKey = typeof row.product_key === "string" ? row.product_key.trim().toLowerCase() : "";
  const locale = typeof row.locale === "string" ? row.locale.trim().toLowerCase() : "";
  const idempotencyKey = typeof row.idempotency_key === "string" ? row.idempotency_key.trim() : "";

  if (!EMAIL.test(email) || email.length > 254) return { ok: false, error: "invalid_email" };
  if (!displayName) return { ok: false, error: "invalid_name" };
  if (!/^[a-z0-9_]{2,40}$/.test(productKey) || !LOCALES.has(locale)) return { ok: false, error: "invalid" };
  if (!/^[A-Za-z0-9_-]{8,80}$/.test(idempotencyKey)) return { ok: false, error: "invalid" };

  return {
    ok: true,
    value: {
      code,
      email,
      displayName,
      productKey,
      locale,
      idempotencyKey,
      followUpAcknowledged: true,
      companyWebsite: "",
    },
  };
}

export type PersonalPageInterestRow = {
  id: string;
  contactName: string;
  contactEmail: string;
  productKey: string;
  registeredAt: string;
  source: "personal_sales_page";
  followUpStatus: string;
  partnerName: string | null;
};

/** Keeps only rows from the personal page. Drops anything that is not that source. */
export function parsePersonalPageInterests(data: unknown): PersonalPageInterestRow[] {
  const record = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const list = Array.isArray(record.interests) ? record.interests : Array.isArray(data) ? data : [];
  const rows: PersonalPageInterestRow[] = [];
  for (const item of list) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    if (row.lead_source !== "personal_sales_page") continue;
    const email = typeof row.contact_email === "string" ? row.contact_email : "";
    const name = typeof row.contact_name === "string" ? row.contact_name : "";
    const productKey = typeof row.product_key === "string" ? row.product_key : "";
    const registeredAt = typeof row.registered_at === "string" ? row.registered_at : "";
    const id = typeof row.id === "string" ? row.id : "";
    const status = typeof row.lead_status === "string" ? row.lead_status : "";
    if (!id || !email || !name || !productKey || !registeredAt || !status) continue;
    rows.push({
      id,
      contactName: name,
      contactEmail: email,
      productKey,
      registeredAt,
      source: "personal_sales_page",
      followUpStatus: status,
      partnerName: typeof row.partner_name === "string" ? row.partner_name : null,
    });
  }
  return rows;
}

/** A stored duplicate is not a new success. A missing write is never a success. */
export function interestStored(result: unknown): boolean {
  if (!result || typeof result !== "object") return false;
  return (result as { stored?: unknown }).stored === true;
}

export function mapInterestRpcError(result: unknown): InterestError {
  if (!result || typeof result !== "object") return "closed";
  const error = (result as { error?: unknown }).error;
  if (error === "invalid_email") return "invalid_email";
  if (error === "invalid_name") return "invalid_name";
  if (error === "acknowledgement_required") return "acknowledgement_required";
  if (error === "invalid_product") return "invalid_product";
  if (error === "rate_limited") return "rate_limited";
  if (error === "invalid") return "invalid";
  if (error === "closed") return "closed";
  return "closed";
}
