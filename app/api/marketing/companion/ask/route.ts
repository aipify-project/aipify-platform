import { NextResponse } from "next/server";
import { normalizeWebsiteKompisEmbedInstallId } from "@/lib/marketing/website-kompis-embed";
import {
  PublicCompanionAskValidationError,
  askPublicPlatformCompanion,
} from "@/lib/marketing/public-companion-ask";
import {
  assertWebsiteKompisEmbedProtectedRequest,
  websiteKompisPublicSecurityErrorResponse,
} from "@/lib/marketing/website-kompis-public-security-gate";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    const record =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : {};
    const installId = normalizeWebsiteKompisEmbedInstallId(record.installId);

    if (installId) {
      const gate = await assertWebsiteKompisEmbedProtectedRequest(request, {
        installId,
        domain: typeof record.domain === "string" ? record.domain : null,
        category: "ask",
      });
      if (!gate.ok) {
        return websiteKompisPublicSecurityErrorResponse(gate);
      }
    }

    const requestHost = request.headers.get("host");
    const response = await askPublicPlatformCompanion(
      body as Parameters<typeof askPublicPlatformCompanion>[0],
      { requestHost },
    );
    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof PublicCompanionAskValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to process question" }, { status: 500 });
  }
}
