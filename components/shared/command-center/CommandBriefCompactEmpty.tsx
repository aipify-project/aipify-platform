"use client";

import { AppPremiumShell } from "@/lib/design/app-premium-shell";

type CommandBriefCompactEmptyProps = {
  title: string;
  body?: string;
  icon?: string;
};

export function CommandBriefCompactEmpty({ title, body, icon }: CommandBriefCompactEmptyProps) {
  return (
    <div className="rounded-xl border border-aipify-border bg-aipify-surface px-4 py-3 sm:px-5">
      <p className="text-sm font-medium text-aipify-text">
        {icon ? (
          <>
            <span aria-hidden="true">{icon} </span>
            {title.replace(/^[^\p{L}\p{N}]+\s*/u, "")}
          </>
        ) : (
          title
        )}
      </p>
      {body ? <p className={`mt-1 ${AppPremiumShell.commandBriefBody}`}>{body}</p> : null}
    </div>
  );
}
