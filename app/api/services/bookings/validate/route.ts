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

    if (typeof body.location_key !== "string" || !body.location_key) {
      return NextResponse.json(
        { found: false, valid: false, error_code: "LOCATION_NOT_FOUND" },
        { status: 400 },
      );
    }

    const { data, error } = await supabase.rpc("net616_validate_booking", {
      p_location_key: body.location_key,
      p_provider_key: typeof body.provider_key === "string" ? body.provider_key : "",
      p_resource_key: typeof body.resource_key === "string" ? body.resource_key : "",
      p_service_label: typeof body.service_label === "string" ? body.service_label : "",
      p_starts_at: typeof body.starts_at === "string" ? body.starts_at : null,
      p_ends_at: typeof body.ends_at === "string" ? body.ends_at : null,
    });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to validate booking" }, { status: 500 });
  }
}
