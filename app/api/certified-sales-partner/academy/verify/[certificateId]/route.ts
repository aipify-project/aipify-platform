import { NextResponse } from "next/server";
import { verifyCspCertificatePublic } from "@/lib/certified-sales-partner/academy/verify-certificate";

export const dynamic = "force-dynamic";

/**
 * Public certificate verification — no auth required.
 * Returns only status, product label, issuer, id, date, and privacy-limited initials.
 */
export async function GET(
  _request: Request,
  context: { params: Promise<{ certificateId: string }> },
) {
  try {
    const { certificateId } = await context.params;
    const result = await verifyCspCertificatePublic(certificateId ?? "");
    const status =
      result.status === "valid"
        ? 200
        : result.status === "revoked"
          ? 410
          : result.status === "unavailable"
            ? 503
            : 404;
    return NextResponse.json(result, {
      status,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch {
    return NextResponse.json(
      { status: "unavailable", certificateId: "", productLabel: "", issuer: "", orgNumber: "", country: "", issuedOn: null, holderInitials: null },
      { status: 503 },
    );
  }
}
