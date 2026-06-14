"use client";

type PlatformPortalBannerProps = {
  title: string;
  body: string;
};

export default function PlatformPortalBanner({ title, body }: PlatformPortalBannerProps) {
  return (
    <div className="border-b border-slate-300 bg-slate-900 px-4 py-2 text-slate-100 lg:px-8">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{title}</p>
      <p className="mt-0.5 text-xs text-slate-300">{body}</p>
    </div>
  );
}
