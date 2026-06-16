import { NextResponse } from "next/server";
import { parseAcademyProgress } from "@/lib/app-portal/customer-academy";
import { createClient } from "@/lib/supabase/server";

type CompleteBody = { course_slug?: string };

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CompleteBody;
    if (!body.course_slug?.trim()) return NextResponse.json({ error: "course_slug required" }, { status: 400 });

    const { data, error } = await supabase.rpc("record_app_portal_academy_completion", {
      p_course_slug: body.course_slug,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ...data, progress: parseAcademyProgress({ found: true, progress: (data as { progress?: unknown })?.progress }) });
  } catch {
    return NextResponse.json({ error: "Failed to record completion" }, { status: 500 });
  }
}
