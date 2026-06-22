import {
  UNONIGHT_CONNECTION_TIMEOUT_MS,
  buildUnonightConnectionUrl,
  resolveUnonightApiBaseUrl,
} from "./constants";
import { parseUnonightConnectionContractDetailed } from "./contract-parser";

/** Fetch granted scopes from the live Unonight connection endpoint (source of truth). */
export async function fetchUnonightLiveGrantedScopes(input: {
  bearerToken: string;
  baseUrl?: string | null;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<string[] | null> {
  const baseUrl = resolveUnonightApiBaseUrl(input.baseUrl);
  const url = buildUnonightConnectionUrl(baseUrl);
  const fetchImpl = input.fetchImpl ?? fetch;
  const timeoutMs = input.timeoutMs ?? UNONIGHT_CONNECTION_TIMEOUT_MS;

  let response: Response;
  try {
    response = await fetchImpl(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${input.bearerToken.trim()}`,
        Accept: "application/json",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    return null;
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const parsed = parseUnonightConnectionContractDetailed(payload);
  if (!parsed.ok) return null;
  return parsed.contract.scopes;
}

export function mergeUnonightScopeLists(
  current: readonly string[],
  live: readonly string[],
): string[] {
  const seen = new Set<string>();
  const merged: string[] = [];
  for (const scope of [...current, ...live]) {
    const normalized = scope.trim();
    if (!normalized) continue;
    const key = normalized.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(normalized);
  }
  return merged;
}
