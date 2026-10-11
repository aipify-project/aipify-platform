import { NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import {
  sanitizePublicCompanionDomain,
  sanitizePublicCompanionInstallId,
} from "@/lib/marketing/public-companion-tenant-faq";
import { recordWebsiteKompisAnswerFeedback } from "@/lib/marketing/website-kompis-answer-feedback-server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const answerId =
      typeof body.answerId === "string" ? body.answerId.trim() : "";
    const installId = sanitizePublicCompanionInstallId(
      typeof body.installId === "string" ? body.installId : null,
    );
    const domain = sanitizePublicCompanionDomain(
      typeof body.domain === "string" ? body.domain : null,
    );
    const visitorKey =
      typeof body.visitorKey === "string" ? body.visitorKey.trim() : "";
    const clear = body.clear === true;

    if (!answerId || !installId || !domain || !visitorKey) {
      return NextResponse.json({ error: "Invalid feedback payload." }, { status: 400 });
    }

    let admin;
    try {
      admin = createServiceRoleClient();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          code: "persistence_unavailable",
          error: "Feedback storage is not available yet.",
        },
        { status: 503 },
      );
    }

    const result = await recordWebsiteKompisAnswerFeedback(admin, {
      answerId,
      installId,
      domain,
      vote: body.vote,
      comment: body.comment,
      visitorKeyRaw: visitorKey,
      clear,
    });

    if (!result.ok) {
      const status =
        result.code === "persistence_unavailable"
          ? 503
          : result.code === "invalid_payload"
            ? 400
            : result.code === "not_found"
              ? 404
              : result.code === "rate_limited"
                ? 429
                : result.code === "tenant_mismatch"
                  ? 403
                  : 500;
      return NextResponse.json(
        { ok: false, code: result.code, error: result.message },
        { status },
      );
    }

    return NextResponse.json({
      ok: true,
      feedbackId: result.feedbackId,
      vote: result.vote,
      alreadyRecorded: result.alreadyRecorded,
      cleared: result.cleared === true,
      updated: result.updated === true,
    });
  } catch {
    return NextResponse.json({ error: "Failed to record feedback." }, { status: 500 });
  }
}
