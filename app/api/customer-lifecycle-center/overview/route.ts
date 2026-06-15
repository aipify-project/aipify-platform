import { NextRequest, NextResponse } from "next/server";
import { parseCustomerLifecycleCenter } from "@/lib/customer-lifecycle-center";
import { createClient } from "@/lib/supabase/server";

function buildFilters(searchParams: URLSearchParams) {
  return {
    lifecycle_stage: searchParams.get("lifecycle_stage") ?? undefined,
    country: searchParams.get("country") ?? undefined,
    health_status: searchParams.get("health_status") ?? undefined,
    plan: searchParams.get("plan") ?? undefined,
    registration_from: searchParams.get("registration_from") ?? undefined,
    registration_to: searchParams.get("registration_to") ?? undefined,
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
    const { data, error } = await supabase.rpc("get_customer_lifecycle_center", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseCustomerLifecycleCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load customer lifecycle center" },
      { status: 500 }
    );
  }
}
