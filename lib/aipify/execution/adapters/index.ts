import { mockAdapter } from "./base";
import type { ExecutionAdapter } from "./base";

export const emailAdapter = mockAdapter("send_email", "Email");
export const supportAdapter = mockAdapter("create_ticket", "Support ticket");
export const taskAdapter = mockAdapter("create_task", "Task");
export const faqAdapter = mockAdapter("publish_faq", "FAQ article");
export const notificationAdapter = mockAdapter("send_notification", "Notification");

const ADAPTERS: Record<string, ExecutionAdapter> = {
  send_email: emailAdapter,
  draft_email: mockAdapter("draft_email", "Email draft"),
  create_ticket: supportAdapter,
  create_task: taskAdapter,
  publish_faq: faqAdapter,
  send_notification: notificationAdapter,
  create_calendar_event: mockAdapter("create_calendar_event", "Calendar event"),
  escalate_case: mockAdapter("escalate_case", "Escalation"),
  start_workflow: mockAdapter("start_workflow", "Workflow"),
  customer_follow_up: mockAdapter("customer_follow_up", "Customer follow-up"),
};

export function getExecutionAdapter(actionType: string): ExecutionAdapter | null {
  return ADAPTERS[actionType] ?? null;
}

export function previewAction(actionType: string, payload: Record<string, unknown>) {
  const adapter = getExecutionAdapter(actionType);
  if (!adapter) return { preview: `No adapter for ${actionType}`, valid: false };
  return adapter.preview(payload);
}

export function executeAction(actionType: string, payload: Record<string, unknown>) {
  const adapter = getExecutionAdapter(actionType);
  if (!adapter) return { preview: "", valid: false, message: "Unknown action type" };
  const validation = adapter.validate(payload);
  if (!validation.valid) return validation;
  return adapter.execute(payload);
}
