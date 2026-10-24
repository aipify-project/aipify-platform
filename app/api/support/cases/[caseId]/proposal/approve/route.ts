import { NextResponse } from "next/server";
import {
  processSupportCaseProposalApprovalRequest,
  SUPPORT_PROPOSAL_APPROVAL_BODY_REJECTED,
} from "@/lib/core/support-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const supabase = await createClient();
    const { caseId } = await params;
    let rawBody: unknown;
    try {
      rawBody = await request.json();
    } catch {
      return NextResponse.json(
        { error: SUPPORT_PROPOSAL_APPROVAL_BODY_REJECTED },
        { status: 400 }
      );
    }
    const result = await processSupportCaseProposalApprovalRequest(supabase, caseId, rawBody);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to approve support case response proposal" },
      { status: 500 }
    );
  }
}
