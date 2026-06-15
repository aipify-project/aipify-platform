import { NextResponse } from "next/server";
import { getAipifyHostsPropertyHealthCard } from "@/lib/core/aipify-hosts-property-health";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsPropertyHealthCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load property health card" }, { status: 500 });
  }
}
