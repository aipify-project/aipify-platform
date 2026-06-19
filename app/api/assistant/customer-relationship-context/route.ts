import { NextRequest, NextResponse } from "next/server";
import { getCompanionCustomerRelationshipContext } from "@/lib/customer-relationship";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const query = request.nextUrl.searchParams.get("q") ?? undefined;
    const data = await getCompanionCustomerRelationshipContext(supabase, query);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load context" }, { status: 500 });
  }
}
