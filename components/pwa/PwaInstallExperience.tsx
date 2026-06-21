"use client";

import { AipifyWebAppInstallAction } from "./AipifyWebAppInstallAction";
import { AipifyWebAppInstallModal } from "./AipifyWebAppInstallModal";
import { PwaInstallProvider } from "./PwaInstallProvider";
import type { PwaInstallLabels } from "@/lib/pwa/types";

type PwaInstallExperienceProps = {
  labels: PwaInstallLabels;
  children: React.ReactNode;
};

export function PwaInstallExperience({ labels, children }: PwaInstallExperienceProps) {
  return (
    <PwaInstallProvider>
      {children}
      <AipifyWebAppInstallModal labels={labels} />
    </PwaInstallProvider>
  );
}

export { AipifyWebAppInstallAction };
