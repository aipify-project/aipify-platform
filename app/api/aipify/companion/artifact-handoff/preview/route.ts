import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getExternalArtifactHandoffAdapter } from "@/lib/integration-intelligence/external-artifact-handoff/registry";
import {
  loadCanvaHandoffConnectionMaterial,
  loadCompanionHandoffAttachmentAccess,
} from "@/lib/integration-intelligence/external-artifact-handoff/server";
import { assertCanvaHandoffPermissionForRole } from "@/lib/integration-intelligence/providers/canva/permissions";
import { classifyExternalProviderHandoffFromRegistry } from "@/lib/integration-intelligence/external-applications/handoff-bridge";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import type { UserRole } from "@/lib/tenant/types";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const providerKey = (searchParams.get("provider") ?? "canva").trim().toLowerCase();
    const attachmentId = searchParams.get("attachment_id")?.trim();
    const conversationId = searchParams.get("conversation_id")?.trim();

    if (!attachmentId || !conversationId) {
      return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 });
    }

    const adapter = getExternalArtifactHandoffAdapter(providerKey);
    if (!adapter) {
      return NextResponse.json({ ok: false, error: "adapter_missing" }, { status: 404 });
    }

    const attachment = await loadCompanionHandoffAttachmentAccess(supabase, attachmentId);
    if (!attachment.ok || attachment.conversation_id !== conversationId) {
      return NextResponse.json({ ok: false, error: attachment.error ?? "forbidden" }, { status: 403 });
    }

    if (attachment.security_status !== "approved") {
      return NextResponse.json({ ok: false, error: "attachment_not_approved" }, { status: 400 });
    }

    const profile = await getDashboardProfile(supabase);
    if (!profile) {
      return NextResponse.json({ ok: false, error: "no_profile" }, { status: 403 });
    }

    const permissionGranted = assertCanvaHandoffPermissionForRole(profile.user.role as UserRole);

    const connection = await loadCanvaHandoffConnectionMaterial(supabase);
    const handoffClass = classifyExternalProviderHandoffFromRegistry({
      provider_key: providerKey,
      consent_granted: false,
      permission_granted: permissionGranted,
      connection_connected: connection.connected,
    });

    const preview = adapter.buildPreview({
      attachment_id: attachmentId,
      conversation_id: conversationId,
      filename: attachment.original_filename ?? "attachment",
      mime_type: attachment.mime_type ?? "application/octet-stream",
      category: (attachment.category as "image" | "pdf" | "document" | "text" | "other") ?? "other",
      byte_size: attachment.byte_size ?? 0,
      connection_connected: connection.connected,
    });

    return NextResponse.json({
      ok: true,
      preview,
      handoff: handoffClass,
      connection_connected: connection.connected,
    });
  } catch {
    return NextResponse.json({ ok: false, error: "preview_failed" }, { status: 500 });
  }
}
