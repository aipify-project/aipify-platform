import { NextResponse } from "next/server";
import { getCompanionProjectRelationships } from "@/lib/core/companion-memory-context";
import { parseCompanionProjectMap } from "@/lib/companion-memory-context";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionProjectRelationships(supabase);
    const parsed = parseCompanionProjectMap(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load project relationships";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
