import { NextRequest, NextResponse } from "next/server";
import { parseCustomerSuccessOperationsCenter } from "@/lib/customer-success-operations";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  const healthMin = searchParams.get("health_score_min");
  return {
    success_status: searchParams.get("success_status") ?? undefined,
    assigned_manager: searchParams.get("assigned_manager") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    renewal_window: searchParams.get("renewal_window") ?? undefined,
    health_score_min: healthMin ? Number(healthMin) : undefined,
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
    const { data, error } = await supabase.rpc("get_customer_success_operations_center", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseCustomerSuccessOperationsCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load customer success operations center" },
      { status: 500 }
    );
  }
}
