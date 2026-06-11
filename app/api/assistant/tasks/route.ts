import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      priority?: string;
      assigned_to?: string;
      due_date?: string;
      ai_generated?: boolean;
    };
    if (!body.title) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_admin_task", {
      p_title: body.title,
      p_description: body.description ?? null,
      p_priority: body.priority ?? "medium",
      p_assigned_to: body.assigned_to ?? null,
      p_due_date: body.due_date ?? null,
      p_ai_generated: body.ai_generated ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
