import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      initiative_name?: string;
      change_type?: string;
      description?: string;
      owner_user_id?: string;
      target_date?: string;
    };

    if (!body.initiative_name || !body.change_type) {
      return NextResponse.json({ error: "initiative_name and change_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_change_initiative", {
      p_initiative_name: body.initiative_name,
      p_change_type: body.change_type,
      p_description: body.description ?? null,
      p_owner_user_id: body.owner_user_id ?? null,
      p_target_date: body.target_date ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create initiative" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { initiative_id?: string; status?: string };
    if (!body.initiative_id || !body.status) {
      return NextResponse.json({ error: "initiative_id and status required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("update_change_initiative_status", {
      p_initiative_id: body.initiative_id,
      p_status: body.status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update initiative" }, { status: 500 });
  }
}
