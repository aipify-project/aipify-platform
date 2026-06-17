import { NextResponse } from "next/server";
import { submitPartnerAcademyExam } from "@/lib/core/partner-academy";
import {
  parsePartnerAcademyCertifications,
  parsePartnerAcademyDashboard,
} from "@/lib/partner-academy";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      exam_key?: string;
      score_pct?: number;
      start_course_key?: string;
    };

    const data = await submitPartnerAcademyExam(supabase, {
      examKey: body.exam_key,
      scorePct: body.score_pct,
      startCourseKey: body.start_course_key,
    });

    if (body.start_course_key) {
      const dashboard = parsePartnerAcademyDashboard(data);
      return NextResponse.json(dashboard ?? { success: true });
    }

    return NextResponse.json({
      has_access: true,
      certifications: parsePartnerAcademyCertifications(data),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit exam";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
