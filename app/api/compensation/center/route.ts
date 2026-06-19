import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section") ?? "overview";
    const view = searchParams.get("view");
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (view === "employee" || section === "my_compensation") {
      const { data, error } = await supabase.rpc("get_employee_my_compensation", { p_section: section });
      if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("get_organization_compensation_center", { p_section: section });
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load Compensation Center" }, { status: 500 });
  }
}
