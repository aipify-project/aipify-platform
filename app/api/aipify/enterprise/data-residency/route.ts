import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDataResidencyPolicies } from "@/lib/aipify/enterprise";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_data_residency_policies");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ policies: parseDataResidencyPolicies(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load data residency policies" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("update_data_residency_policy", {
      p_policy_key: body.policy_key,
      p_patch: body.patch ?? body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ policies: parseDataResidencyPolicies(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update data residency policy" }, { status: 500 });
  }
}
