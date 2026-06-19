import { NextResponse } from "next/server";
import { getCheckoutVatSession, upsertCheckoutVatSession } from "@/lib/checkout-vat-operations/client";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sessionKey = new URL(request.url).searchParams.get("session_key");
    if (!sessionKey) return NextResponse.json({ error: "session_key required" }, { status: 400 });

    const data = await getCheckoutVatSession(supabase, sessionKey);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load session" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const payload = {
      session_key: body.session_key,
      product_type: body.productType ?? body.product_type ?? "subscription",
      customer_type: body.customerType ?? body.customer_type ?? "private",
      company_name: body.companyName ?? body.company_name ?? "",
      organization_number: body.organizationNumber ?? body.organization_number ?? "",
      vat_number: body.organizationNumber ?? body.organization_number ?? "",
      country: body.country ?? "NO",
      billing_address: body.billingAddress ?? body.billing_address ?? "",
      billing_email: body.billingEmail ?? body.billing_email ?? "",
      reference: body.reference ?? "",
      purchase_order_number: body.purchaseOrderNumber ?? body.purchase_order_number ?? "",
      subtotal: body.subtotal ?? 0,
      currency: body.currency ?? "NOK",
      validation_status: body.validation_status ?? "waiting",
      validation_source: body.validation_source ?? "",
      registry_company_name: body.registry_company_name ?? "",
      payment_provider: body.paymentProvider ?? body.payment_provider ?? "stripe",
      subscription_reference: body.subscription_reference ?? "",
      domain_license_reference: body.domain_license_reference ?? "",
      business_pack_reference: body.business_pack_reference ?? "",
    };

    const data = await upsertCheckoutVatSession(supabase, payload);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to save session" },
      { status: 500 }
    );
  }
}
