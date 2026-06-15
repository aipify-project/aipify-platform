"use client";

type PlatformPortalBannerProps = {
  title: string;
  body: string;
  variant?: "info" | "warning" | "critical" | "success";
};

const VARIANT_STYLES = {
  info: "border-slate-200 bg-[#F8FAFC] text-slate-700",
  warning: "border-amber-200 bg-amber-50/90 text-amber-950",
  critical: "border-red-200 bg-red-50/90 text-red-950",
  success: "border-emerald-200 bg-emerald-50/90 text-emerald-950",
} as const;

export default function PlatformPortalBanner({
  title,
  body,
  variant = "info",
}: PlatformPortalBannerProps) {
  return (
    <div className={`border-b px-4 py-3 lg:px-8 ${VARIANT_STYLES[variant]}`}>
      <div className="mx-auto flex max-w-7xl items-start gap-3">
        <span
          className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current/10 bg-white/70 text-xs"
          aria-hidden="true"
        >
          ◆
        </span>
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] opacity-70">{title}</p>
          <p className="mt-1 text-sm leading-relaxed">{body}</p>
        </div>
      </div>
    </div>
  );
}
