import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { approved?: boolean };

    if (body.approved) {
      const { data, error } = await supabase.rpc("approve_business_email_template", {
        p_template_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "No supported update" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Template update failed" }, { status: 500 });
  }
}
