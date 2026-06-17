import { NextResponse } from "next/server";
import { parseWorkspaceInsights } from "@/lib/companion-workspace-intelligence";
import { getCompanionWorkspaceInsights } from "@/lib/core/companion-workspace-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionWorkspaceInsights(supabase);
    const parsed = parseWorkspaceInsights(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load workspace insights";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
