"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useOptionalDashboardProfile } from "@/components/dashboard/DashboardProfileProvider";
import { useOptionalPlatformProfile } from "@/components/platform/PlatformProfileProvider";
import AipifyCommandBar from "./AipifyCommandBar";
import {
  buildRegistryForPortal,
  loadRecentDestinations,
  recordRecentDestination,
  type CommandBarItem,
  type CommandBarLabels,
  type CommandBarNavSource,
  type CommandBarPortal,
  type CommandBarRoleContext,
  type CustomerRole,
  type PlatformRole,
} from "@/lib/command-bar";

type CommandBarProviderProps = {
  portal: CommandBarPortal;
  labels: CommandBarLabels;
  navSources: CommandBarNavSource[];
  customerRole?: CustomerRole;
  platformRole?: PlatformRole;
  children: ReactNode;
};

type CommandBarContextValue = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
};

const CommandBarContext = createContext<CommandBarContextValue | null>(null);

export function useCommandBar(): CommandBarContextValue {
  const value = useContext(CommandBarContext);
  if (!value) {
    throw new Error("useCommandBar must be used within CommandBarProvider");
  }
  return value;
}

export function useOptionalCommandBar(): CommandBarContextValue | null {
  return useContext(CommandBarContext);
}

export default function CommandBarProvider({
  portal,
  labels,
  navSources,
  customerRole,
  platformRole,
  children,
}: CommandBarProviderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState(loadRecentDestinations(portal));
  const customerContext = useOptionalDashboardProfile();
  const platformContext = useOptionalPlatformProfile();

  const resolvedCustomerRole =
    customerRole ??
    (customerContext?.profile?.user.role as CustomerRole | undefined);

  const resolvedPlatformRole =
    platformRole ??
    (platformContext?.platformAdmin?.role as PlatformRole | undefined) ??
    (portal === "super_admin" ? "super_admin" : undefined);

  const roleContext = useMemo<CommandBarRoleContext>(
    () => ({
      portal,
      customerRole: resolvedCustomerRole,
      platformRole: resolvedPlatformRole,
    }),
    [portal, resolvedCustomerRole, resolvedPlatformRole]
  );

  const registry = useMemo<CommandBarItem[]>(
    () => buildRegistryForPortal(portal, labels, navSources),
    [portal, labels, navSources]
  );

  const openBar = useCallback(() => setOpen(true), []);
  const closeBar = useCallback(() => setOpen(false), []);
  const toggleBar = useCallback(() => setOpen((value) => !value), []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        toggleBar();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [toggleBar]);

  useEffect(() => {
    if (!pathname) return;
    const match = registry.find((item) => item.href === pathname);
    if (!match?.href) return;

    recordRecentDestination(portal, {
      id: match.id,
      label: match.label,
      href: match.href,
    });
    setRecent(loadRecentDestinations(portal));
  }, [pathname, portal, registry]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const contextValue = useMemo(
    () => ({
      open: openBar,
      close: closeBar,
      toggle: toggleBar,
      isOpen: open,
    }),
    [openBar, closeBar, toggleBar, open]
  );

  return (
    <CommandBarContext.Provider value={contextValue}>
      {children}
      <AipifyCommandBar
        open={open}
        onClose={closeBar}
        portal={portal}
        labels={labels}
        registry={registry}
        roleContext={roleContext}
        recent={recent}
      />
    </CommandBarContext.Provider>
  );
}
