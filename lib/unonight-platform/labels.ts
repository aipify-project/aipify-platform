import type { Translator } from "@/lib/i18n/translate";

const NS = "unonightAdmin.aipifyConnection";

export function buildUnonightAipifyConnectionLabels(t: Translator) {
  return {
    title: t(`${NS}.title`),
    subtitle: t(`${NS}.subtitle`),
    eyebrow: t(`${NS}.eyebrow`),
    loading: t(`${NS}.loading`),
    help: {
      title: t(`${NS}.help.title`),
      what: t(`${NS}.help.what`),
      reads: t(`${NS}.help.reads`),
      notSupabase: t(`${NS}.help.notSupabase`),
      revoke: t(`${NS}.help.revoke`),
      connect: t(`${NS}.help.connect`),
    },
    scopes: {
      title: t(`${NS}.scopes.title`),
      metadataRead: t(`${NS}.scopes.metadataRead`),
      organizationRead: t(`${NS}.scopes.organizationRead`),
      integrationStatusRead: t(`${NS}.scopes.integrationStatusRead`),
    },
    form: {
      nameLabel: t(`${NS}.form.nameLabel`),
      namePlaceholder: t(`${NS}.form.namePlaceholder`),
      create: t(`${NS}.form.create`),
      creating: t(`${NS}.form.creating`),
    },
    reveal: {
      title: t(`${NS}.reveal.title`),
      warning: t(`${NS}.reveal.warning`),
      copy: t(`${NS}.reveal.copy`),
      copied: t(`${NS}.reveal.copied`),
      dismiss: t(`${NS}.reveal.dismiss`),
    },
    table: {
      name: t(`${NS}.table.name`),
      scopes: t(`${NS}.table.scopes`),
      status: t(`${NS}.table.status`),
      lastUsed: t(`${NS}.table.lastUsed`),
      created: t(`${NS}.table.created`),
      actions: t(`${NS}.table.actions`),
      empty: t(`${NS}.table.empty`),
      never: t(`${NS}.table.never`),
    },
    status: {
      active: t(`${NS}.status.active`),
      revoked: t(`${NS}.status.revoked`),
      rotated: t(`${NS}.status.rotated`),
    },
    actions: {
      revoke: t(`${NS}.actions.revoke`),
      rotate: t(`${NS}.actions.rotate`),
      revoking: t(`${NS}.actions.revoking`),
      rotating: t(`${NS}.actions.rotating`),
    },
    errors: {
      generic: t(`${NS}.errors.generic`),
      unauthorized: t(`${NS}.errors.unauthorized`),
    },
    shell: {
      portalBadge: t(`${NS}.shell.portalBadge`),
      portalTitle: t(`${NS}.shell.portalTitle`),
      signOut: t("auth.logout.signOut"),
    },
  };
}

export type UnonightAipifyConnectionLabels = ReturnType<typeof buildUnonightAipifyConnectionLabels>;
