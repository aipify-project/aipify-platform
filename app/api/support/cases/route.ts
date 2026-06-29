import { NextResponse } from "next/server";
import { processSupportCaseCreateRequest } from "@/lib/core/support-ai";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const result = await processSupportCaseCreateRequest(supabase, await request.json());
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Failed to create support case" }, { status: 500 });
  }
}
