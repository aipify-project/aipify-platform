import { NextResponse } from "next/server";
import { parseOwnerDetail } from "@/lib/app-portal/responsibilities";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ userId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { userId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_responsibility_owner", { p_user_id: userId });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseOwnerDetail(data);
    if (!parsed) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load owner detail" }, { status: 500 });
  }
}
