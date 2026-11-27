import type { PhoneCountryOption } from "@/lib/app/account-profile/phone";

/**
 * Stable flag mark: same-origin SVG when available, emoji + ISO text fallback
 * when emoji flags are unsupported or the SVG is missing.
 */
export function AccountPhoneCountryFlag({
  country,
  className = "",
}: {
  country: PhoneCountryOption;
  className?: string;
}) {
  if (country.flagSrc) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`.trim()}>
        {/* eslint-disable-next-line @next/next/no-img-element -- local static SVG */}
        <img
          src={country.flagSrc}
          alt=""
          width={20}
          height={14}
          className="h-3.5 w-5 shrink-0 rounded-[2px] object-cover shadow-sm"
          aria-hidden
        />
        <span className="sr-only">{country.iso2}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`.trim()} aria-hidden>
      <span className="text-base leading-none">{country.flagEmoji}</span>
      <span className="rounded border border-gray-200 bg-white px-1 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-600">
        {country.iso2 === "OTHER" ? "—" : country.iso2}
      </span>
    </span>
  );
}
