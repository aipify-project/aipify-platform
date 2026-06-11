import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      use_case_id?: string;
      justification?: string;
      duration_days?: number;
    };
    if (!body.use_case_id || !body.justification) {
      return NextResponse.json({ error: "use_case_id and justification required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("override_ethics_policy_exception", {
      p_use_case_id: body.use_case_id,
      p_justification: body.justification,
      p_exception_duration_days: body.duration_days,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to apply ethics override" }, { status: 500 });
  }
}
