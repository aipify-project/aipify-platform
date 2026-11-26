import { NextRequest, NextResponse } from "next/server";
import {
  assignSupportTicket,
  getSupportWriteGateState,
  httpStatusForWriteDenial,
  postExternalReply,
  postInternalNote,
  updateSupportTicketStatus,
} from "@/lib/platform-portal/support-center/write-ops";
import { createClient } from "@/lib/supabase/server";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * Platform Support write actions — fail-closed until Core Staging batch apply.
 * Email send remains separately gated. Internal notes never use signature/email.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized", code: "unauthorized", ...getSupportWriteGateState() },
        { status: 401, headers: NO_STORE },
      );
    }

    const body = (await request.json().catch(() => null)) as Record<
      string,
      unknown
    > | null;
    if (!body || typeof body.action !== "string") {
      return NextResponse.json(
        { error: "validation", ...getSupportWriteGateState() },
        { status: 400, headers: NO_STORE },
      );
    }

    const ticketId = String(body.ticketId ?? "");
    if (!/^[0-9a-f-]{36}$/i.test(ticketId)) {
      return NextResponse.json(
        { error: "validation", message: "Ugyldig sak-ID.", ...getSupportWriteGateState() },
        { status: 400, headers: NO_STORE },
      );
    }

    if (body.action === "internal_note") {
      const result = await postInternalNote({
        ticketId,
        body: String(body.body ?? ""),
        agentUserId: user.id,
        rpc: supabase,
      });
      if (!result.ok) {
        return NextResponse.json(
          { error: result.message, code: result.code, ...getSupportWriteGateState() },
          { status: httpStatusForWriteDenial(result.code), headers: NO_STORE },
        );
      }
      return NextResponse.json(result, { headers: NO_STORE });
    }

    if (body.action === "external_reply") {
      const result = await postExternalReply({
        ticketId,
        body: String(body.body ?? ""),
        agentUserId: user.id,
        templateId: typeof body.templateId === "string" ? body.templateId : null,
        templateVersion:
          typeof body.templateVersion === "number" ? body.templateVersion : null,
        includeSignature: body.includeSignature !== false,
        signatureText:
          typeof body.signatureText === "string" ? body.signatureText : null,
        rpc: supabase,
      });
      if (!result.ok) {
        return NextResponse.json(
          { error: result.message, code: result.code, ...getSupportWriteGateState() },
          { status: httpStatusForWriteDenial(result.code), headers: NO_STORE },
        );
      }
      return NextResponse.json(result, { headers: NO_STORE });
    }

    if (body.action === "status") {
      const result = await updateSupportTicketStatus({
        ticketId,
        fromStatus: String(body.fromStatus ?? ""),
        toStatus: String(body.toStatus ?? ""),
        agentUserId: user.id,
        rpc: supabase,
      });
      if (!result.ok) {
        return NextResponse.json(
          { error: result.message, code: result.code, ...getSupportWriteGateState() },
          { status: httpStatusForWriteDenial(result.code), headers: NO_STORE },
        );
      }
      return NextResponse.json(result, { headers: NO_STORE });
    }

    if (body.action === "assign") {
      const assignee =
        body.assigneeUserId == null || body.assigneeUserId === ""
          ? null
          : String(body.assigneeUserId);
      const result = await assignSupportTicket({
        ticketId,
        assigneeUserId: assignee,
        agentUserId: user.id,
        rpc: supabase,
      });
      if (!result.ok) {
        return NextResponse.json(
          { error: result.message, code: result.code, ...getSupportWriteGateState() },
          { status: httpStatusForWriteDenial(result.code), headers: NO_STORE },
        );
      }
      return NextResponse.json(result, { headers: NO_STORE });
    }

    return NextResponse.json(
      { error: "unknown_action", ...getSupportWriteGateState() },
      { status: 400, headers: NO_STORE },
    );
  } catch {
    return NextResponse.json(
      { error: "unknown", ...getSupportWriteGateState() },
      { status: 500, headers: NO_STORE },
    );
  }
}
