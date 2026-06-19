import { NextResponse } from "next/server";
import { getAutomationOperationsCenter, parseAutomationOperationsCenter } from "@/lib/automation-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getAutomationOperationsCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseAutomationOperationsCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load automation center" }, { status: 500 });
  }
}
