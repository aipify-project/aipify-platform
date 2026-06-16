import { NextResponse } from "next/server";
import { parseAcademyCertifications } from "@/lib/app-portal/customer-academy";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_academy_certifications", {
      p_certification_type: searchParams.get("certification_type") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, certifications: parseAcademyCertifications(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load certifications" }, { status: 500 });
  }
}
