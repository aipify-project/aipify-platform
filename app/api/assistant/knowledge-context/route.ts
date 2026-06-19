import { NextRequest, NextResponse } from "next/server";
import { getCompanionKnowledgeContext } from "@/lib/document-knowledge";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const q = request.nextUrl.searchParams.get("q") ?? undefined;
    const data = await getCompanionKnowledgeContext(supabase, q);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load knowledge context";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
