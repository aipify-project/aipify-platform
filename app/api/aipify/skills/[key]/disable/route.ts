import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ key: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { key: _key } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { tenant_skill_id?: string };
    if (!body.tenant_skill_id) {
      return NextResponse.json({ error: "tenant_skill_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("disable_tenant_skill", {
      p_tenant_skill_id: body.tenant_skill_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to disable skill" }, { status: 500 });
  }
}
