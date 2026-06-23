export type WorkerBootstrapFailureStep =
  | "rpc_call"
  | "parse"
  | "scope_mismatch"
  | "tenant_context";

export type WorkerBootstrapFailure = {
  step: WorkerBootstrapFailureStep;
  rpc?: string;
  sqlState?: string;
  message: string;
  durationMs?: number;
  tenantId?: string;
  userId?: string;
  queueId?: string;
};

const SECRET_PATTERNS = [
  /Bearer\s+\S+/gi,
  /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g,
  /service_role[^\s]*/gi,
];

export function sanitizeBootstrapErrorMessage(message: string): string {
  let sanitized = message.trim();
  for (const pattern of SECRET_PATTERNS) {
    sanitized = sanitized.replace(pattern, "[redacted]");
  }
  return sanitized.slice(0, 500);
}

export function extractPostgresRpcError(error: {
  message?: string;
  code?: string;
}): { sqlState?: string; message: string } {
  return {
    sqlState: error.code,
    message: sanitizeBootstrapErrorMessage(error.message ?? "bootstrap_rpc_failed"),
  };
}

export function formatBootstrapErrorMessage(failure: WorkerBootstrapFailure): string {
  const parts = [
    `step=${failure.step}`,
    failure.rpc ? `rpc=${failure.rpc}` : null,
    failure.sqlState ? `sqlstate=${failure.sqlState}` : null,
    `message=${failure.message}`,
  ].filter(Boolean);
  return sanitizeBootstrapErrorMessage(parts.join("; "));
}
