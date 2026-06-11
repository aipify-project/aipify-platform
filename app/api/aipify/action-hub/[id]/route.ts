import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseActionItemDetail } from "@/lib/aipify/action-hub";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_action_item_detail", {
      p_action_id: id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseActionItemDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load action detail" }, { status: 500 });
  }
}
