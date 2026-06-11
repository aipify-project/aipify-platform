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
      checklist_type?: string;
      items?: Array<{ title: string }>;
    };

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_life_checklist", {
      p_title: body.title.trim(),
      p_description: body.description ?? "",
      p_checklist_type: body.checklist_type ?? "custom",
      p_items: body.items ?? [],
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data });
  } catch {
    return NextResponse.json({ error: "Checklist creation failed" }, { status: 500 });
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
      item_id?: string;
      completed?: boolean;
    };

    if (!body.item_id) {
      return NextResponse.json({ error: "item_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("toggle_life_checklist_item", {
      p_item_id: body.item_id,
      p_completed: Boolean(body.completed),
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Checklist update failed" }, { status: 500 });
  }
}
