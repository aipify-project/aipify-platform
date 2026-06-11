export * from "./types";
export * from "./parse";

export const SIMULATION_LAB_MODULE_PATH = "aipify-core/simulation-lab";
export const SIMULATION_LAB_PHILOSOPHY =
  "Simulation Engine predicts. Simulation Engine never acts.";
export const SIMULATION_LAB_SAFETY_NOTE =
  "Simulations never modify production data, trigger automations, send notifications, or bypass Governance.";

export const SCENARIO_BUILDER_STEPS = [
  "Current State",
  "Proposed Change",
  "Constraints",
  "Objectives",
  "Comparison Options",
] as const;
