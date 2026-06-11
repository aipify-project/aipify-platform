import { NextResponse } from "next/server";
import { parseAipifyInstallEngineCard } from "@/lib/aipify/aipify-install-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_install_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyInstallEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load install engine card" }, { status: 500 });
  }
}
