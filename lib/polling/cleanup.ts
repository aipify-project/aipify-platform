import { clearPollingBackoff } from "./backoff";
import { clearPollingCache } from "./cache";
import { cancelPendingFetches } from "./dedup";
import { runAllPollingCleanups } from "./registry";

export function clearAllPollingState(): void {
  runAllPollingCleanups();
  cancelPendingFetches();
  clearPollingCache();
  clearPollingBackoff();
}
