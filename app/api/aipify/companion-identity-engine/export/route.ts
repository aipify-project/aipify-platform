import { NextResponse } from "next/server";
import { parseCompanionIdentityExport } from "@/lib/aipify/companion-identity-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { format?: string };
    const { data, error } = await supabase.rpc("export_companion_identity_report", {
      p_format: body.format ?? "json",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCompanionIdentityExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export report" }, { status: 500 });
  }
}
