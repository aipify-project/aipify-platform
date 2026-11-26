import type { CommerceInvoiceReadModel } from "./types";

/**
 * APP only displays invoices issued by Platform/Stripe for the caller's tenant.
 * No synthetic PDF generation from UI state.
 */
export function buildCommerceInvoiceReadModel(input: {
  stripeHostedInvoices?: Array<{
    id: string;
    number?: string | null;
    status?: string | null;
    currency?: string | null;
    amount_paid?: number | null;
    created?: number | null;
    invoice_pdf?: string | null;
    hosted_invoice_url?: string | null;
  }>;
  platformInvoicesAvailable?: boolean;
}): CommerceInvoiceReadModel {
  const stripe = input.stripeHostedInvoices ?? [];
  if (stripe.length > 0) {
    return {
      available: true,
      source: "stripe_hosted",
      invoices: stripe.map((invoice) => ({
        id: invoice.id,
        number: invoice.number ?? null,
        status: invoice.status ?? "unknown",
        currency: invoice.currency ? invoice.currency.toUpperCase() : null,
        amount:
          typeof invoice.amount_paid === "number" && Number.isFinite(invoice.amount_paid)
            ? invoice.amount_paid / 100
            : null,
        issuedAt:
          typeof invoice.created === "number"
            ? new Date(invoice.created * 1000).toISOString()
            : null,
        pdfUrl: invoice.invoice_pdf ?? invoice.hosted_invoice_url ?? null,
      })),
      blocker: null,
    };
  }

  if (input.platformInvoicesAvailable) {
    return {
      available: false,
      source: "platform_enterprise",
      invoices: [],
      blocker: "platform_invoice_bridge_not_wired_for_self_serve",
    };
  }

  return {
    available: false,
    source: "none",
    invoices: [],
    blocker: "no_authoritative_invoice_source",
  };
}
