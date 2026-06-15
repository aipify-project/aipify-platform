import { NextResponse } from "next/server";
import { parseRevenueOperationsCenter } from "@/lib/revenue-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_revenue_operations_center", {
      p_filters: {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseRevenueOperationsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load revenue operations center" },
      { status: 500 }
    );
  }
}
