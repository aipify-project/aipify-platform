import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseProductAutomationCard } from "@/lib/aipify/product-automation";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_product_automation_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseProductAutomationCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load automation card" }, { status: 500 });
  }
}
