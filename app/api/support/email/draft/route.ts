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
      customer_name?: string;
      variables?: Record<string, string>;
      language?: string;
    };

    const { data, error } = await supabase.rpc("draft_support_email_response", {
      p_subject: body.subject ?? "",
      p_body: body.body ?? "",
      p_customer_name: body.customer_name ?? "there",
      p_variables: body.variables ?? {},
      p_language: body.language ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Email draft failed" }, { status: 500 });
  }
}
