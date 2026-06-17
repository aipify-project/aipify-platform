import { NextResponse } from "next/server";
import {
  parseWorkspaceCenter,
} from "@/lib/companion-workspace-intelligence";
import {
  getCompanionWorkspaceCenter,
  searchCompanionWorkspace,
  updateCompanionWorkspaceSettings,
} from "@/lib/core/companion-workspace-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    if (search) {
      const results = await searchCompanionWorkspace(supabase, search);
      return NextResponse.json(results);
    }

    const data = await getCompanionWorkspaceCenter(supabase);
    const parsed = parseWorkspaceCenter(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load workspace center";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    if (body.action === "enable") {
      const data = await updateCompanionWorkspaceSettings(supabase, {
        workspace_enabled: true,
        workspace_analysis_approved: true,
        project_discovery_approved: true,
        application_awareness_approved: true,
        relationship_discovery_approved: true,
      });
      return NextResponse.json(parseWorkspaceCenter(data));
    }

    return NextResponse.json({ error: "Unsupported action" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update workspace settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const data = await updateCompanionWorkspaceSettings(supabase, body);
    return NextResponse.json(parseWorkspaceCenter(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update workspace settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
