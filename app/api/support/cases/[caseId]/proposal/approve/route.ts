import { NextResponse } from "next/server";
import { processSupportCaseProposalApprovalRequest } from "@/lib/core/support-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const supabase = await createClient();
    const { caseId } = await params;
    const rawBody = await request.json();
    const result = await processSupportCaseProposalApprovalRequest(supabase, caseId, rawBody);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to approve support case response proposal" },
      { status: 500 }
    );
  }
}
