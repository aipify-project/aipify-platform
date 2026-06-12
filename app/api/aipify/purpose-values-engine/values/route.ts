import { NextResponse } from "next/server";
import { parseOrganizationStatedValues } from "@/lib/aipify/purpose-values-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active_only") !== "false";
    const { data, error } = await supabase.rpc("list_organization_stated_values", {
      p_active_only: activeOnly,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationStatedValues(data));
  } catch {
    return NextResponse.json({ error: "Failed to list values" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { data, error } = await supabase.rpc("upsert_organization_stated_value", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save value" }, { status: 500 });
  }
}
