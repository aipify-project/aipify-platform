import { NextResponse } from "next/server";
import { getBusinessPackLanguageEngineDashboard } from "@/lib/core/business-pack-language-engine";
import { parseBusinessPackLanguageEngineDashboard } from "@/lib/aipify/business-pack-language-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackLanguageEngineDashboard(supabase);
    const parsed = parseBusinessPackLanguageEngineDashboard(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load language engine" }, { status: 500 });
  }
}
