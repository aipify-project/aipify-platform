import { NextResponse } from "next/server";
import { parseWarehouseInventorySearch } from "@/lib/aipify/aipify-warehouse-operations/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";

    const { data, error } = await supabase.rpc("search_aipify_warehouse_inventory", {
      p_query: query,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseWarehouseInventorySearch(data));
  } catch {
    return NextResponse.json({ error: "Inventory search failed" }, { status: 500 });
  }
}
