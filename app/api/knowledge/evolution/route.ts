import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_knowledge_evolution_engine");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load Knowledge Evolution Engine" }, { status: 500 });
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
      candidate_id?: string;
      manage_action?: string;
      patch?: Record<string, unknown>;
    };

    if (body.action === "manage") {
      const { data, error } = await supabase.rpc("manage_knowledge_evolution_candidate", {
        p_candidate_id: body.candidate_id,
        p_action: body.manage_action ?? "approve",
        p_patch: body.patch ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process knowledge evolution request" }, { status: 500 });
  }
}
