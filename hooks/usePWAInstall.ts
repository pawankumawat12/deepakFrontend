"use client";

import { useCallback, useEffect, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true ||
      document.referrer.includes("android-app://") ||
      new URLSearchParams(window.location.search).get("source") === "pwa";

    setIsStandalone(standalone);

    let wasPreviouslyInstalled = false;
    try {
      wasPreviouslyInstalled =
        localStorage.getItem("sfc_pwa_installed") === "true";
    } catch {}

    if (standalone) {
      setIsInstalled(true);
      try {
        localStorage.setItem("sfc_pwa_installed", "true");
      } catch {}
    } else if (wasPreviouslyInstalled) {
      setIsInstalled(true);
    }

    // Check device platform
    const ua = navigator.userAgent || "";
    const ios =
      /iPad|iPhone|iPod/.test(ua) &&
      !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    // Modern browser check: getInstalledRelatedApps
    if ("getInstalledRelatedApps" in navigator) {
      (navigator as any)
        .getInstalledRelatedApps()
        .then((apps: any[]) => {
          if (Array.isArray(apps) && apps.length > 0) {
            setIsInstalled(true);
            try {
              localStorage.setItem("sfc_pwa_installed", "true");
            } catch {}
          }
        })
        .catch(() => {});
    }

    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      // If browser fires beforeinstallprompt, app is not installed yet
      setIsInstalled(false);
      try {
        localStorage.removeItem("sfc_pwa_installed");
      } catch {}
    };

    const onAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem("sfc_pwa_installed", "true");
      } catch {}
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);
    setIsReady(true);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);

      if (outcome === "accepted") {
        setIsInstalled(true);
        try {
          localStorage.setItem("sfc_pwa_installed", "true");
        } catch {}
        return true;
      }
    } catch (err) {
      console.error("PWA install error:", err);
    }

    return false;
  }, [deferredPrompt]);

  const openApp = useCallback(() => {
    if (typeof window !== "undefined") {
      // Navigate with pwa source so browsers supporting launch_handler or web app links open the standalone window
      window.location.href = `${window.location.origin}/?source=pwa`;
    }
  }, []);

  return {
    canInstall: Boolean(deferredPrompt) && !isInstalled && !isStandalone,
    showIOSGuide: isIOS && !isStandalone && !isInstalled,
    isInstalled,
    isStandalone,
    isIOS,
    isReady,
    deferredPrompt,
    install,
    openApp,
  };
}
