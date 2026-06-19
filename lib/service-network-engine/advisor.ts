export function detectServiceNetworkAdvisorIntent(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    /\b(service network|multi.?location|chair rent|room rent|rental agreement|location manager)\b/i.test(
      lower,
    ) ||
    /\b(tjenestenettverk|lokasjon|stol|leieavtale|avdelingsleder)\b/i.test(lower)
  );
}

export function getServiceNetworkAdvisorRoute(): string {
  return "/app/services/network";
}
