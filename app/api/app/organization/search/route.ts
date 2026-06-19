import { NextResponse } from "next/server";
import { searchOrganizationStructure } from "@/lib/organization-management";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const q = new URL(request.url).searchParams.get("q") ?? "";
    const data = await searchOrganizationStructure(supabase, q);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Search failed" }, { status: 500 });
  }
}
