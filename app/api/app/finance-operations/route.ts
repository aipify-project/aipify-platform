import { NextResponse } from "next/server";
import { getFinanceOperationsCenter, parseFinanceOperationsCenter } from "@/lib/finance-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getFinanceOperationsCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseFinanceOperationsCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load finance center" },
      { status: 500 },
    );
  }
}
