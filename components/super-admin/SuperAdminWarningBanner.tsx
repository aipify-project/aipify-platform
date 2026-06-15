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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl border border-amber-200 bg-white p-8 shadow-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">{title}</p>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">{body}</p>
        <button
          type="button"
          onClick={onProceed}
          className="mt-8 w-full rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
        >
          {proceedLabel}
        </button>
      </div>
    </div>
  );
}
