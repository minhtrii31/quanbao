"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

type NavigationAction = () => void;

export function useDirtyFormProtection(isDirty: boolean) {
  const router = useRouter();
  const isDirtyRef = useRef(isDirty);
  const [pendingNavigation, setPendingNavigation] = useState<NavigationAction | null>(null);

  useEffect(() => {
    isDirtyRef.current = isDirty;
    if (!isDirty) setPendingNavigation(null);
  }, [isDirty]);

  const requestNavigation = useCallback((action: NavigationAction) => {
    if (isDirtyRef.current) {
      setPendingNavigation(() => action);
      return false;
    }

    action();
    return true;
  }, []);

  const confirmPendingNavigation = useCallback(() => {
    pendingNavigation?.();
    setPendingNavigation(null);
  }, [pendingNavigation]);

  const cancelPendingNavigation = useCallback(() => {
    setPendingNavigation(null);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!isDirtyRef.current || event.defaultPrevented) return;
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>("a[href]");
      if (!link || link.download) return;
      if (link.target && link.target !== "_self") return;

      const href = link.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const url = new URL(link.href);
      if (url.origin !== window.location.origin) return;

      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      const nextPath = `${url.pathname}${url.search}${url.hash}`;
      if (nextPath === currentPath) return;

      event.preventDefault();
      event.stopPropagation();
      requestNavigation(() => {
        router.push(nextPath);
      });
    };

    document.addEventListener("click", handleDocumentClick, true);
    return () => document.removeEventListener("click", handleDocumentClick, true);
  }, [requestNavigation, router]);

  return {
    hasPendingNavigation: Boolean(pendingNavigation),
    requestNavigation,
    confirmPendingNavigation,
    cancelPendingNavigation,
  };
}
