/** Phase 579 — Workflow orchestration intent detection for Companion routing. */

const WORKFLOW_PROCESS_PATTERNS = [
  /\bworkflow (?:center|report|health|analytics)\b/i,
  /\bwhich workflow is slowest\b/i,
  /\bwhere are bottlenecks\b/i,
  /\bwhat can be automated\b/i,
  /\bworkflow bottleneck\b/i,
  /\bprocess mapping\b/i,
  /\bapproval delays?\b/i,
  /\bautomation coverage\b/i,
  /\bworkflow template\b/i,
  /\bcross-department workflow\b/i,
];

export function detectWorkflowProcessIntent(message: string): boolean {
  const text = message.trim();
  if (!text) return false;
  return WORKFLOW_PROCESS_PATTERNS.some((pattern) => pattern.test(text));
}

export const WORKFLOW_PROCESS_ROUTE = "/app/workflow-center";
