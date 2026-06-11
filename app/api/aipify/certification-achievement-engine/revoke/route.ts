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
      user_certification_id: string;
      reason?: string;
    };

    const { data, error } = await supabase.rpc("revoke_user_certification", {
      p_user_certification_id: body.user_certification_id,
      p_reason: body.reason ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to revoke certification" }, { status: 500 });
  }
}
