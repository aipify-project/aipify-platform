import { NextResponse } from "next/server";
import { getAppStorePackDetail, parseAppStorePackDetail } from "@/lib/app-store";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ pack: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { pack } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAppStorePackDetail(supabase, pack);
    return NextResponse.json(parseAppStorePackDetail(data) ?? { found: false, pack_key: pack });
  } catch {
    return NextResponse.json({ error: "Failed to load pack detail" }, { status: 500 });
  }
}
