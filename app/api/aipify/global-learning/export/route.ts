import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseContributionExport } from "@/lib/aipify/global-learning/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("export_global_learning_contribution_summary");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseContributionExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export summary" }, { status: 500 });
  }
}
