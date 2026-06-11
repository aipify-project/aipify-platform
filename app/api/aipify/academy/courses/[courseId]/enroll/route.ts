import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAcademyActionResult } from "@/lib/aipify/academy";

type RouteContext = { params: Promise<{ courseId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { courseId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("enroll_academy_course", { p_course_id: courseId });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAcademyActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to enroll in course" }, { status: 500 });
  }
}
