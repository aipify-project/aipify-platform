import { NextResponse } from "next/server";
import { parseCompanionActionCenter } from "@/lib/companion-action-approval";
import { processCompanionActionRequest } from "@/lib/core/companion-action-approval";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const data = await processCompanionActionRequest(supabase, body);
    return NextResponse.json(parseCompanionActionCenter(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process companion action";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
