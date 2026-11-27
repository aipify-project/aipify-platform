"use client";

import { Package } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

const PRIMARY =
  "inline-flex min-h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2 disabled:opacity-60";
const SECONDARY =
  "inline-flex min-h-11 items-center justify-center rounded-xl border border-[#E8E4F2] bg-white px-4 text-sm font-semibold text-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DDD6FE] focus-visible:ring-offset-2";

/**
 * Product explanation card for a seller. Share and read-more are the only actions.
 * Price and commission text are supplied by the caller from authoritative data.
 */
export function GuidedProductCard({
  title,
  imageSrc,
  imageAlt,
  statusLabel,
  value,
  audienceLabel,
  audience,
  knowLabel,
  know,
  priceLabel,
  price,
  commissionLabel,
  commission,
  readMoreLabel,
  closeLabel,
  shareLabel,
  sharePending,
  shareDisabledReason,
  onShare,
  details,
  footer,
}: {
  title: string;
  imageSrc?: string | null;
  imageAlt: string;
  statusLabel: string;
  value: string;
  audienceLabel: string;
  audience: string;
  knowLabel: string;
  know: string;
  priceLabel: string;
  price: ReactNode;
  commissionLabel: string;
  commission: string;
  readMoreLabel: string;
  closeLabel: string;
  shareLabel: string;
  sharePending?: boolean;
  shareDisabledReason?: string | null;
  onShare?: () => void;
  details: ReactNode;
  footer?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const dialogTitleId = useId();
  const readMoreRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const returnFocus = readMoreRef.current;
    closeRef.current?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnFocus?.focus();
    };
  }, [open]);

  return (
    <li className="flex h-full flex-col rounded-2xl border border-[#E8E4F2] bg-white p-5 shadow-[0_1px_2px_rgba(30,24,60,0.04),0_8px_24px_rgba(30,24,60,0.04)]">
      <div className="flex items-start justify-between gap-3">
        <h2 id={titleId} className="text-xl font-semibold tracking-tight text-[#1E293B]">
          {title}
        </h2>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#E8E4F2] bg-[#F7F4FF] px-2.5 py-1 text-xs font-semibold text-[#5538D3]">
          <Package className="h-3.5 w-3.5" aria-hidden />
          {statusLabel}
        </span>
      </div>

      {imageSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- caller supplies an approved catalog asset
        <img
          src={imageSrc}
          alt={imageAlt}
          className="mt-4 h-44 w-full rounded-xl border border-[#E8E4F2] object-cover object-center"
        />
      ) : (
        <div className="mt-4 flex h-44 items-center justify-center rounded-xl bg-[#F3EDFF] text-[#7C3AED]">
          <Package className="h-10 w-10" aria-hidden />
          <span className="sr-only">{imageAlt}</span>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-[#475569]">{value}</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">{audienceLabel}</p>
      <p className="mt-1 text-sm text-[#1E293B]">{audience}</p>

      <div className="mt-4 rounded-xl bg-[#F6F4FB] p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{knowLabel}</p>
        <p className="mt-1 text-sm leading-relaxed text-[#475569]">{know}</p>
      </div>

      <div className="mt-4 space-y-3 text-sm">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{priceLabel}</p>
          <div className="mt-1 text-[#1E293B]">{price}</div>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">{commissionLabel}</p>
          <p className="mt-1 text-[#1E293B]">{commission}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
        <button
          ref={readMoreRef}
          type="button"
          className={SECONDARY}
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
        >
          {readMoreLabel}
        </button>
        {onShare ? (
          <button type="button" className={PRIMARY} onClick={onShare} disabled={sharePending}>
            {shareLabel}
          </button>
        ) : (
          <p className="self-center text-sm text-[#64748B]">{shareDisabledReason}</p>
        )}
      </div>
      {footer}

      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#1E293B]/40 p-4 sm:items-center"
          role="presentation"
          onClick={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <h2 id={dialogTitleId} className="text-2xl font-semibold text-[#1E293B]">
              {title}
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#475569]">{details}</div>
            <button ref={closeRef} type="button" className={`${SECONDARY} mt-6`} onClick={() => setOpen(false)}>
              {closeLabel}
            </button>
          </div>
        </div>
      ) : null}
    </li>
  );
}
