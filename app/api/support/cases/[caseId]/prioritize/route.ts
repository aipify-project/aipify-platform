import { NextResponse } from "next/server";
import { processSupportCasePrioritizeRequest } from "@/lib/core/support-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    const supabase = await createClient();
    const { caseId } = await params;
    const rawBody = await request.text();
    const parsedBody = rawBody.trim().length > 0 ? JSON.parse(rawBody) : undefined;
    const result = await processSupportCasePrioritizeRequest(supabase, caseId, parsedBody);
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Failed to prioritize support case" }, { status: 500 });
  }
}
