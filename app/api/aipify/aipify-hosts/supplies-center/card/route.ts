import { NextResponse } from "next/server";
import { getAipifyHostsSuppliesCenterCard } from "@/lib/core/aipify-hosts-supplies-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAipifyHostsSuppliesCenterCard(supabase));
  } catch {
    return NextResponse.json({ error: "Failed to load supplies center card" }, { status: 500 });
  }
}
