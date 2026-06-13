import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { level?: number };
    if (!body.level || body.level < 1 || body.level > 4) {
      return NextResponse.json({ error: "level must be 1-4" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("set_customer_zero_pilot_level", {
      p_level: body.level,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to set pilot level" }, { status: 500 });
  }
}
