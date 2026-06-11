import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { status?: string; note?: string };
    if (!body.status) {
      return NextResponse.json({ error: "status required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("update_action_item_status", {
      p_action_id: id,
      p_status: body.status,
      p_note: body.note ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update action status" }, { status: 500 });
  }
}
