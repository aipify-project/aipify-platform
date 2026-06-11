import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_business_dna_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const center = data as { templates?: unknown[]; template_suggestions?: unknown[] };
    return NextResponse.json({
      templates: center.templates ?? [],
      suggestions: center.template_suggestions ?? [],
    });
  } catch {
    return NextResponse.json({ error: "Templates request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      template_name?: string;
      category?: string;
      subject?: string;
      body?: string;
      language?: string;
      variables?: unknown[];
      approved?: boolean;
    };

    if (!body.template_name || !body.category || !body.subject || !body.body) {
      return NextResponse.json(
        { error: "template_name, category, subject, and body required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.rpc("create_business_email_template", {
      p_template_name: body.template_name,
      p_category: body.category,
      p_subject: body.subject,
      p_body: body.body,
      p_language: body.language ?? "en",
      p_variables: body.variables ?? [],
      p_approved: body.approved ?? false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Template create failed" }, { status: 500 });
  }
}
