/** Industry metadata for provider/Business Pack manifests — not Core business logic. */
export const BOOKING_INDUSTRY_METADATA = [
  "hairdresser",
  "salon",
  "beauty",
  "clinic",
  "spa",
  "consultant",
  "service_business",
] as const;

export type BookingIndustryMetadata = (typeof BOOKING_INDUSTRY_METADATA)[number];

export function isBookingIndustryMetadata(value: string): value is BookingIndustryMetadata {
  return (BOOKING_INDUSTRY_METADATA as readonly string[]).includes(value);
}

export function industryTermsForMetadata(industry: BookingIndustryMetadata): readonly string[] {
  switch (industry) {
    case "hairdresser":
    case "salon":
    case "beauty":
      return ["cut", "color", "treatment", "stylist", "appointment", "klipp", "farge"];
    case "clinic":
      return ["consultation", "treatment", "practitioner", "appointment"];
    case "spa":
      return ["treatment", "massage", "wellness", "appointment"];
    case "consultant":
      return ["meeting", "session", "consultation", "availability"];
    case "service_business":
    default:
      return ["service", "appointment", "booking", "availability"];
  }
}
