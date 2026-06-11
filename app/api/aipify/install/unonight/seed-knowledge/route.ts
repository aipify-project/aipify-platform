import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UNONIGHT_PILOT_SLUG } from "@/lib/aipify/integrations/unonight";
import {
  loadTenantSeedKnowledgeArticles,
  tenantSeedArticlesToRpcPayload,
} from "@/lib/aipify/pilot/import-knowledge";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const overwrite = Boolean((body as { overwrite?: boolean }).overwrite);

    const { data: statusData, error: statusError } = await supabase.rpc("get_pilot_install_status", {
      p_slug: UNONIGHT_PILOT_SLUG,
    });
    if (statusError) return NextResponse.json({ error: statusError.message }, { status: 400 });

    const tenantId = (statusData as { profile?: { tenant_id?: string } })?.profile?.tenant_id;
    if (!tenantId) {
      return NextResponse.json({ error: "Unonight tenant not provisioned yet" }, { status: 400 });
    }

    const articles = loadTenantSeedKnowledgeArticles(UNONIGHT_PILOT_SLUG);
    const { data, error } = await supabase.rpc("import_tenant_knowledge_seed", {
      p_tenant_id: tenantId,
      p_articles: tenantSeedArticlesToRpcPayload(articles),
      p_overwrite: overwrite,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to seed knowledge" }, { status: 500 });
  }
}
