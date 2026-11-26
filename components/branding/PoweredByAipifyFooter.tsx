"use client";

/**
 * Shared left-rail footer mark — APP, Platform Admin, Seller Portal.
 * Uses the approved Aipify wordmark asset; never a generated placeholder.
 */
export function PoweredByAipifyFooter({
  label,
  className = "",
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 border-t border-[#E8E4F2] px-4 py-3 ${className}`}
      data-aipify-brand-footer="powered-by"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- brand mark, not content photography */}
      <img
        src="/website-kompis/design-v1/brand/aipify-logo-dark.png"
        alt=""
        width={72}
        height={22}
        className="h-5 w-auto opacity-80"
        aria-hidden
      />
      <p className="text-[0.7rem] font-medium leading-relaxed text-[#94A3B8]">{label}</p>
    </div>
  );
}
