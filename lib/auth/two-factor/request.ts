import { headers } from "next/headers";

export async function getClientIpHash(): Promise<string | null> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() ?? h.get("x-real-ip");
  if (!ip) return null;

  const { createHash } = await import("crypto");
  return createHash("sha256").update(ip).digest("hex");
}
