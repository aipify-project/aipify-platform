"use client";

import { useRef } from "react";
import {
  CertifiedSalesPartnerExamPanel,
  type CspExamLabels,
} from "@/components/partners-portal/CertifiedSalesPartnerExamPanel";
import {
  CertifiedSalesPartnerLessonsPanel,
  type CspLessonsLabels,
} from "@/components/partners-portal/CertifiedSalesPartnerLessonsPanel";

export function CertifiedSalesPartnerTrainingClient({
  locale,
  lessonsLabels,
  examLabels,
}: {
  locale: string;
  lessonsLabels: CspLessonsLabels;
  examLabels: CspExamLabels;
}) {
  const examRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <CertifiedSalesPartnerLessonsPanel
        labels={lessonsLabels}
        locale={locale}
        onStartExam={() => {
          examRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
      />
      <div ref={examRef} id="csp-certification-exam">
        <CertifiedSalesPartnerExamPanel labels={examLabels} locale={locale} />
      </div>
    </div>
  );
}
