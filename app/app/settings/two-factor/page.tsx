import { Suspense } from "react";
import { TwoFactorSetupPanel } from "@/components/app/two-factor";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function TwoFactorSettingsPage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "twoFactor");
  const t = createTranslator(dict);
  const p = "customerApp.twoFactor";

  return (
    <div className="mx-auto max-w-3xl p-6">
      <Suspense fallback={<p className="text-sm text-gray-500">{t(`${p}.loading`)}</p>}>
        <TwoFactorSetupPanel
          labels={{
            title: t(`${p}.title`),
            subtitle: t(`${p}.subtitle`),
            cardDescription: t(`${p}.cardDescription`),
            whyExplanation: t(`${p}.whyExplanation`),
            authenticatorNote: t(`${p}.authenticatorNote`),
            requiredNotice: t(`${p}.requiredNotice`),
            statusEnabled: t(`${p}.statusEnabled`),
            statusDisabled: t(`${p}.statusDisabled`),
            enableTitle: t(`${p}.enableTitle`),
            qrScanLabel: t(`${p}.qrScanLabel`),
            supportedApps: t(`${p}.supportedApps`),
            enableStepScan: t(`${p}.enableStepScan`),
            enableStepConfirm: t(`${p}.enableStepConfirm`),
            manualKey: t(`${p}.manualKey`),
            copyKey: t(`${p}.copyKey`),
            copiedKey: t(`${p}.copiedKey`),
            confirmPassword: t(`${p}.confirmPassword`),
            confirmPasswordHint: t(`${p}.confirmPasswordHint`),
            confirmCode: t(`${p}.confirmCode`),
            codeFromAppTitle: t(`${p}.codeFromAppTitle`),
            codeFromAppBody: t(`${p}.codeFromAppBody`),
            codeFromAppStep1: t(`${p}.codeFromAppStep1`),
            codeFromAppStep2: t(`${p}.codeFromAppStep2`),
            codeFromAppStep3: t(`${p}.codeFromAppStep3`),
            applePasswordsTip: t(`${p}.applePasswordsTip`),
            openInAuthenticator: t(`${p}.openInAuthenticator`),
            googleAuthenticatorHint: t(`${p}.googleAuthenticatorHint`),
            resetEnrollment: t(`${p}.resetEnrollment`),
            invalidCodeHelp: t(`${p}.invalidCodeHelp`),
            enable: t(`${p}.enable`),
            disable: t(`${p}.disable`),
            disablePasswordHint: t(`${p}.disablePasswordHint`),
            regenerate: t(`${p}.regenerate`),
            viewRecoveryCodes: t(`${p}.viewRecoveryCodes`),
            viewRecoveryCodesHint: t(`${p}.viewRecoveryCodesHint`),
            enabledSuccessTitle: t(`${p}.enabledSuccessTitle`),
            enabledSuccessBody: t(`${p}.enabledSuccessBody`),
            enabledDate: t(`${p}.enabledDate`),
            verificationMethod: t(`${p}.verificationMethod`),
            verificationMethodValue: t(`${p}.verificationMethodValue`),
            recoveryCodesStatus: t(`${p}.recoveryCodesStatus`),
            recoveryCodesGenerated: t(`${p}.recoveryCodesGenerated`),
            recoveryCodesNone: t(`${p}.recoveryCodesNone`),
            recoveryTitle: t(`${p}.recoveryTitle`),
            recoveryNotice: t(`${p}.recoveryNotice`),
            recoveryRemaining: t(`${p}.recoveryRemaining`),
            saveCodes: t(`${p}.saveCodes`),
            copyCodes: t(`${p}.copyCodes`),
            downloadCodes: t(`${p}.downloadCodes`),
            printCodes: t(`${p}.printCodes`),
            copiedCodes: t(`${p}.copiedCodes`),
            loading: t(`${p}.loading`),
            saving: t(`${p}.saving`),
            done: t(`${p}.done`),
            backToSettings: t(`${p}.backToSettings`),
            errors: {
              generic: t(`${p}.errors.generic`),
              invalidCode: t(`${p}.errors.invalidCode`),
              invalidPassword: t(`${p}.errors.invalidPassword`),
              passwordRequired: t(`${p}.errors.passwordRequired`),
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
