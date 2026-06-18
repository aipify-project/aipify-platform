import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_autonomous_organization_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load Autonomous Organization Center" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      item_type?: string;
      item_id?: string;
      manage_action?: string;
      payload?: Record<string, unknown>;
    };

    if (body.action === "manage") {
      const itemId = body.item_id && body.item_id.length > 0 ? body.item_id : null;
      const { data, error } = await supabase.rpc("manage_autonomous_organization_item", {
        p_item_type: body.item_type ?? "companion",
        p_item_id: itemId,
        p_action: body.manage_action ?? "acknowledge",
        p_payload: body.payload ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process autonomy request" }, { status: 500 });
  }
}
