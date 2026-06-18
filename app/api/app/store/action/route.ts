import { NextResponse } from "next/server";
import { performAppStoreAction } from "@/lib/app-store";
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

    const result = await performAppStoreAction(supabase, {
      actionType: body.action_type,
      packKey: body.pack_key ?? null,
      payload: body.payload ?? {},
    });

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
