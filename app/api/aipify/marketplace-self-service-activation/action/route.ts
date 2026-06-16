import { NextResponse } from "next/server";
import { performMarketplaceSelfServiceAction } from "@/lib/core/marketplace-self-service-activation";
import { parseMarketplaceSelfServiceActionResult } from "@/lib/aipify/marketplace-self-service-activation";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      pack_key?: string;
      payload?: Record<string, unknown>;
    };
    if (!body.action_type) return NextResponse.json({ error: "action_type required" }, { status: 400 });

    const data = await performMarketplaceSelfServiceAction(supabase, {
      actionType: body.action_type,
      packKey: body.pack_key,
      payload: body.payload,
    });
    return NextResponse.json(parseMarketplaceSelfServiceActionResult(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
