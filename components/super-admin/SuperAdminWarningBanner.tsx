"use client";

type SuperAdminWarningBannerProps = {
  title: string;
  body: string;
  proceedLabel: string;
  onProceed: () => void;
};

export default function SuperAdminWarningBanner({
  title,
  body,
  proceedLabel,
  onProceed,
}: SuperAdminWarningBannerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/95 px-4">
      <div className="w-full max-w-lg rounded-xl border border-amber-900/60 bg-zinc-900 p-8 shadow-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">{title}</p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-300">{body}</p>
        <button
          type="button"
          onClick={onProceed}
          className="mt-8 w-full rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
        >
          {proceedLabel}
        </button>
      </div>
    </div>
  );
}
