import { NextResponse } from "next/server";
import { getBusinessPackLegalEngineCard } from "@/lib/core/business-pack-legal-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackLegalEngineCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ has_access: false });
  }
}
