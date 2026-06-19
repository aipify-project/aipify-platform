export function detectServiceIntakeAdvisorIntent(message: string): boolean {
  return /\b(service intake|intake form|consent|submission|service delivery|booking readiness)\b/i.test(message.toLowerCase());
}
export function getServiceIntakeAdvisorRoute(): string {
  return "/app/services/forms";
}
