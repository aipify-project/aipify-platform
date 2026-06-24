type PreferencesDiagnosticEvent = {
  at: number;
  event: string;
  stableRequestKey: string | null;
  httpStatus: number | null;
  errorCode: string | null;
  source: string;
};

const events: PreferencesDiagnosticEvent[] = [];
let requestCount = 0;

export function recordPreferencesLoadAttempt(input: {
  stableRequestKey: string | null;
  httpStatus?: number | null;
  errorCode?: string | null;
  source: string;
  outcome: "start" | "success" | "error";
}): number {
  requestCount += input.outcome === "start" ? 1 : 0;
  if (process.env.NODE_ENV === "production") {
    return requestCount;
  }

  const entry: PreferencesDiagnosticEvent = {
    at: Date.now(),
    event: input.outcome,
    stableRequestKey: input.stableRequestKey,
    httpStatus: input.httpStatus ?? null,
    errorCode: input.errorCode ?? null,
    source: input.source,
  };
  events.push(entry);
  if (events.length > 40) {
    events.shift();
  }

  console.info("[aipify:notification-preferences]", {
    requestCount,
    ...entry,
  });

  return requestCount;
}

export function getPreferencesRequestCount(): number {
  return requestCount;
}

export function getPreferencesDiagnosticEvents(): readonly PreferencesDiagnosticEvent[] {
  return events;
}

export function resetPreferencesDiagnosticsForTests(): void {
  requestCount = 0;
  events.length = 0;
}

export function countPreferencesRequestsInWindow(windowMs: number): number {
  const cutoff = Date.now() - windowMs;
  return events.filter((event) => event.event === "start" && event.at >= cutoff).length;
}
