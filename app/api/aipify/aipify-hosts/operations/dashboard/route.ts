import { NextResponse } from "next/server";
import { getAipifyHostsOperationsDashboard } from "@/lib/core/aipify-hosts-operations";
import { parseAipifyHostsOperationsDashboard } from "@/lib/aipify/aipify-hosts-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "today";
    const filter = searchParams.get("filter") ?? "today";
    const propertyId = searchParams.get("property_id");

    const data = await getAipifyHostsOperationsDashboard(supabase, section, filter, propertyId);
    const parsed = parseAipifyHostsOperationsDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load operations dashboard" }, { status: 500 });
  }
}
