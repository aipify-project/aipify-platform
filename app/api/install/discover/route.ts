import { NextResponse } from "next/server";
import { isInstallTokenFormat } from "@/lib/auth/install-token";
import {
  buildDiscoveryResult,
  DETECTED_SYSTEMS,
  WORKFLOW_AREAS,
  type DetectedSystem,
  type WorkflowArea,
} from "@/lib/install";
import { createClient } from "@/lib/supabase/server";

function parseDetectedSystems(value: unknown): DetectedSystem[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is DetectedSystem =>
      typeof item === "string" &&
      (DETECTED_SYSTEMS as readonly string[]).includes(item)
  );
}

function parseWorkflowAreas(value: unknown): WorkflowArea[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is WorkflowArea =>
      typeof item === "string" &&
      (WORKFLOW_AREAS as readonly string[]).includes(item)
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationToken = body.installation_token as string | undefined;

    if (!installationToken || !isInstallTokenFormat(installationToken)) {
      return NextResponse.json(
        { error: "Invalid installation token" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const { data: verified, error: verifyError } = await supabase.rpc(
      "verify_installation_token",
      { p_token: installationToken }
    );

    if (verifyError || !verified?.length) {
      return NextResponse.json(
        { error: "Installation not found" },
        { status: 404 }
      );
    }

    const installationId = verified[0].installation_id as string;
    const systems = parseDetectedSystems(body.systems);
    const workflows = parseWorkflowAreas(body.workflows);
    const discovery = buildDiscoveryResult({
      installationId,
      systems,
      workflows,
      automationOpportunities: Array.isArray(body.automation_opportunities)
        ? body.automation_opportunities.filter((item: unknown) => typeof item === "string")
        : [],
      supportNeeds: Array.isArray(body.support_needs)
        ? body.support_needs.filter((item: unknown) => typeof item === "string")
        : [],
    });

    const { error: saveError } = await supabase.rpc(
      "save_installation_discovery",
      {
        p_installation_id: installationId,
        p_discovery: discovery,
      }
    );

    if (saveError) {
      return NextResponse.json({ error: saveError.message }, { status: 400 });
    }

    return NextResponse.json({ discovery });
  } catch {
    return NextResponse.json(
      { error: "Discovery failed" },
      { status: 500 }
    );
  }
}
