import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_memory_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load Companion Memory Center" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      text?: string;
      payload?: Record<string, unknown>;
      item_type?: string;
      item_id?: string;
      manage_action?: string;
      patch?: Record<string, unknown>;
    };

    if (body.action === "detect") {
      const { data, error } = await supabase.rpc("detect_companion_commitment", {
        p_text: body.text ?? "",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create") {
      const { data, error } = await supabase.rpc("create_companion_memory_commitment", {
        p_payload: body.payload ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "manage") {
      const { data, error } = await supabase.rpc("manage_companion_memory_item", {
        p_item_type: body.item_type ?? "commitment",
        p_item_id: body.item_id,
        p_action: body.manage_action ?? "complete",
        p_patch: body.patch ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process memory center request" }, { status: 500 });
  }
}
