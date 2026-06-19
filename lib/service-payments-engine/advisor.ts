export function detectServicePaymentsAdvisorIntent(message: string): boolean {
  return /\b(service payments?|deposit|refund|no.?show|reconciliation)\b/i.test(message.toLowerCase());
}
export function getServicePaymentsAdvisorRoute(): string {
  return "/app/services/payments";
}
