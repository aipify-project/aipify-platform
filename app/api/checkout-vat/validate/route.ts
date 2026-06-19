import { NextResponse } from "next/server";
import { validateBusinessNumber } from "@/lib/checkout-vat-engine";
import { recordCheckoutVatValidation } from "@/lib/checkout-vat-operations/client";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const country = String(body.country ?? "NO");
    const businessNumber = String(body.business_number ?? "");
    const customerType = String(body.customer_type ?? "business") as "private" | "business";

    const result = await validateBusinessNumber({ country, businessNumber, customerType });

    await recordCheckoutVatValidation(supabase, {
      session_key: body.session_key ?? "",
      business_number: businessNumber,
      country,
      validation_status: result.status,
      validation_source: result.source,
      registry_company_name: result.registryCompanyName,
      raw_response: result.rawResponse ?? {},
    });

    return NextResponse.json({
      validation_status: result.status,
      validation_source: result.source,
      registry_company_name: result.registryCompanyName,
      message_key: result.messageKey,
    });
  } catch {
    return NextResponse.json({
      validation_status: "service_unavailable",
      validation_source: "none",
      message_key: "validationUnavailable",
    });
  }
}
