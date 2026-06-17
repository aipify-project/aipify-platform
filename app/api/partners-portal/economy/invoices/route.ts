import { NextResponse } from "next/server";
import { parseEconomyInvoices } from "@/lib/partners-portal/economy-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_growth_partner_economy_invoices");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ invoices: parseEconomyInvoices(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load invoices" }, { status: 500 });
  }
}
