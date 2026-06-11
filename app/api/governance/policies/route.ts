import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const category = new URL(request.url).searchParams.get("category");
    const { data, error } = await supabase.rpc("get_organization_policies", {
      p_category: category,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to load policies" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("create_organization_policy", {
      p_policy_key: body.policy_key,
      p_policy_name: body.policy_name,
      p_category: body.category,
      p_description: body.description ?? null,
      p_configuration: body.configuration ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}
