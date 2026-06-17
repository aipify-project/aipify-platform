import { NextResponse } from "next/server";
import { getPartnerAcademyCourses } from "@/lib/core/partner-academy";
import { parsePartnerAcademyCourses } from "@/lib/partner-academy";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerAcademyCourses(supabase, {
      category: url.searchParams.get("category") ?? undefined,
      status: url.searchParams.get("status") ?? undefined,
      cert_level: url.searchParams.get("cert_level") ?? undefined,
      difficulty: url.searchParams.get("difficulty") ?? undefined,
      locale: url.searchParams.get("locale") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    return NextResponse.json({
      has_access: true,
      courses: parsePartnerAcademyCourses(data),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load academy courses" }, { status: 500 });
  }
}
