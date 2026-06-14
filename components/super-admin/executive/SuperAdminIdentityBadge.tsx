"use client";

type SuperAdminIdentityBadgeProps = {
  roleLabel: string;
  verifiedLabel: string;
};

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 4 6v6c0 5 3.5 9 8 9s8-4 8-9V6l-8-3Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
    </svg>
  );
}

export default function SuperAdminIdentityBadge({
  roleLabel,
  verifiedLabel,
}: SuperAdminIdentityBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 shadow-sm">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700">
        <ShieldIcon />
      </div>
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-800">{roleLabel}</p>
        <p className="text-xs text-zinc-500">{verifiedLabel}</p>
      </div>
    </div>
  );
}
