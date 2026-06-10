export function getTrialDaysRemaining(trialEndsAt: string | null | undefined): number | null {
  if (!trialEndsAt) {
    return null;
  }

  const end = new Date(trialEndsAt).getTime();
  const now = Date.now();
  const diffMs = end - now;

  if (diffMs <= 0) {
    return 0;
  }

  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function isTrialActive(
  status: string,
  trialEndsAt: string | null | undefined
): boolean {
  if (status !== "trialing" && status !== "trial") {
    return false;
  }

  const days = getTrialDaysRemaining(trialEndsAt);
  return days !== null && days > 0;
}
