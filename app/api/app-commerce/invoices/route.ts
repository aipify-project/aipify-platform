import { buildCommerceInvoiceReadModel } from "@/lib/app-commerce/invoices-read";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Tenant-scoped invoice/receipt read model.
 * Does not invent PDFs. Reports honest blockers when Platform/Stripe bridge is absent.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const model = buildCommerceInvoiceReadModel({
    stripeHostedInvoices: [],
    platformInvoicesAvailable: false,
  });

  return NextResponse.json(model);
}
