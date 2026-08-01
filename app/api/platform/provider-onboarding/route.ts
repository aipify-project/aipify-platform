import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("list_platform_provider_onboarding_contracts");
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json({ providers: data ?? [] }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "Failed to list provider contracts" }, { status: 500, headers: NO_STORE });
  }
}
