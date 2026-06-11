import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePolicyEvaluationResult } from "@/lib/aipify/security-compliance";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { data, error } = await supabase.rpc("evaluate_policy", { p_request: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePolicyEvaluationResult(data));
  } catch {
    return NextResponse.json({ error: "Policy evaluation failed" }, { status: 500 });
  }
}
