"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AipifyPulse from "@/components/branding/AipifyPulse";
import { AipifyMarketingClasses, AipifyShellClasses } from "@/lib/design/light-enterprise-theme";
import { marketingDataAttr } from "@/lib/marketing/analytics";

export type MarketingNavLabels = {
  product: string;
  modules: string;
  businessPacks: string;
  whyAipify: string;
  customerStories: string;
  pricing: string;
  enterprise: string;
  security: string;
  pilot: string;
  knowledge: string;
  growthPartners: string;
  earlyAccess: string;
  bookDemo: string;
  contact: string;
  controlCenter: string;
  login: string;
  getStarted: string;
};

type MarketingNavbarProps = {
  appName: string;
  labels: MarketingNavLabels;
};

type NavGroup = {
  id: string;
  label: string;
  links: Array<{ label: string; href: string }>;
};

function buildNavGroups(labels: MarketingNavLabels): NavGroup[] {
  return [
    {
      id: "product",
      label: labels.product,
      links: [
        { label: labels.product, href: "/product" },
        { label: labels.modules, href: "/modules" },
        { label: labels.whyAipify, href: "/why-aipify" },
      ],
    },
    {
      id: "packs",
      label: labels.businessPacks,
      links: [
        { label: labels.businessPacks, href: "/pricing#business-packs" },
        { label: labels.pricing, href: "/pricing" },
      ],
    },
    {
      id: "solutions",
      label: labels.enterprise,
      links: [
        { label: labels.enterprise, href: "/enterprise" },
        { label: labels.security, href: "/security" },
        { label: labels.customerStories, href: "/customer-stories" },
        { label: labels.pilot, href: "/pilot" },
      ],
    },
    {
      id: "partners",
      label: labels.growthPartners,
      links: [{ label: labels.growthPartners, href: "/growth-partners" }],
    },
    {
      id: "resources",
      label: labels.knowledge,
      links: [{ label: labels.knowledge, href: "/knowledge" }],
    },
    {
      id: "company",
      label: labels.contact,
      links: [
        { label: labels.contact, href: "/contact" },
        { label: labels.bookDemo, href: "/book-demo" },
      ],
    },
  ];
}

export default function MarketingNavbar({ appName, labels }: MarketingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const groups = buildNavGroups(labels);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header className={AipifyMarketingClasses.header}>
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <AipifyPulse size={32} variant="gradient" title={appName} aria-label={appName} />
          <span className="text-lg font-semibold tracking-tight text-aipify-text">{appName}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {groups.map((group) => (
            <div key={group.id} className="relative">
              <button
                type="button"
                className={`rounded-lg px-3 py-2 ${AipifyMarketingClasses.navLink}`}
                aria-expanded={openGroup === group.id}
                onClick={() => setOpenGroup(openGroup === group.id ? null : group.id)}
                onBlur={() => window.setTimeout(() => setOpenGroup(null), 120)}
              >
                {group.label}
              </button>
              {openGroup === group.id ? (
                <div className="absolute left-0 top-full z-50 mt-1 min-w-[12rem] rounded-xl border border-aipify-border bg-aipify-surface p-2 shadow-lg">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block rounded-lg px-3 py-2 text-sm text-aipify-text-secondary hover:bg-aipify-surface-muted hover:text-aipify-text"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link href="/login" className={`rounded-lg px-3 py-2 ${AipifyMarketingClasses.navLink}`}>
            {labels.login}
          </Link>
          <Link href="/app" className={`rounded-lg px-3 py-2 ${AipifyMarketingClasses.navLink}`}>
            {labels.controlCenter}
          </Link>
          <Link
            href="/early-access"
            className={AipifyMarketingClasses.primaryCta}
            {...marketingDataAttr("cta_click", "nav_get_started")}
          >
            {labels.getStarted}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex rounded-lg p-2 text-aipify-text-secondary lg:hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen ? (
        <div className="border-t border-aipify-border bg-aipify-surface px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group.id}>
                <p className="px-3 text-xs font-semibold uppercase tracking-wide text-aipify-text-muted">{group.label}</p>
                <div className="mt-1 flex flex-col gap-0.5">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg px-3 py-2.5 text-sm font-medium text-aipify-text-secondary hover:bg-aipify-surface-muted"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <hr className="border-aipify-border" />
            <Link href="/login" className={`${AipifyShellClasses.secondaryButton} text-center`} onClick={() => setMenuOpen(false)}>
              {labels.login}
            </Link>
            <Link
              href="/early-access"
              className={`${AipifyMarketingClasses.primaryCta} text-center`}
              onClick={() => setMenuOpen(false)}
            >
              {labels.getStarted}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
