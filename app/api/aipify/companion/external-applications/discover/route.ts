import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  buildExternalApplicationDiscovery,
  buildExternalApplicationPermissionMap,
} from "@/lib/integration-intelligence/external-applications";
import {
  resolveWorkspaceFromArtifact,
  selectExternalApplications,
  type ExternalApplicationOperation,
} from "@/lib/companion-runtime/external-application-orchestration";
import { loadCanvaHandoffConnectionMaterial } from "@/lib/integration-intelligence/external-artifact-handoff/server";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { UserRole } from "@/lib/tenant/types";
import type { CompanionArtifactCategory } from "@/lib/companion-runtime/artifact-context/types";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const operation = (searchParams.get("operation") ?? "handoff") as ExternalApplicationOperation;
    const category = (searchParams.get("category") ?? "other") as CompanionArtifactCategory;
    const mimeType = searchParams.get("mime_type") ?? "application/octet-stream";

    const profile = await getDashboardProfile(supabase);
    if (!profile) {
      return NextResponse.json({ ok: false, error: "no_profile" }, { status: 403 });
    }

    const permissionMap = buildExternalApplicationPermissionMap(profile.user.role as UserRole);
    const canvaConnection = await loadCanvaHandoffConnectionMaterial(supabase);
    const connectedKeys = canvaConnection.connected ? ["canva"] : [];

    const discovery = buildExternalApplicationDiscovery({
      category,
      mime_type: mimeType,
      operation,
      connected_application_keys: connectedKeys,
      permission_granted_by_application: permissionMap,
    });

    const selection = selectExternalApplications({ discovery, operation });

    return NextResponse.json({
      ok: true,
      workspace: discovery.workspace ?? resolveWorkspaceFromArtifact({ category, mime_type: mimeType }),
      operation,
      discovery,
      selection,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "discovery_failed" }, { status: 500 });
  }
}
