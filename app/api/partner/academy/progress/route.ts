import { NextResponse } from "next/server";
import { getPartnerAcademyProgress } from "@/lib/core/partner-academy";
import { parsePartnerAcademyProgress } from "@/lib/partner-academy";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerAcademyProgress(supabase);
    const parsed = parsePartnerAcademyProgress(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load academy progress" }, { status: 500 });
  }
}
