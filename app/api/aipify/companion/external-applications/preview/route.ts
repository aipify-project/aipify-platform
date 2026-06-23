import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { classifyExternalApplicationHandoffFromRegistry } from "@/lib/integration-intelligence/external-applications/handoff-bridge";
import {
  assertHandoffPermissionForRole,
  loadHandoffConnectionMaterial,
} from "@/lib/integration-intelligence/external-artifact-handoff/connection-loader";
import {
  buildMicrosoft365ActionPreview,
  buildMicrosoft365DiscoverySnapshot,
  isMicrosoft365ApplicationKey,
} from "@/lib/integration-intelligence/providers/microsoft365";
import type { ExternalApplicationOperation } from "@/lib/companion-runtime/external-application-orchestration";
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
    const applicationKey = searchParams.get("application")?.trim().toLowerCase() ?? "";
    const operation = (searchParams.get("operation") ?? "create") as ExternalApplicationOperation;
    const artifactId = searchParams.get("artifact_id")?.trim() ?? "pending";
    const conversationId = searchParams.get("conversation_id")?.trim() ?? "";
    const filename = searchParams.get("filename")?.trim() ?? "Document.docx";
    const mimeType = searchParams.get("mime_type")?.trim() ?? "application/octet-stream";
    const category = (searchParams.get("category") ?? "document") as CompanionArtifactCategory;
    const byteSize = Number(searchParams.get("byte_size") ?? "0");
    const externalFileId = searchParams.get("external_file_id")?.trim() ?? null;

    if (!isMicrosoft365ApplicationKey(applicationKey)) {
      return NextResponse.json({ ok: false, error: "application_not_supported" }, { status: 404 });
    }

    const profile = await getDashboardProfile(supabase);
    if (!profile) {
      return NextResponse.json({ ok: false, error: "no_profile" }, { status: 403 });
    }

    const permissionGranted = assertHandoffPermissionForRole(applicationKey, profile.user.role as UserRole);
    const connection = await loadHandoffConnectionMaterial(supabase, applicationKey);

    const handoff = classifyExternalApplicationHandoffFromRegistry({
      application_key: applicationKey,
      consent_granted: false,
      permission_granted: permissionGranted,
      connection_connected: connection.connected,
      operation,
    });

    const preview = buildMicrosoft365ActionPreview({
      application_key: applicationKey,
      operation,
      artifact_id: artifactId,
      conversation_id: conversationId,
      filename,
      mime_type: mimeType,
      category,
      byte_size: Number.isFinite(byteSize) ? byteSize : 0,
      connection_connected: connection.connected,
      permission_granted: permissionGranted,
      account_label: connection.account_label ?? null,
      external_file_id: externalFileId,
    });

    let accountDiscovery = null;
    if (connection.connected && connection.access_token) {
      accountDiscovery = await buildMicrosoft365DiscoverySnapshot(connection.access_token);
    }

    return NextResponse.json({
      ok: true,
      preview,
      handoff,
      connection_connected: connection.connected,
      account_label: connection.account_label ?? null,
      account_discovery: accountDiscovery,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "preview_failed" }, { status: 500 });
  }
}
