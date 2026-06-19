import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("net616_search_availability", {
      p_location_key: typeof body.location_key === "string" ? body.location_key : "",
      p_service_label: typeof body.service_label === "string" ? body.service_label : "",
      p_provider_key: typeof body.provider_key === "string" ? body.provider_key : "",
      p_resource_type: typeof body.resource_type === "string" ? body.resource_type : "",
      p_starts_at: typeof body.starts_at === "string" ? body.starts_at : null,
      p_ends_at: typeof body.ends_at === "string" ? body.ends_at : null,
    });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to search availability" }, { status: 500 });
  }
}
