import { NextRequest, NextResponse } from "next/server";
import { parseSubscriptionOperationsCenter } from "@/lib/subscription-operations";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    plan: searchParams.get("plan") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    provider: searchParams.get("provider") ?? undefined,
    renewal_period: searchParams.get("renewal_period") ?? undefined,
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const filters = buildFilters(request.nextUrl.searchParams);
    const { data, error } = await supabase.rpc("get_subscription_operations_center", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseSubscriptionOperationsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load subscription operations center" },
      { status: 500 }
    );
  }
}
