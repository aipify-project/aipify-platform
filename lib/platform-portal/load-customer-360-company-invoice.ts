import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveAuthoritativeTimeZone } from "@/lib/platform-presentation-quality/bcp47";
import {
  buildCustomerCompanyProfile,
  type CustomerCompanyProfile,
} from "./customer-company-address";
import {
  calendarDateInTimeZone,
  summarizePlatformInvoices,
  type CustomerInvoiceSummary,
  type PlatformInvoiceInput,
} from "./customer-invoice-status";

function text(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function unavailableCompanyProfile(): CustomerCompanyProfile {
  return buildCustomerCompanyProfile(
    {
      readState: "unavailable",
      street: null,
      postalCode: null,
      city: null,
      country: null,
      website: null,
      organizationNumber: null,
      legalName: null,
    },
    {
      readState: "unavailable",
      rowPresent: false,
      street: null,
      postalCode: null,
      city: null,
      country: null,
    },
  );
}

export function unavailableInvoiceSummary(): CustomerInvoiceSummary {
  return summarizePlatformInvoices({ invoices: null, complete: false, today: "1970-01-01" });
}

export async function loadCustomer360CompanyAndInvoices(input: {
  userClient: SupabaseClient;
  admin: SupabaseClient;
  customerId: string;
  now?: Date;
  timeZone?: string;
}): Promise<{ companyProfile: CustomerCompanyProfile; invoiceSummary: CustomerInvoiceSummary }> {
  const [companyProfile, invoiceSummary] = await Promise.all([
    loadCompanyProfile(input.admin, input.customerId),
    loadInvoiceSummary(input.userClient, input.customerId, input.now ?? new Date(), input.timeZone),
  ]);
  return { companyProfile, invoiceSummary };
}

async function loadCompanyProfile(
  admin: SupabaseClient,
  customerId: string,
): Promise<CustomerCompanyProfile> {
  const [registration, payment] = await Promise.all([
    admin
      .from("organization_registration_profiles")
      .select(
        "business_address, postal_code, city, organization_country, website, organization_number, company_name",
      )
      .eq("customer_id", customerId)
      .maybeSingle(),
    admin
      .from("payment_profiles")
      .select("billing_address, postal_code, city, country")
      .eq("customer_id", customerId)
      .maybeSingle(),
  ]);

  return buildCustomerCompanyProfile(
    {
      readState: registration.error ? "unavailable" : "ready",
      street: text(registration.data?.business_address),
      postalCode: text(registration.data?.postal_code),
      city: text(registration.data?.city),
      country: text(registration.data?.organization_country),
      website: text(registration.data?.website),
      organizationNumber: text(registration.data?.organization_number),
      legalName: text(registration.data?.company_name),
    },
    {
      readState: payment.error ? "unavailable" : "ready",
      rowPresent: Boolean(payment.data),
      street: text(payment.data?.billing_address),
      postalCode: text(payment.data?.postal_code),
      city: text(payment.data?.city),
      country: text(payment.data?.country),
    },
  );
}

async function loadInvoiceSummary(
  userClient: SupabaseClient,
  customerId: string,
  now: Date,
  timeZone: string | undefined,
): Promise<CustomerInvoiceSummary> {
  const zone = timeZone?.trim() || resolveAuthoritativeTimeZone();
  const today = calendarDateInTimeZone(now, zone);
  const { data, error } = await userClient.rpc("get_platform_customer_detail", {
    p_customer_id: customerId,
  });
  if (error || !data || typeof data !== "object") return unavailableInvoiceSummary();

  const row = data as Record<string, unknown>;
  if (!Array.isArray(row.invoices)) return unavailableInvoiceSummary();

  const subscription =
    row.subscription && typeof row.subscription === "object"
      ? (row.subscription as Record<string, unknown>)
      : null;

  const invoices: PlatformInvoiceInput[] = row.invoices.map((item) => {
    const invoice = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    return {
      id: text(invoice.id),
      invoiceNumber: text(invoice.invoice_number),
      status: text(invoice.status),
      amount: typeof invoice.amount === "number" || typeof invoice.amount === "string" ? invoice.amount : null,
      amountPaid:
        typeof invoice.amount_paid === "number" || typeof invoice.amount_paid === "string"
          ? invoice.amount_paid
          : null,
      currency: text(invoice.currency),
      dueDate: text(invoice.due_date),
      issuedAt: text(invoice.issued_at),
      paidAt: text(invoice.paid_at),
    };
  });

  return summarizePlatformInvoices({
    invoices,
    complete: true,
    today,
    nextBillingDate: text(subscription?.next_billing_date),
  });
}
