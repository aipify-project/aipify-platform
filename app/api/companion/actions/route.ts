import { NextResponse } from "next/server";
import { parseCompanionActionCenter } from "@/lib/companion-action-approval";
import { getCompanionActionCenter } from "@/lib/core/companion-action-approval";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionActionCenter(supabase);
    const parsed = parseCompanionActionCenter(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load companion action center";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
