import type { CommandBriefSignal, CommandBriefSinceLastBucket } from "./types";

export type CommandBriefSinceBoundary = {
  since_at: string | null;
  source: "last_login_at" | "last_command_brief_view_at" | "none";
};

export function resolveCommandBriefSinceBoundary(input: {
  last_login_at?: string | null;
  last_command_brief_view_at?: string | null;
}): CommandBriefSinceBoundary {
  const loginAt = input.last_login_at?.trim() || null;
  const briefViewAt = input.last_command_brief_view_at?.trim() || null;

  if (briefViewAt && loginAt) {
    const briefMs = Date.parse(briefViewAt);
    const loginMs = Date.parse(loginAt);
    if (Number.isFinite(briefMs) && Number.isFinite(loginMs) && briefMs >= loginMs) {
      return { since_at: briefViewAt, source: "last_command_brief_view_at" };
    }
  }

  if (briefViewAt) {
    return { since_at: briefViewAt, source: "last_command_brief_view_at" };
  }

  if (loginAt) {
    return { since_at: loginAt, source: "last_login_at" };
  }

  return { since_at: null, source: "none" };
}

function isAfterBoundary(timestamp: string | null, boundary: string | null): boolean {
  if (!boundary || !timestamp) return false;
  const boundaryMs = Date.parse(boundary);
  const timestampMs = Date.parse(timestamp);
  if (!Number.isFinite(boundaryMs) || !Number.isFinite(timestampMs)) return false;
  return timestampMs >= boundaryMs;
}

export function classifyCommandBriefSinceLastBucket(input: {
  signal: CommandBriefSignal;
  since_boundary: CommandBriefSinceBoundary;
}): CommandBriefSinceLastBucket {
  const { signal, since_boundary } = input;

  if (signal.status === "completed" || signal.status === "dismissed") {
    return "recently_completed";
  }

  if (signal.signal_type === "recommendation" || signal.signal_type === "opportunity") {
    if (isAfterBoundary(signal.detected_at, since_boundary.since_at)) {
      return "new_recommendation";
    }
  }

  if (isAfterBoundary(signal.detected_at, since_boundary.since_at)) {
    return "since_last";
  }

  if (signal.status === "unresolved" || signal.status === "new") {
    return "still_unresolved";
  }

  return "none";
}

export function applyCommandBriefSinceLastClassification(
  signals: readonly CommandBriefSignal[],
  sinceBoundary: CommandBriefSinceBoundary,
): CommandBriefSignal[] {
  return signals.map((signal) => ({
    ...signal,
    since_last_bucket: classifyCommandBriefSinceLastBucket({
      signal,
      since_boundary: sinceBoundary,
    }),
  }));
}

export function filterCommandBriefSignalsSinceLast(
  signals: readonly CommandBriefSignal[],
  sinceBoundary: CommandBriefSinceBoundary,
): CommandBriefSignal[] {
  if (!sinceBoundary.since_at) return [...signals];
  return signals.filter(
    (signal) =>
      signal.since_last_bucket === "since_last" ||
      signal.since_last_bucket === "still_unresolved" ||
      signal.since_last_bucket === "new_recommendation",
  );
}
