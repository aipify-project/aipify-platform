import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("export_assistant_memories");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data, {
      headers: {
        "Content-Disposition": 'attachment; filename="aipify-assistant-memories.json"',
      },
    });
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
