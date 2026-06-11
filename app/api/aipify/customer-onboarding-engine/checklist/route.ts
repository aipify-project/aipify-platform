import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { checklist_key?: string };
    if (!body.checklist_key) {
      return NextResponse.json({ error: "checklist_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("complete_checklist_item", {
      p_checklist_key: body.checklist_key,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to complete checklist item" }, { status: 500 });
  }
}
