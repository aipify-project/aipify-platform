import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_training_progress");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to load training progress" }, { status: 500 });
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
      learning_path_id: string;
      module_id?: string;
      completion_percentage?: number;
      assign_user_id?: string;
      due_at?: string;
    };

    if (body.assign_user_id) {
      const { data, error } = await supabase.rpc("assign_training_path", {
        p_user_id: body.assign_user_id,
        p_learning_path_id: body.learning_path_id,
        p_due_at: body.due_at ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("record_training_progress", {
      p_learning_path_id: body.learning_path_id,
      p_module_id: body.module_id ?? null,
      p_completion_percentage: body.completion_percentage ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update training progress" }, { status: 500 });
  }
}
