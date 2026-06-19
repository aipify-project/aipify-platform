import { NextResponse } from "next/server";
import { getProcurementOperationsCenter, parseProcurementOperationsCenter } from "@/lib/procurement-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getProcurementOperationsCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseProcurementOperationsCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load procurement center" },
      { status: 500 },
    );
  }
}
