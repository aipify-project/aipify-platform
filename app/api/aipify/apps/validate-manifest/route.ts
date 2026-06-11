import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseManifestValidation } from "@/lib/aipify/app-ecosystem";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as { manifest?: Record<string, unknown> };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("validate_app_manifest", {
      p_manifest: body.manifest ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseManifestValidation(data));
  } catch {
    return NextResponse.json({ error: "Failed to validate manifest" }, { status: 500 });
  }
}
