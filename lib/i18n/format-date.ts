import type { Locale } from "./config";

function toDateLocale(locale: string): string {
  if (locale === "en") return "en-GB";
  return locale;
}

export function formatDate(
  value: string | null | undefined,
  locale: Locale | string = "no"
): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(toDateLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatDateTime(
  value: string | null | undefined,
  locale: Locale | string = "no"
): string {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(toDateLocale(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
