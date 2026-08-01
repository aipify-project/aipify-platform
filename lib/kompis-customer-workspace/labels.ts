const BASE = "customerApp.portalStructure.kompisWorkspace";

export function kompisWorkspaceMessageKeys() {
  return {
    title: `${BASE}.title`,
    reassurance: `${BASE}.reassurance`,
    handoffAuthenticated: `${BASE}.handoff.authenticatedReady`,
    knowledge: `${BASE}.sections.knowledge`,
    suggestions: `${BASE}.sections.suggestions`,
    actions: `${BASE}.sections.actions`,
    confirmation: `${BASE}.sections.confirmation`,
    support: `${BASE}.sections.support`,
    denied: `${BASE}.states.denied`,
    loading: `${BASE}.states.loading`,
    empty: `${BASE}.states.empty`,
    error: `${BASE}.states.error`,
    expired: `${BASE}.states.expired`,
    offline: `${BASE}.states.offline`,
    confirmAction: `${BASE}.actions.confirm`,
    cancelAction: `${BASE}.actions.cancel`,
    continueLater: `${BASE}.actions.continueLater`,
    minimize: `${BASE}.actions.minimize`,
    expand: `${BASE}.actions.expand`,
    whyDenied: `${BASE}.whyDenied`,
    commercialDisabled: `${BASE}.commercialDisabled`,
    emptyFallback: `${BASE}.emptyFallback`,
  };
}

export type KompisWorkspaceLabels = {
  title: string;
  reassurance: string;
  handoffAuthenticated: string;
  knowledge: string;
  suggestions: string;
  actions: string;
  confirmation: string;
  support: string;
  denied: string;
  loading: string;
  empty: string;
  error: string;
  expired: string;
  offline: string;
  confirmAction: string;
  cancelAction: string;
  continueLater: string;
  minimize: string;
  expand: string;
  whyDenied: string;
  commercialDisabled: string;
  emptyFallback: string;
  messageCatalog: Record<string, string>;
};

export function buildKompisWorkspaceLabels(t: (key: string) => string): KompisWorkspaceLabels {
  const keys = kompisWorkspaceMessageKeys();
  const catalog: Record<string, string> = {};
  for (const key of Object.values(keys)) {
    catalog[key] = t(key);
  }
  return {
    title: t(keys.title),
    reassurance: t(keys.reassurance),
    handoffAuthenticated: t(keys.handoffAuthenticated),
    knowledge: t(keys.knowledge),
    suggestions: t(keys.suggestions),
    actions: t(keys.actions),
    confirmation: t(keys.confirmation),
    support: t(keys.support),
    denied: t(keys.denied),
    loading: t(keys.loading),
    empty: t(keys.empty),
    error: t(keys.error),
    expired: t(keys.expired),
    offline: t(keys.offline),
    confirmAction: t(keys.confirmAction),
    cancelAction: t(keys.cancelAction),
    continueLater: t(keys.continueLater),
    minimize: t(keys.minimize),
    expand: t(keys.expand),
    whyDenied: t(keys.whyDenied),
    commercialDisabled: t(keys.commercialDisabled),
    emptyFallback: t(keys.emptyFallback),
    messageCatalog: catalog,
  };
}
