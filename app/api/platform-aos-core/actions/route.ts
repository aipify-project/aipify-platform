import { NextRequest, NextResponse } from "next/server";
import { performPlatformAosCoreAction } from "@/lib/platform-aos-core";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await request.json();
    const data = await performPlatformAosCoreAction(supabase, payload);
    return NextResponse.json(data ?? { ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Action failed" },
      { status: 400 }
    );
  }
}
