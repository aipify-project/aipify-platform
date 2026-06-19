"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AipifyLoader } from "@/components/ui/aipify-loader";
import {
  parseSuperAdminRolePermissionOverview,
  type SuperAdminRolePermissionOverview,
} from "@/lib/role-permission-matrix";
import { buildSuperAdminRolePermissionMatrixLabels } from "@/lib/role-permission-matrix/labels";

type Labels = ReturnType<typeof buildSuperAdminRolePermissionMatrixLabels>;

export function SuperAdminRolePermissionMatrixPanel({ labels }: { labels: Labels }) {
  const [overview, setOverview] = useState<SuperAdminRolePermissionOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/super-admin/role-permission-matrix");
    if (res.ok) setOverview(parseSuperAdminRolePermissionOverview(await res.json()));
    else setOverview(null);
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  if (loading) {
    return (
      <div className="flex min-h-[320px] items-center justify-center">
        <AipifyLoader centered />
      </div>
    );
  }

  if (!overview?.found) {
    return <div className="p-6 text-gray-600">Access denied.</div>;
  }

  const catalog = overview.catalog ?? {};
  const adoption = overview.adoption ?? {};

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      <div>
        <Link href="/super/module-registry" className="text-sm text-indigo-600 hover:underline">← {labels.back}</Link>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">{labels.title}</h1>
        <p className="mt-2 text-gray-600">{labels.subtitle}</p>
        {overview.principle ? <p className="mt-2 text-sm font-medium text-violet-800">{overview.principle}</p> : null}
        {overview.privacy_note ? <p className="mt-1 text-xs text-zinc-500">{overview.privacy_note}</p> : null}
        {overview.governance_note ? <p className="mt-2 text-sm text-amber-900">{overview.governance_note}</p> : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.totalPermissions}</p>
          <p className="mt-2 text-2xl font-bold">{String(catalog.total_permissions ?? 0)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.totalModules}</p>
          <p className="mt-2 text-2xl font-bold">{String(catalog.total_modules ?? 0)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.organizations}</p>
          <p className="mt-2 text-2xl font-bold">{String(adoption.organizations_with_grants ?? 0)}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-xs uppercase text-gray-500">{labels.templates}</p>
          <p className="mt-2 text-2xl font-bold">{overview.templates ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
