import { NextResponse } from "next/server";
import {
  isWebsiteKompisDiagnosticGuardConfigured,
  runWebsiteKompisMetadataPipelineDiagnostic,
  runWebsiteKompisRuntimeTrustDiagnostic,
  verifyWebsiteKompisDiagnosticToken,
  WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN_HEADER,
} from "@/lib/marketing/website-kompis-runtime-trust-diagnostic";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store",
};

export async function GET(request: Request) {
  if (!isWebsiteKompisDiagnosticGuardConfigured()) {
    return NextResponse.json({ ok: false }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const token = request.headers.get(WEBSITE_KOMPIS_DIAGNOSTIC_TOKEN_HEADER);
  if (!verifyWebsiteKompisDiagnosticToken(token)) {
    return NextResponse.json({ ok: false }, { status: 404, headers: NO_STORE_HEADERS });
  }

  const url = new URL(request.url);
  const domain = url.searchParams.get("domain");
  const installId = url.searchParams.get("installId");
  const mode = url.searchParams.get("mode");

  if (mode === "metadataPipeline") {
    const diagnostic = await runWebsiteKompisMetadataPipelineDiagnostic({
      domain,
      installId,
      requestHost: url.hostname,
    });

    return NextResponse.json(diagnostic, { status: 200, headers: NO_STORE_HEADERS });
  }

  const diagnostic = await runWebsiteKompisRuntimeTrustDiagnostic({ domain, installId });

  return NextResponse.json(diagnostic, { status: 200, headers: NO_STORE_HEADERS });
}
