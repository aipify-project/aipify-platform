import { NextResponse } from "next/server";
import { getMarketplaceSelfServiceCard } from "@/lib/core/marketplace-self-service-activation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getMarketplaceSelfServiceCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load marketplace card" }, { status: 500 });
  }
}
