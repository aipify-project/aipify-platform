import "server-only";

import { resolveTxt } from "node:dns/promises";
import {
  buildSecondaryDomainDnsRecordName,
  extractSecondaryDomainDnsChallengeToken,
} from "@/lib/platform-portal/secondary-domain-dns-challenge";

export type SecondaryDomainDnsLookupResult =
  | { ok: true; recordName: string; token: string; rawTxt: string[] }
  | {
      ok: false;
      code: "dns_lookup_failed" | "dns_txt_missing";
      recordName: string;
      detail?: string;
    };

/**
 * Server-side DNS TXT ownership proof. Never marks domains verified by itself —
 * caller must pass the returned token into the verify/bind RPC.
 */
export async function lookupSecondaryDomainDnsChallengeToken(input: {
  hostname: string;
  expectedToken?: string | null;
  timeoutMs?: number;
}): Promise<SecondaryDomainDnsLookupResult> {
  const hostname = input.hostname.trim().toLowerCase().replace(/\.+$/, "");
  const recordName = buildSecondaryDomainDnsRecordName(hostname);
  const timeoutMs = input.timeoutMs ?? 8000;

  try {
    const records = await Promise.race([
      resolveTxt(recordName),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("DNS_LOOKUP_TIMEOUT")), timeoutMs);
      }),
    ]);

    const rawTxt = records.map((chunks) => chunks.join(""));
    const token = extractSecondaryDomainDnsChallengeToken(
      records,
      input.expectedToken ?? null,
    );

    if (!token) {
      return { ok: false, code: "dns_txt_missing", recordName, detail: "no_matching_txt" };
    }

    return { ok: true, recordName, token, rawTxt };
  } catch (error) {
    const detail = error instanceof Error ? error.message : "dns_error";
    return { ok: false, code: "dns_lookup_failed", recordName, detail };
  }
}
