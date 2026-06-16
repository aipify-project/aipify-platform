import { NextResponse } from "next/server";
import { parseCapabilityCenter } from "@/lib/app-portal/capability-center";
import { createClient } from "@/lib/supabase/server";

type Body = {
  category_key?: string;
  level?: number;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Body;
    if (!body.category_key || typeof body.level !== "number") {
      return NextResponse.json({ error: "Category and level required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("post_app_portal_capability_self_assessment", {
      p_category_key: body.category_key,
      p_level: body.level,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCapabilityCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to submit self-assessment" }, { status: 500 });
  }
}
