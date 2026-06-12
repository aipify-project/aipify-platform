import { Suspense } from "react";
import { TwoFactorSetupPanel } from "@/components/app/two-factor";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TwoFactorSettingsPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.twoFactor";

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Suspense fallback={<p className="text-sm text-gray-500">{t(`${p}.loading`)}</p>}>
        <TwoFactorSetupPanel
          labels={{
            title: t(`${p}.title`),
            subtitle: t(`${p}.subtitle`),
            requiredNotice: t(`${p}.requiredNotice`),
            statusEnabled: t(`${p}.statusEnabled`),
            statusDisabled: t(`${p}.statusDisabled`),
            enableTitle: t(`${p}.enableTitle`),
            enableStepScan: t(`${p}.enableStepScan`),
            enableStepConfirm: t(`${p}.enableStepConfirm`),
            manualKey: t(`${p}.manualKey`),
            confirmCode: t(`${p}.confirmCode`),
            enable: t(`${p}.enable`),
            disable: t(`${p}.disable`),
            regenerate: t(`${p}.regenerate`),
            recoveryTitle: t(`${p}.recoveryTitle`),
            recoveryNotice: t(`${p}.recoveryNotice`),
            recoveryRemaining: t(`${p}.recoveryRemaining`),
            saveCodes: t(`${p}.saveCodes`),
            loading: t(`${p}.loading`),
            saving: t(`${p}.saving`),
            done: t(`${p}.done`),
            backToSettings: t(`${p}.backToSettings`),
            errors: {
              generic: t(`${p}.errors.generic`),
              invalidCode: t(`${p}.errors.invalidCode`),
              codeRequired: t(`${p}.errors.codeRequired`),
              noPendingEnrollment: t(`${p}.errors.noPendingEnrollment`),
              notEnabled: t(`${p}.errors.notEnabled`),
              requiredByPolicy: t(`${p}.errors.requiredByPolicy`),
              configError: t(`${p}.errors.configError`),
            },
          }}
        />
      </Suspense>
    </div>
  );
}
