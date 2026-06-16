import { NextResponse } from "next/server";
import { getBusinessPackKnowledgeEngineDashboard } from "@/lib/core/business-pack-knowledge-engine";
import { parseBusinessPackKnowledgeEngineDashboard } from "@/lib/aipify/business-pack-knowledge-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackKnowledgeEngineDashboard(supabase);
    const parsed = parseBusinessPackKnowledgeEngineDashboard(data);
    return NextResponse.json(parsed ?? { has_access: false });
  } catch {
    return NextResponse.json({ error: "Failed to load knowledge engine dashboard" }, { status: 500 });
  }
}
