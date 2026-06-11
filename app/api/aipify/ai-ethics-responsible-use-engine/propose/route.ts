import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      use_case_name?: string;
      category?: string;
      risk_level?: string;
      oversight_required?: boolean;
    };
    if (!body.use_case_name) return NextResponse.json({ error: "use_case_name required" }, { status: 400 });

    const { data, error } = await supabase.rpc("propose_ai_use_case", {
      p_use_case_name: body.use_case_name,
      p_category: body.category,
      p_risk_level: body.risk_level,
      p_oversight_required: body.oversight_required,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to propose use case" }, { status: 500 });
  }
}
