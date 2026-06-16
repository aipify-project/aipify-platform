import { NextResponse } from "next/server";
import { parseCultureCheckIn } from "@/lib/app-portal/trust-culture";
import { createClient } from "@/lib/supabase/server";

type CreateBody = {
  title?: string;
  description?: string;
  frequency?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_culture_check_in", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_frequency: body.frequency ?? "on_demand",
      p_questions: null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, check_in: parseCultureCheckIn(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create culture check-in" }, { status: 500 });
  }
}
