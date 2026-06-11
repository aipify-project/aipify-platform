import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { article_id?: string };
    if (!body.article_id) {
      return NextResponse.json({ error: "article_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("publish_organization_knowledge_article", {
      p_article_id: body.article_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to publish article" }, { status: 500 });
  }
}
