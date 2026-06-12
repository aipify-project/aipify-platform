import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      participation_status?: string;
      allowed_categories?: string[];
      anonymization_level?: string;
    };

    const { data, error } = await supabase.rpc("upsert_cross_tenant_participation_settings", {
      p_participation_status: body.participation_status ?? null,
      p_allowed_categories: body.allowed_categories ?? null,
      p_anonymization_level: body.anonymization_level ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update participation settings" }, { status: 500 });
  }
}
