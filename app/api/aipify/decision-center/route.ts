import { NextResponse } from "next/server";
import { parseDecisionItem, parseDecisionList } from "@/lib/app-portal/decision-center";
import {
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const outcomeRating = searchParams.get("outcome_rating");
    const { data, error } = await supabase.rpc("list_app_portal_decisions", {
      p_category: searchParams.get("category") || null,
      p_status: searchParams.get("status") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_impact_level: searchParams.get("impact_level") || null,
      p_date_from: searchParams.get("date_from") || null,
      p_date_to: searchParams.get("date_to") || null,
      p_outcome_rating: outcomeRating ? Number(outcomeRating) : null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/decision-center]", error.message);
    }
    return NextResponse.json(parseDecisionList(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load decisions";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  decision_owner_id?: string;
  contributors?: unknown[];
  decision_date?: string;
  status?: string;
  impact_level?: string;
  expected_outcome?: string;
  supporting_evidence?: unknown[];
  related_business_packs?: unknown[];
  linked_follow_up_ids?: unknown[];
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_decision", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "operational",
      p_decision_owner_id: body.decision_owner_id ?? null,
      p_contributors: body.contributors ?? [],
      p_decision_date: body.decision_date ?? null,
      p_status: body.status ?? "proposed",
      p_impact_level: body.impact_level ?? "moderate",
      p_expected_outcome: body.expected_outcome ?? "",
      p_supporting_evidence: body.supporting_evidence ?? [],
      p_related_business_packs: body.related_business_packs ?? [],
      p_linked_follow_up_ids: body.linked_follow_up_ids ?? [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseDecisionItem(data);
    return NextResponse.json({ created: true, decision: item });
  } catch {
    return NextResponse.json({ error: "Failed to create decision" }, { status: 500 });
  }
}
