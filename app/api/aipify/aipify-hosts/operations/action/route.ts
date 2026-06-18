import { NextResponse } from "next/server";
import { recordAipifyHostsOperationsAction } from "@/lib/core/aipify-hosts-operations";
import { parseAipifyHostsOperationsActionResult } from "@/lib/aipify/aipify-hosts-operations/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "status_change" | "approve" | "decline" | "assign";
      item_id?: string;
      board?: string;
      new_status?: string;
    };

    if (!body.action || !body.item_id) {
      return NextResponse.json({ error: "action and item_id required" }, { status: 400 });
    }

    const data = await recordAipifyHostsOperationsAction(
      supabase,
      body.action,
      body.item_id,
      body.board,
      body.new_status,
    );
    return NextResponse.json(parseAipifyHostsOperationsActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
