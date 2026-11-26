"use client";

import { formatPlatformDateTimeFull } from "@/lib/platform-presentation-quality";
import { ticketReference } from "@/lib/platform-portal/support-center";
import type { PlatformSupportTicketsListItem } from "@/lib/platform-portal/support-tickets-read-adapter";
import type { SupportCenterLabels } from "./support-center-labels";
import {
  assigneeLabelFor,
  labelFor,
  priorityTone,
  StatusChip,
  statusTone,
} from "./support-center-ui";

type Props = {
  items: PlatformSupportTicketsListItem[];
  selectedId: string | null;
  viewerUserId: string | null;
  locale: string;
  labels: SupportCenterLabels;
  onOpen: (id: string) => void;
};

function formatActivity(value: string, locale: string): string {
  return formatPlatformDateTimeFull(value, {
    locale,
    emptyFallback: "—",
    invalidFallback: "—",
  });
}

/** Full-width table (desktop, nothing selected). */
function TicketTable({ items, selectedId, viewerUserId, locale, labels, onOpen }: Props) {
  const headings = [
    labels.reference,
    labels.customer,
    labels.channel,
    labels.subject,
    labels.status,
    labels.priority,
    labels.assignee,
    labels.lastUpdated,
    "",
  ];
  return (
    <div className="hidden overflow-hidden rounded-xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] md:block">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[color:var(--aipify-border)]">
          <thead className="bg-[color:var(--aipify-surface-muted)]">
            <tr>
              {headings.map((heading, index) => (
                <th
                  key={`${heading}-${index}`}
                  scope="col"
                  className={`px-3 py-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--aipify-text-secondary)] ${
                    index === headings.length - 1 ? "text-right" : "text-left"
                  }`}
                >
                  {heading || <span className="sr-only">{labels.openTicket}</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--aipify-border)]">
            {items.map((row) => {
              const selected = selectedId === row.id;
              return (
                <tr
                  key={row.id}
                  aria-selected={selected}
                  className={`cursor-pointer transition-colors hover:bg-[color:var(--aipify-surface-muted)] ${
                    selected
                      ? "bg-violet-50 shadow-[inset_3px_0_0_var(--aipify-companion-purple)]"
                      : ""
                  }`}
                  onClick={() => onOpen(row.id)}
                >
                  <td className="whitespace-nowrap px-3 py-3 font-mono text-xs text-[color:var(--aipify-text)]">
                    {ticketReference(row.id)}
                  </td>
                  <td className="px-3 py-3 text-sm text-[color:var(--aipify-text)]">
                    {row.company_name || "—"}
                  </td>
                  <td className="px-3 py-3 text-sm text-[color:var(--aipify-text)]">
                    {labelFor(labels.channelLabels, row.channel)}
                  </td>
                  <td className="max-w-[22rem] truncate px-3 py-3 text-sm font-medium text-[color:var(--aipify-text)]">
                    {row.title}
                  </td>
                  <td className="px-3 py-3">
                    <StatusChip
                      code={row.status}
                      map={labels.statusLabels}
                      tone={statusTone(row.status)}
                    />
                  </td>
                  <td className="px-3 py-3">
                    <StatusChip
                      code={row.priority}
                      map={labels.priorityLabels}
                      tone={priorityTone(row.priority)}
                    />
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-sm text-[color:var(--aipify-text)]">
                    {assigneeLabelFor(row, viewerUserId, labels)}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 text-xs text-[color:var(--aipify-text-secondary)]">
                    {formatActivity(row.updated_at, locale)}
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpen(row.id);
                      }}
                      className="text-sm font-medium text-[color:var(--aipify-companion-purple)] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)]"
                    >
                      {labels.openTicket}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Compact card list — mobile, and the narrow rail beside an open ticket. */
function TicketCards({
  items,
  selectedId,
  viewerUserId,
  locale,
  labels,
  onOpen,
  alwaysVisible,
}: Props & { alwaysVisible: boolean }) {
  return (
    <ul
      className={`space-y-2 ${alwaysVisible ? "" : "md:hidden"}`}
      aria-label={labels.title}
    >
      {items.map((row) => {
        const selected = selectedId === row.id;
        return (
          <li key={row.id}>
            <button
              type="button"
              onClick={() => onOpen(row.id)}
              aria-current={selected ? "true" : undefined}
              className={`block w-full rounded-xl border p-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--aipify-focus-ring)] ${
                selected
                  ? "border-[color:var(--aipify-companion-purple)] bg-violet-50"
                  : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] hover:bg-[color:var(--aipify-surface-muted)]"
              }`}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="line-clamp-2 text-sm font-semibold text-[color:var(--aipify-text)]">
                  {row.title}
                </span>
                <span className="shrink-0 font-mono text-xs text-[color:var(--aipify-text-secondary)]">
                  {ticketReference(row.id)}
                </span>
              </span>
              <span className="mt-1 block text-xs text-[color:var(--aipify-text-secondary)]">
                {row.company_name || "—"} · {labelFor(labels.channelLabels, row.channel)}
              </span>
              <span className="mt-2 flex flex-wrap items-center gap-2">
                <StatusChip
                  code={row.status}
                  map={labels.statusLabels}
                  tone={statusTone(row.status)}
                />
                <StatusChip
                  code={row.priority}
                  map={labels.priorityLabels}
                  tone={priorityTone(row.priority)}
                />
              </span>
              <span className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[color:var(--aipify-text-secondary)]">
                <span>{assigneeLabelFor(row, viewerUserId, labels)}</span>
                <span>{formatActivity(row.updated_at, locale)}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default function SupportTicketList(props: Props) {
  if (props.selectedId) {
    // Narrow rail next to the open ticket; hidden on small screens so the
    // detail gets the whole viewport (Close returns to the list).
    return (
      <div className="hidden lg:block">
        <TicketCards {...props} alwaysVisible />
      </div>
    );
  }
  return (
    <>
      <TicketTable {...props} />
      <TicketCards {...props} alwaysVisible={false} />
    </>
  );
}
