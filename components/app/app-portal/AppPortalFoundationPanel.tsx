import Link from "next/link";

type AppPortalFoundationPanelProps = {
  title: string;
  subtitle: string;
  structureNote: string;
  backLabel: string;
  backHref?: string;
  comingSoonLabel?: string;
};

export function AppPortalFoundationPanel({
  title,
  subtitle,
  structureNote,
  backLabel,
  backHref = "/app",
  comingSoonLabel,
}: AppPortalFoundationPanelProps) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <Link href={backHref} className="text-sm font-medium text-indigo-700 hover:text-indigo-800">
          ← {backLabel}
        </Link>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {comingSoonLabel ? (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
              {comingSoonLabel}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-slate-600">{subtitle}</p>
      </div>
      <p className="rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4 text-sm text-slate-800">
        {structureNote}
      </p>
    </div>
  );
}
