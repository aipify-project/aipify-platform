import { NextResponse } from "next/server";
import { getCatalogPackKeyForApi } from "@/lib/app-portal/business-pack-resolver";
import { getAppStorePackDetail, parseAppStorePackDetail } from "@/lib/app-store";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ pack: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { pack } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const catalogPackKey = getCatalogPackKeyForApi(pack) ?? pack;
    const data = await getAppStorePackDetail(supabase, catalogPackKey);
    return NextResponse.json(
      parseAppStorePackDetail(data) ?? { found: false, pack_key: catalogPackKey }
    );
  } catch {
    return NextResponse.json({ error: "Failed to load pack detail" }, { status: 500 });
  }
}
