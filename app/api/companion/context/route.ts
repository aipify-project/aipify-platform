import { NextResponse } from "next/server";
import { getCompanionUserContext } from "@/lib/core/companion-memory-context";
import { parseCompanionContextBundle } from "@/lib/companion-memory-context";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionUserContext(supabase);
    const parsed = parseCompanionContextBundle(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load companion context";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
