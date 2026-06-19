import { NextResponse } from "next/server";
import { getResourceCapacityCenter, parseResourceCapacityCenter } from "@/lib/customer-resource-capacity-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getResourceCapacityCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseResourceCapacityCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load Resource Center" },
      { status: 500 }
    );
  }
}
