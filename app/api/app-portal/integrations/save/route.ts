import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      provider_key?: string;
      setup_type?: string;
      permission_level?: string;
      approved_scopes?: string[];
      api_key?: string | null;
    };

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("save_app_portal_integration_connection", {
      p_provider_key: body.provider_key,
      p_setup_type: body.setup_type,
      p_permission_level: body.permission_level ?? "read_only",
      p_approved_scopes: body.approved_scopes ?? [],
      p_api_key: body.api_key ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save integration" }, { status: 500 });
  }
}
