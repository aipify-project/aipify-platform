"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { IntegrationConnectionStatusBadge } from "@/components/app/integration-setup";
import { IntegrationRemoveDialog } from "@/components/app/app-portal/IntegrationRemoveDialog";
import {
  interpolateIntegrationLabel,
  resolveIntegrationHubActionTier,
  resolveIntegrationProviderDisplayName,
  type AppPortalIntegrationConnection,
  type AppPortalIntegrationProvider,
  type AppPortalIntegrationsLabels,
} from "@/lib/app-portal/integrations";
import { mapConnectionStatusToSemantic, type IntegrationConnectionSemanticStatus } from "@/lib/install/integration-setup";

const STATUS_LABEL_KEYS: Record<IntegrationConnectionSemanticStatus, keyof AppPortalIntegrationsLabels["setup"]["statuses"]> = {
  pending: "pending",
  missing_info: "missingInfo",
  needs_review: "needsReview",
  connected: "connected",
  failed: "failed",
  read_only: "readOnly",
};

type IntegrationConnectionRowProps = {
  connection: AppPortalIntegrationConnection;
  providers: AppPortalIntegrationProvider[];
  labels: AppPortalIntegrationsLabels;
  canManage: boolean;
  onRefresh: () => Promise<void>;
};

export function IntegrationConnectionRow({
  connection,
  providers,
  labels,
  canManage,
  onRefresh,
}: IntegrationConnectionRowProps) {
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [acting, setActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [dialogVariant, setDialogVariant] = useState<"remove" | "disconnect" | null>(null);

  const providerName = resolveIntegrationProviderDisplayName(
    connection.provider_key,
    providers,
    labels.providerNames
  );
  const actionTier = resolveIntegrationHubActionTier(connection);
  const semanticStatus = mapConnectionStatusToSemantic(connection.status, {
    permissionLevel: connection.permission_level,
    hasCredential: Boolean(connection.masked_credential_hint || connection.id),
    lastTestSuccessAt: connection.last_test_success_at,
    lastTestFailedAt: connection.last_test_failed_at,
    lastTestError: connection.last_test_error,
  });
  const statusLabelKey = STATUS_LABEL_KEYS[semanticStatus];
  const statusLabel = labels.setup.statuses[statusLabelKey] ?? connection.status;
  const setupHref = `/app/platform/integrations/connect/${encodeURIComponent(connection.provider_key)}`;

  useEffect(() => {
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [menuOpen]);

  async function retryTest() {
    setActing(true);
    setActionError(null);
    setMenuOpen(false);
    const res = await fetch("/api/app-portal/integrations/test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connection.id }),
    });
    if (!res.ok) {
      setActionError(labels.hub.feedback.testFailed);
    }
    setActing(false);
    await onRefresh();
  }

  async function confirmRemoval() {
    setActing(true);
    setActionError(null);
    const res = await fetch("/api/app-portal/integrations/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ connection_id: connection.id }),
    });
    setDialogVariant(null);
    setActing(false);
    if (!res.ok) {
      setActionError(labels.hub.feedback.removeFailed);
      return;
    }
    await onRefresh();
  }

  const dialogLabels = labels.setup.removeDialog;
  const removeTitle = interpolateIntegrationLabel(labels.hub.removeDialog.title, providerName);
  const removeBody = interpolateIntegrationLabel(labels.hub.removeDialog.body, providerName);
  const disconnectTitle = interpolateIntegrationLabel(labels.hub.disconnectDialog.title, providerName);
  const disconnectBody = interpolateIntegrationLabel(labels.hub.disconnectDialog.body, providerName);

  const menuItems =
    actionTier === "connected"
      ? [
          { key: "manage", href: setupHref, label: labels.hub.actions.manage, onClick: undefined },
          { key: "retryTest", label: labels.hub.actions.retryTest, onClick: () => void retryTest() },
          {
            key: "disconnect",
            label: labels.hub.actions.disconnect,
            onClick: () => {
              setMenuOpen(false);
              setDialogVariant("disconnect");
            },
          },
        ]
      : actionTier === "failed"
        ? [
            { key: "retry", label: labels.hub.actions.retry, onClick: () => void retryTest() },
            { key: "editSetup", href: setupHref, label: labels.hub.actions.editSetup, onClick: undefined },
            {
              key: "removeIntegration",
              label: labels.hub.actions.removeIntegration,
              onClick: () => {
                setMenuOpen(false);
                setDialogVariant("remove");
              },
            },
          ]
        : [
            { key: "continueSetup", href: setupHref, label: labels.hub.actions.continueSetup, onClick: undefined },
            {
              key: "removeIntegration",
              label: labels.hub.actions.removeIntegration,
              onClick: () => {
                setMenuOpen(false);
                setDialogVariant("remove");
              },
            },
          ];

  return (
    <li className="rounded-xl border border-slate-100 px-4 py-3 text-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-900">{providerName}</span>
            <IntegrationConnectionStatusBadge
              status={connection.status}
              label={statusLabel}
              permissionLevel={connection.permission_level}
              hasCredential={Boolean(connection.masked_credential_hint || connection.id)}
              lastTestSuccessAt={connection.last_test_success_at}
              lastTestFailedAt={connection.last_test_failed_at}
              lastTestError={connection.last_test_error}
            />
          </div>
          <p className="mt-1 text-slate-600">
            {connection.permission_level === "read_only"
              ? labels.hub.permissionReadOnly
              : labels.hub.permissionReadWrite}
            {connection.masked_credential_hint ? ` · ${connection.masked_credential_hint}` : ""}
          </p>
          {connection.last_test_success_at ? (
            <p className="mt-1 text-xs text-emerald-700">{labels.hub.lastTestSuccess}</p>
          ) : null}
          {connection.last_test_failed_at ? (
            <p className="mt-1 text-xs text-red-700">{labels.hub.lastTestFailed}</p>
          ) : null}
          {actionError ? (
            <p className="mt-2 text-xs text-red-700" role="alert">
              {actionError}
            </p>
          ) : null}
        </div>

        {canManage ? (
          <div ref={menuRef} className="relative shrink-0">
            <button
              type="button"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-controls={menuId}
              disabled={acting}
              onClick={() => setMenuOpen((open) => !open)}
              className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              {labels.hub.actionsMenuLabel}
            </button>
            {menuOpen ? (
              <ul
                id={menuId}
                role="menu"
                className="absolute right-0 z-10 mt-2 min-w-[12rem] rounded-xl border border-slate-200 bg-white py-1 shadow-lg"
              >
                {menuItems.map((item) => (
                  <li key={item.key} role="none">
                    {item.href ? (
                      <Link
                        href={item.href}
                        role="menuitem"
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        role="menuitem"
                        disabled={acting}
                        onClick={item.onClick}
                        className="block w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                      >
                        {item.label}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>

      {dialogVariant ? (
        <IntegrationRemoveDialog
          variant={dialogVariant}
          title={dialogVariant === "disconnect" ? disconnectTitle : removeTitle}
          body={dialogVariant === "disconnect" ? disconnectBody : removeBody}
          labels={dialogLabels}
          acting={acting}
          onCancel={() => setDialogVariant(null)}
          onConfirm={() => void confirmRemoval()}
        />
      ) : null}
    </li>
  );
}
