import type { Translator } from "@/lib/i18n/translate";

const P = "customerApp.portalStructure.productHubs";

export function hubT(t: Translator, key: string): string {
  return t(`${P}.${key}`);
}

export function hubCommon(t: Translator) {
  return {
    home: hubT(t, "common.home"),
    orgFallback: hubT(t, "common.orgFallback"),
    backToBedrift: hubT(t, "common.backToBedrift"),
    backToAccount: hubT(t, "common.backToAccount"),
    statusReady: hubT(t, "common.statusReady"),
    openWorkspace: hubT(t, "common.openWorkspace"),
  };
}
