import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      user_id: string;
      certification_definition_id: string;
    };

    const { data, error } = await supabase.rpc("issue_user_certification", {
      p_user_id: body.user_id,
      p_certification_definition_id: body.certification_definition_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to issue certification" }, { status: 500 });
  }
}
