export * from "./base";
export { supportPulseAdapter } from "./supportPulseAdapter";
export { salesPulseAdapter } from "./salesPulseAdapter";
export { operationsPulseAdapter } from "./operationsPulseAdapter";
export { teamPulseAdapter } from "./teamPulseAdapter";
export { customerPulseAdapter } from "./customerPulseAdapter";
export { automationPulseAdapter } from "./automationPulseAdapter";

import { automationPulseAdapter } from "./automationPulseAdapter";
import { customerPulseAdapter } from "./customerPulseAdapter";
import { operationsPulseAdapter } from "./operationsPulseAdapter";
import { salesPulseAdapter } from "./salesPulseAdapter";
import { supportPulseAdapter } from "./supportPulseAdapter";
import { teamPulseAdapter } from "./teamPulseAdapter";
import type { PulseAdapter } from "./base";

export const PULSE_ADAPTERS: PulseAdapter[] = [
  supportPulseAdapter,
  salesPulseAdapter,
  operationsPulseAdapter,
  customerPulseAdapter,
  automationPulseAdapter,
];

export const ENTERPRISE_PULSE_ADAPTERS: PulseAdapter[] = [teamPulseAdapter];
