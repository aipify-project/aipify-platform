import type { AdapterResult } from "../types";

export type ExecutionAdapter = {
  type: string;
  preview(payload: Record<string, unknown>): AdapterResult;
  validate(payload: Record<string, unknown>): AdapterResult;
  execute(payload: Record<string, unknown>): AdapterResult;
  rollback?(payload: Record<string, unknown>): AdapterResult;
};

export function mockAdapter(type: string, label: string): ExecutionAdapter {
  return {
    type,
    preview(payload) {
      const target = String(payload.to ?? payload.title ?? "target");
      return { preview: `${label} preview for ${target}`, valid: true };
    },
    validate(payload) {
      if (!payload || typeof payload !== "object") {
        return { preview: "", valid: false, message: "Invalid payload" };
      }
      return { preview: "", valid: true };
    },
    execute(payload) {
      return {
        preview: "",
        valid: true,
        executed: true,
        message: `Mock ${label} executed`,
        rollback: true,
      };
    },
    rollback() {
      return { preview: "", valid: true, executed: true, message: `Mock ${label} rolled back` };
    },
  };
}
