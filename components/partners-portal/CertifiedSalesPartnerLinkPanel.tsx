"use client";

import { useMemo, useState, type FormEvent } from "react";
import { CSP_CHANNEL_ORIGINS } from "@/lib/certified-sales-partner/constants";
import { evaluateCspCopyLinkEligibility } from "@/lib/certified-sales-partner/copy-link-eligibility";
import { getLocalizedCspCatalogProducts } from "@/lib/certified-sales-partner/product-catalog-display";
import { resolveCspProductDestination } from "@/lib/certified-sales-partner/attribution-policy";
import {
  CSP_OTHER_SELF_SERVICE_CHANNELS,
  CSP_SOCIAL_PLATFORMS,
  isCspSocialPlatform,
  type CspSocialPlatform,
} from "@/lib/certified-sales-partner/social-share";
import { AipifyStatusBadge } from "@/components/ui/aipify-status-badge";
import { CspSocialPlatformPicker, type CspSocialPickerLabels } from "./CspSocialPlatformPicker";
import { ensureCspSalesLink, useCspSalesLinks, writeClipboard } from "./csp-sales-links-client";
import { useCspPortal } from "./CertifiedSalesPartnerWorkspacePanel";

export type CspLinkLabels = {
  title: string;
  product: string;
  productPlaceholder: string;
  certificationNeeded: string;
  noProducts: string;
  channel: string;
  /** channel id -> translated label (self-service channels only). */
  channels: Record<string, string>;
  submit: string;
  creating: string;
  howItWorks: string;
  failClosed: string;
  error: string;
  /** Template with {url}. */
  success: string;
  copy: string;
  copied: string;
  gatesHint: string;
  productNotYet: string;
  existingTitle: string;
  existingEmpty: string;
  visitsCol: string;
  statusActive: string;
  statusBlocked: string;
  visitsUnknown: string;
  socialSection: string;
  otherChannels: string;
  social: CspSocialPickerLabels;
};

function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? values[key] : match));
}

const OTHER_CHANNELS = CSP_OTHER_SELF_SERVICE_CHANNELS.filter((c) =>
  (CSP_CHANNEL_ORIGINS as readonly string[]).includes(c),
);

/**
 * Sales link creator + existing links. Social platforms use a visual multi-select;
 * other channels use visual chips. Gates are always re-checked server-side.
 */
export function CertifiedSalesPartnerLinkPanel({ labels, locale }: { labels: CspLinkLabels; locale: string }) {
  const portal = useCspPortal();
  const { state: linksState, reload: reloadLinks } = useCspSalesLinks(portal !== null);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [createdUrl, setCreatedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, setPending] = useState(false);
  const [social, setSocial] = useState<CspSocialPlatform[]>([]);
  const [otherChannel, setOtherChannel] = useState<string>("referral_link");
  const [productKey, setProductKey] = useState("");

  const options = useMemo(() => {
    if (!portal) return [];
    const names: Record<string, string> = {};
    for (const p of getLocalizedCspCatalogProducts(locale)) names[p.key] = p.title;
    return portal.overview.products
      .filter((p) => p.productKey !== null && resolveCspProductDestination(p.productKey) !== null)
      .map((p) => {
        const key = p.productKey as string;
        const eligibility = evaluateCspCopyLinkEligibility(portal.overview, key);
        return {
          key,
          title: names[key] ?? key,
          certified: eligibility.allowed,
          reason: eligibility.reason,
        };
      });
  }, [portal, locale]);

  if (!portal) return null;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    setCreatedUrl(null);
    setCopied(false);
    const key = productKey || String(new FormData(e.currentTarget).get("product_id") ?? "");
    const channel =
      social.length > 0 ? social[0] : OTHER_CHANNELS.includes(otherChannel as (typeof OTHER_CHANNELS)[number])
        ? otherChannel
        : "referral_link";
    try {
      const existing = linksState.phase === "ready" ? linksState.links : [];
      const outcome = await ensureCspSalesLink({ productKey: key, channel, existing });
      if (!outcome.ok) {
        const text =
          outcome.reason === "unavailable"
            ? labels.failClosed
            : outcome.reason === "gates"
              ? labels.gatesHint
              : outcome.reason === "not_sellable"
                ? labels.productNotYet
                : labels.error;
        setMessage({ text, ok: false });
        return;
      }
      setCreatedUrl(outcome.url);
      setMessage({ text: fill(labels.success, { url: outcome.url }), ok: true });
      reloadLinks();
      // Create remaining selected social channels (best-effort; first already done).
      for (const platform of social.slice(1)) {
        await ensureCspSalesLink({ productKey: key, channel: platform, existing: [] });
      }
      if (social.length > 1) reloadLinks();
    } catch {
      setMessage({ text: labels.error, ok: false });
    } finally {
      setPending(false);
    }
  }

  async function copy() {
    if (!createdUrl) return;
    setCopied(await writeClipboard(createdUrl));
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6">
      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{labels.existingTitle}</h2>
        {linksState.phase === "unavailable" ? (
          <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">{labels.failClosed}</p>
        ) : null}
        {linksState.phase === "ready" && linksState.links.length === 0 ? (
          <p className="mt-3 text-sm text-[color:var(--aipify-text-secondary)]">{labels.existingEmpty}</p>
        ) : null}
        {linksState.phase === "ready" && linksState.links.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-[color:var(--aipify-text-secondary)]">
                <tr>
                  <th className="px-3 py-2 font-medium">{labels.copy}</th>
                  <th className="px-3 py-2 font-medium">{labels.channel}</th>
                  <th className="px-3 py-2 font-medium">{labels.visitsCol}</th>
                  <th className="px-3 py-2 font-medium">{labels.statusActive}</th>
                </tr>
              </thead>
              <tbody>
                {linksState.links.map((link) => (
                  <tr key={link.code} className="border-t border-[color:var(--aipify-border)]">
                    <td className="px-3 py-2 font-mono">{link.code}</td>
                    <td className="px-3 py-2">
                      {link.channel
                        ? labels.channels[link.channel] ??
                          (isCspSocialPlatform(link.channel)
                            ? labels.social.platforms[link.channel]
                            : link.channel)
                        : "—"}
                    </td>
                    <td className="px-3 py-2">
                      {link.visits == null ? labels.visitsUnknown : link.visits}
                    </td>
                    <td className="px-3 py-2">
                      <AipifyStatusBadge
                        kind={link.active ? "verified" : "needs_attention"}
                        label={link.active ? labels.statusActive : labels.statusBlocked}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] p-6 shadow-sm">
        <h2 className="text-lg font-semibold">{labels.title}</h2>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.howItWorks}</p>
        <p className="mt-2 text-sm text-[color:var(--aipify-text-secondary)]">{labels.gatesHint}</p>
        {options.length === 0 ? (
          <p className="mt-4 text-sm text-[color:var(--aipify-text-secondary)]" role="status">
            {labels.noProducts}
          </p>
        ) : (
          <form className="mt-5 space-y-5" onSubmit={onSubmit}>
            <label className="block max-w-xl text-sm">
              <span className="font-medium">{labels.product}</span>
              <select
                name="product_id"
                required
                value={productKey}
                onChange={(e) => setProductKey(e.target.value)}
                className="mt-1 w-full rounded-xl border border-[color:var(--aipify-border-strong)] bg-[color:var(--aipify-surface)] px-3 py-2"
              >
                <option value="" disabled>
                  {labels.productPlaceholder}
                </option>
                {options.map((o) => (
                  <option key={o.key} value={o.key} disabled={!o.certified}>
                    {o.certified ? o.title : `${o.title} — ${labels.certificationNeeded}`}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <p className="mb-2 text-sm font-medium">{labels.socialSection}</p>
              <CspSocialPlatformPicker labels={labels.social} value={social} onChange={setSocial} />
            </div>

            <fieldset>
              <legend className="text-sm font-medium">{labels.otherChannels}</legend>
              <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {OTHER_CHANNELS.map((channel) => {
                  const selected = social.length === 0 && otherChannel === channel;
                  return (
                    <li key={channel}>
                      <button
                        type="button"
                        aria-pressed={selected}
                        onClick={() => {
                          setSocial([]);
                          setOtherChannel(channel);
                        }}
                        className={`w-full rounded-xl border-2 px-3 py-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--aipify-focus-ring)] ${
                          selected
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                            : "border-[color:var(--aipify-border)] bg-[color:var(--aipify-surface)] text-[color:var(--aipify-text-primary)]"
                        }`}
                      >
                        {labels.channels[channel] ?? channel}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <button
              type="submit"
              disabled={pending || !productKey}
              className="inline-flex w-fit rounded-xl bg-[color:var(--aipify-companion-purple)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? labels.creating : labels.submit}
            </button>
          </form>
        )}
        {message ? (
          <div
            className={`mt-4 rounded-xl border p-3 text-sm ${
              message.ok ? "border-teal-300 bg-teal-50 text-teal-900" : "border-orange-300 bg-orange-50 text-orange-900"
            }`}
            role="status"
          >
            <p className="break-all">{message.text}</p>
            {createdUrl ? (
              <button
                type="button"
                onClick={() => void copy()}
                className="mt-2 text-sm font-semibold text-[color:var(--aipify-companion-purple)]"
              >
                {copied ? labels.copied : labels.copy}
              </button>
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
