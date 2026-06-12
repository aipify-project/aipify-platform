import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseGlobalCommerceExpansionCard } from "@/lib/aipify/global-commerce-expansion";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_global_commerce_expansion_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGlobalCommerceExpansionCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load global commerce expansion card" }, { status: 500 });
  }
}
