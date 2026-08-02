import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" };

/** Platform ops visibility for customer installation handoff requests. */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitRaw = Number(url.searchParams.get("limit") ?? "50");
    const limit = Number.isFinite(limitRaw) ? limitRaw : 50;
    const status = url.searchParams.get("status");

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("list_platform_installation_handoffs", {
      p_limit: limit,
      p_status: status && status.length > 0 ? status : null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403, headers: NO_STORE });
    }
    return NextResponse.json(data ?? { handoffs: [] }, { headers: NO_STORE });
  } catch {
    return NextResponse.json(
      { error: "Failed to list installation handoffs" },
      { status: 500, headers: NO_STORE }
    );
  }
}
