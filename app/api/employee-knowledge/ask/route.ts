import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { question?: string; query?: string };
    const question = (body.question ?? body.query ?? "").trim();
    if (!question) {
      return NextResponse.json({ error: "Question required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("answer_employee_question", {
      p_question: question,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Employee knowledge ask failed" }, { status: 500 });
  }
}
