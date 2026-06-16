import { NextResponse } from "next/server";
import { performBusinessPackMarketplaceAction } from "@/lib/core/business-pack-marketplace-engine";
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

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performBusinessPackMarketplaceAction(supabase, {
      actionType: body.action_type,
      packKey: body.pack_key ?? null,
      payload: body.payload ?? {},
    });
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
