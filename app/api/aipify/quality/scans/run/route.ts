import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseQualityDashboard } from "@/lib/aipify/quality";
import { runQualityScanJob } from "@/lib/aipify/quality/jobs";
import type { QualityScanType } from "@/lib/aipify/quality";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const scanType = ((body as { scan_type?: string }).scan_type ?? "full") as QualityScanType;
    const tenantSlug = (body as { tenant_slug?: string }).tenant_slug ?? "unonight";
    const tenantId = (body as { tenant_id?: string }).tenant_id;

    let integrations: Array<{ integration_key: string; status: string; error_message?: string | null }> = [];
    if (tenantId) {
      const { data: intData } = await supabase.rpc("get_tenant_integrations", {
        p_tenant_id: tenantId,
      });
      if (Array.isArray(intData)) {
        integrations = intData.map((row) => {
          const r = row as Record<string, unknown>;
          return {
            integration_key: String(r.integration_key ?? ""),
            status: String(r.status ?? "not_connected"),
            error_message: r.error_message ? String(r.error_message) : null,
          };
        });
      }
    }

    const fetcher = async (rpc: string, params: Record<string, unknown>) => {
      const { data, error } = await supabase.rpc(rpc, params);
      if (error) throw new Error(error.message);
      return data;
    };

    const data = await runQualityScanJob(fetcher, scanType, {
      tenantSlug,
      integrations,
    });

    const parsed = data as { dashboard?: unknown };
    return NextResponse.json({
      ...(data as Record<string, unknown>),
      dashboard: parsed.dashboard ? parseQualityDashboard(parsed.dashboard) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Scan failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
