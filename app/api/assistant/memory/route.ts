import { NextResponse } from "next/server";
import { parseAssistantCenter } from "@/lib/assistant-memory";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_assistant_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(parseAssistantCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load memories" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      ask_before_remembering?: boolean;
      categories_enabled?: Record<string, boolean>;
      memory_enabled?: boolean;
    };

    const { data, error } = await supabase.rpc("update_assistant_memory_settings", {
      p_ask_before_remembering: body.ask_before_remembering ?? null,
      p_categories_enabled: body.categories_enabled ?? null,
      p_memory_enabled: body.memory_enabled ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const { data, error } = await supabase.rpc("remove_assistant_memory", {
      p_memory_id: id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to remove memory" }, { status: 500 });
  }
}
