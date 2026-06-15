import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("enterprise_invoice_action", {
      p_payload: { invoice_id: id, action: "mark_viewed" },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const invoice = data as Record<string, unknown> | null;
    const invoiceNumber = String(invoice?.invoice_number ?? id);
    const tenant = String(invoice?.tenant_name ?? "Customer");
    const amount = String(invoice?.total_amount ?? "0");
    const currency = String(invoice?.currency ?? "NOK");

    const body = [
      "Aipify Group AS — Enterprise Invoice",
      "",
      `Invoice: ${invoiceNumber}`,
      `Customer: ${tenant}`,
      `Amount: ${amount} ${currency}`,
      "",
      "This document is generated for enterprise procurement records.",
      "From Norway. For the world.",
    ].join("\n");

    return new NextResponse(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": `attachment; filename="${invoiceNumber}.txt"`,
      },
    });
  } catch {
    return NextResponse.json({ error: "PDF generation failed" }, { status: 500 });
  }
}
