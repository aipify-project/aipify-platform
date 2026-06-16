import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type AssignBody = {
  course_slug?: string;
  assignee_user_id?: string;
  department?: string;
  required?: boolean;
  due_date?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as AssignBody;
    if (!body.course_slug?.trim()) return NextResponse.json({ error: "course_slug required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_academy_assignment", {
      p_course_slug: body.course_slug,
      p_assignee_user_id: body.assignee_user_id ?? null,
      p_department: body.department ?? "",
      p_required: body.required ?? true,
      p_due_date: body.due_date ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}
