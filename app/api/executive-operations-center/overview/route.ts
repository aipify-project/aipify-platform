import { NextRequest, NextResponse } from "next/server";
import { parseExecutiveOperationsCenter } from "@/lib/executive-operations-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const period = request.nextUrl.searchParams.get("period") ?? "30d";
    const { data, error } = await supabase.rpc("get_executive_operations_center", {
      p_filters: { period },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseExecutiveOperationsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load executive operations center" },
      { status: 500 }
    );
  }
}
