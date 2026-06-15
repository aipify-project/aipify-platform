import { NextResponse } from "next/server";
import { getAipifyHostsKnowledgeDashboard } from "@/lib/core/aipify-hosts-knowledge";
import { parseAipifyHostsKnowledgeDashboard } from "@/lib/aipify/aipify-hosts-knowledge";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsKnowledgeDashboard(supabase);
    const parsed = parseAipifyHostsKnowledgeDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load knowledge dashboard" }, { status: 500 });
  }
}
