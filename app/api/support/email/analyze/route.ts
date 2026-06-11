import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      subject?: string;
      body?: string;
      language?: string;
    };

    const { data, error } = await supabase.rpc("analyze_support_email", {
      p_subject: body.subject ?? "",
      p_body: body.body ?? "",
      p_language: body.language ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Email analyze failed" }, { status: 500 });
  }
}
