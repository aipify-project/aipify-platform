import { NextResponse } from "next/server";
import { markAipifyHostsKnowledgeHelpful, recordAipifyHostsKnowledgeView } from "@/lib/core/aipify-hosts-knowledge";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      slug?: string;
      title?: string;
      section_key?: string;
      helpful?: boolean;
    };

    if (!body.slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

    if (body.action === "view") {
      const data = await recordAipifyHostsKnowledgeView(
        supabase,
        body.slug,
        body.title ?? body.slug,
        body.section_key,
      );
      return NextResponse.json(data);
    }

    const data = await markAipifyHostsKnowledgeHelpful(supabase, body.slug, body.helpful !== false);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
