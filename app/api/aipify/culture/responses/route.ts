import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ResponseBody = {
  check_in_id?: string;
  question_id?: string;
  dimension?: string;
  question_type?: string;
  rating_value?: number;
  choice_value?: string;
  text_reflection?: string;
  department?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ResponseBody;
    if (!body.check_in_id || !body.question_id || !body.dimension || !body.question_type) {
      return NextResponse.json({ error: "check_in_id, question_id, dimension, and question_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("submit_app_portal_culture_response", {
      p_check_in_id: body.check_in_id,
      p_question_id: body.question_id,
      p_dimension: body.dimension,
      p_question_type: body.question_type,
      p_rating_value: body.rating_value ?? null,
      p_choice_value: body.choice_value ?? null,
      p_text_reflection: body.text_reflection ?? "",
      p_department: body.department ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to submit culture response" }, { status: 500 });
  }
}
