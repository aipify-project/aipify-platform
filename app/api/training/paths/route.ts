import { NextResponse } from "next/server";
import { parseTrainingPaths } from "@/lib/aipify/learning-training-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_training_paths");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseTrainingPaths(data));
  } catch {
    return NextResponse.json({ error: "Failed to list training paths" }, { status: 500 });
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
      path_key: string;
      title: string;
      description?: string;
      category?: string;
      target_role?: string;
      content_ref?: string;
    };

    const { data, error } = await supabase.rpc("save_learning_training_path", {
      p_path_key: body.path_key,
      p_title: body.title,
      p_description: body.description ?? null,
      p_category: body.category ?? "module_specific",
      p_target_role: body.target_role ?? "viewer",
      p_content_ref: body.content_ref ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save training path" }, { status: 500 });
  }
}
