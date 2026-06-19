import { parseCompanionBookingAdvisorBundle, type CompanionBookingAdvisorBundle } from "./parse";

export async function fetchCompanionBookingAdvisorBundle(): Promise<CompanionBookingAdvisorBundle> {
  const res = await fetch("/api/appointments/advisor");
  if (!res.ok) return { found: false };
  return parseCompanionBookingAdvisorBundle(await res.json());
}
