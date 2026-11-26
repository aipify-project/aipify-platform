"use client";

import Image from "next/image";

/**
 * Shared sidebar mark for APP Customer, Seller Portal, and Platform Admin.
 * Uses the existing Aipify mark. The words stay the same in every language.
 */
export function PoweredByAipify({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 px-4 py-3 ${className}`} data-powered-by-aipify="true">
      <Image
        src="/website-kompis/design-v1/brand/aipify-mark.svg"
        alt=""
        width={20}
        height={20}
        className="h-5 w-5 shrink-0"
      />
      <p className="text-[11px] font-medium leading-none text-[#64748B]">Powered by Aipify</p>
    </div>
  );
}
