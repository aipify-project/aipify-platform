import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommercialModelActionResult } from "@/lib/aipify/billing-commercial/parse";

type RouteContext = { params: Promise<{ eventId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { eventId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("complete_commercial_renewal_event", { p_event_id: eventId });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommercialModelActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to complete renewal event" }, { status: 500 });
  }
}
