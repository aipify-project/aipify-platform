import { isoToDateTimeLocal } from "@/lib/website-kompis-faq/safety";

export type FaqPermanentExpiryLabels = {
  permanent: string;
  permanentHelp: string;
  validFrom: string;
  validUntil: string;
};

export function FaqPermanentExpiryFields({
  permanent,
  validFrom,
  validUntil,
  labels,
  onPermanentChange,
  onValidFromChange,
  onValidUntilChange,
}: {
  permanent: boolean;
  validFrom: string | null;
  validUntil: string | null;
  labels: FaqPermanentExpiryLabels;
  onPermanentChange: (permanent: boolean) => void;
  onValidFromChange: (value: string | null) => void;
  onValidUntilChange: (value: string | null) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <label className="flex items-start gap-3 text-sm text-[var(--app-text)]">
        <input
          type="checkbox"
          checked={permanent}
          onChange={(event) => onPermanentChange(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-[var(--app-border)] accent-[#7357e8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
        />
        <span>
          <span className="block font-medium">{labels.permanent}</span>
          <span className="mt-1 block text-xs leading-relaxed text-[var(--app-text-muted)]">
            {labels.permanentHelp}
          </span>
        </span>
      </label>
      {permanent ? null : (
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-[var(--app-text)]">{labels.validFrom}</span>
            <input
              type="datetime-local"
              value={isoToDateTimeLocal(validFrom)}
              onChange={(event) =>
                onValidFromChange(event.target.value ? new Date(event.target.value).toISOString() : null)
              }
              className="w-full rounded-xl border border-[var(--app-border)] bg-white px-3 py-2 text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block font-medium text-[var(--app-text)]">{labels.validUntil}</span>
            <input
              type="datetime-local"
              value={isoToDateTimeLocal(validUntil)}
              onChange={(event) =>
                onValidUntilChange(event.target.value ? new Date(event.target.value).toISOString() : null)
              }
              className="w-full rounded-xl border border-[var(--app-border)] bg-white px-3 py-2 text-[var(--app-text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-focus)]"
            />
          </label>
        </div>
      )}
    </fieldset>
  );
}
