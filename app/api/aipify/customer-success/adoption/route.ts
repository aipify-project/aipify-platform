import { NextResponse } from "next/server";
import { parseCustomerSuccessAdoption } from "@/lib/app-portal/customer-success";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_customer_success_adoption", {
      p_department: searchParams.get("department") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCustomerSuccessAdoption(data));
  } catch {
    return NextResponse.json({ error: "Failed to load adoption data" }, { status: 500 });
  }
}
