import { logCompanionWorkerEvent } from "./worker-log";

export type CompanionWorkerStepTimings = {
  enqueueToClaimMs?: number;
  bootstrapMs?: number;
  routingMs?: number;
  responseBuildMs?: number;
  messageWriteMs?: number;
  totalMs?: number;
};

export function logCompanionWorkerStepTimings(
  queueId: string | undefined,
  tenantId: string | undefined,
  timings: CompanionWorkerStepTimings,
): void {
  logCompanionWorkerEvent("step_timing", {
    queueId,
    tenantId,
    ...timings,
  });
}
