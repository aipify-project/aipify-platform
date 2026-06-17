import { NextResponse } from "next/server";
import { parseWorkspaceWorkflows } from "@/lib/companion-workspace-intelligence";
import { saveCompanionWorkspaceWorkflow } from "@/lib/core/companion-workspace-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const data = await saveCompanionWorkspaceWorkflow(supabase, body);
    return NextResponse.json({
      has_access: true,
      workflows: parseWorkspaceWorkflows(data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save workspace workflow";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
