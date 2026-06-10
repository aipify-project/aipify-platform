"use client";

import PresenceIndicator from "@/components/presence/PresenceIndicator";
import { useOptionalPresence } from "@/components/presence/PresenceProvider";

export default function TopbarPresenceSlot() {
  const presence = useOptionalPresence();
  if (!presence) return null;
  return <PresenceIndicator />;
}
