"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import OfflineNetworkScreen from "./OfflineNetworkScreen";

export default function GlobalNetworkWatcher() {
  const [isOffline, setIsOffline] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const lockScroll = () => {
      try {
        document.documentElement.classList.add("offline-active");
        document.body.classList.add("offline-active");
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      } catch {}
    };

    const unlockScroll = () => {
      try {
        document.documentElement.classList.remove("offline-active");
        document.body.classList.remove("offline-active");
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      } catch {}
    };

    // Initial check
    if (typeof window !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
      lockScroll();
    }

    const handleOffline = () => {
      setIsRestored(false);
      setIsOffline(true);
      lockScroll();
    };

    const handleOnline = () => {
      setIsRestored(true);
      // Give the user a brief visual feedback that connection is restored
      setTimeout(() => {
        setIsOffline(false);
        setIsRestored(false);
        unlockScroll();
      }, 1500);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      unlockScroll();
    };
  }, []);

  // Avoid duplicate overlay if the user is explicitly on the standalone /offline page
  if (pathname === "/offline") {
    return null;
  }

  if (!isOffline) {
    return null;
  }

  return (
    <OfflineNetworkScreen
      isStandalonePage={false}
      isRestored={isRestored}
      onRetry={() => {}}
    />
  );
}
