import { NextResponse } from "next/server";
import { parsePlaybookVersions } from "@/lib/app-portal/playbooks";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_app_portal_playbook_versions", { p_playbook_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePlaybookVersions(data));
  } catch {
    return NextResponse.json({ error: "Failed to load playbook versions" }, { status: 500 });
  }
}
