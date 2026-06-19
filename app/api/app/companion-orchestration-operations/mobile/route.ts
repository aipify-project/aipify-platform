import { NextResponse } from "next/server";
import { getCompanionOrchestrationOperationsMobileSummary } from "@/lib/customer-companion-orchestration-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionOrchestrationOperationsMobileSummary(supabase);
    return NextResponse.json(data ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load mobile summary" },
      { status: 500 }
    );
  }
}
