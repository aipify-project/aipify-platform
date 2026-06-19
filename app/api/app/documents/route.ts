import { NextResponse } from "next/server";
import { getDocumentManagementCenter, parseDocumentManagementCenter } from "@/lib/document-knowledge";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getDocumentManagementCenter(supabase);
    return NextResponse.json(parseDocumentManagementCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load documents";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
