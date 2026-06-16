import { NextResponse } from "next/server";
import { parseSuperLanguageAdministration } from "@/lib/super-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_super_language_administration");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });

    return NextResponse.json({ languages: parseSuperLanguageAdministration(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load language administration" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("perform_super_language_administration_action", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
