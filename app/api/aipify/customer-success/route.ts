import { NextResponse } from "next/server";
import { parseCustomerSuccessOverview } from "@/lib/app-portal/customer-success";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_customer_success", {
      p_department: searchParams.get("department") || null,
      p_category: searchParams.get("category") || null,
      p_priority: searchParams.get("priority") || null,
      p_success_status: searchParams.get("success_status") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      return NextResponse.json(
        {
          error: error.message,
          access_state: classifyAppPortalError(error.message),
          found: false,
        },
        { status: 403 }
      );
    }
    return NextResponse.json(parseCustomerSuccessOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load customer success" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data, error } = await supabase.rpc("begin_app_portal_customer_success_journey");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCustomerSuccessOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to begin success journey" }, { status: 500 });
  }
}
