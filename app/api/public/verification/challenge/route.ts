import { NextResponse } from "next/server";
import { createVerificationChallenge } from "@/lib/public-forms/human-verification";

export async function GET() {
  const challenge = createVerificationChallenge();
  return NextResponse.json({
    targetShape: challenge.targetShape,
    options: challenge.options,
    token: challenge.token,
    expiresAt: challenge.expiresAt,
  });
}
