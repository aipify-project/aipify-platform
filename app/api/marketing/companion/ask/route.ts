import { NextResponse } from "next/server";
import {
  PublicCompanionAskValidationError,
  askPublicPlatformCompanion,
} from "@/lib/marketing/public-companion-ask";
import { attachWebsiteKompisAnswerFeedbackReceipt } from "@/lib/marketing/website-kompis-answer-feedback-attach";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const requestHost = request.headers.get("host");
    const response = await askPublicPlatformCompanion(
      body as Parameters<typeof askPublicPlatformCompanion>[0],
      { requestHost },
    );

    const record = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
    const pageContext =
      record.pageContext && typeof record.pageContext === "object"
        ? (record.pageContext as Record<string, unknown>)
        : null;
    const pagePathname =
      typeof pageContext?.pathname === "string"
        ? pageContext.pathname
        : typeof pageContext?.path === "string"
          ? pageContext.path
          : null;

    const withReceipt = await attachWebsiteKompisAnswerFeedbackReceipt({
      response,
      question: typeof record.question === "string" ? record.question : "",
      installId: typeof record.installId === "string" ? record.installId : null,
      domain: typeof record.domain === "string" ? record.domain : null,
      pagePathname,
    });

    return NextResponse.json(withReceipt);
  } catch (error) {
    if (error instanceof PublicCompanionAskValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 });
  }
}
