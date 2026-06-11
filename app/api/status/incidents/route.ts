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
      title: string;
      description?: string;
      component?: string;
      severity?: string;
      status?: string;
      public_visibility?: boolean;
    };

    const { data, error } = await supabase.rpc("publish_status_incident", {
      p_title: body.title,
      p_description: body.description ?? null,
      p_component: body.component ?? "platform",
      p_severity: body.severity ?? "high",
      p_status: body.status ?? "partial_outage",
      p_public_visibility: body.public_visibility ?? true,
      p_metadata: {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to publish incident" }, { status: 500 });
  }
}
