import { NextResponse } from "next/server";
import { getPartnerAcademyCertifications } from "@/lib/core/partner-academy";
import { parsePartnerAcademyCertifications } from "@/lib/partner-academy";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerAcademyCertifications(supabase);
    return NextResponse.json({
      has_access: true,
      certifications: parsePartnerAcademyCertifications(data),
    });
  } catch {
    return NextResponse.json({ error: "Failed to load certifications" }, { status: 500 });
  }
}
