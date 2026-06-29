import { NextResponse } from "next/server";
import { processSupportCaseKnowledgeRequest } from "@/lib/core/support-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const supabase = await createClient();
    const { caseId } = await params;
    const result = await processSupportCaseKnowledgeRequest(supabase, caseId);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Failed to retrieve support case knowledge" }, { status: 500 });
  }
}
