import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAppInstallPrecheck } from "@/lib/aipify/app-ecosystem/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("precheck_ecosystem_app_install", {
      p_app_key: id,
      p_tenant_id: null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAppInstallPrecheck(data));
  } catch {
    return NextResponse.json({ error: "Failed to precheck install" }, { status: 500 });
  }
}
