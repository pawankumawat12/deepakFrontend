"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { WifiOff, RefreshCw, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function GlobalNetworkWatcher() {
  const [isOffline, setIsOffline] = useState(false);
  const [isRestored, setIsRestored] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Initial check on mount
    if (typeof window !== "undefined" && !navigator.onLine) {
      setIsOffline(true);
    }

    const handleOffline = () => {
      setIsRestored(false);
      setIsOffline(true);
    };

    const handleOnline = () => {
      setIsRestored(true);
      setTimeout(() => {
        setIsOffline(false);
        setIsRestored(false);
      }, 2500);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  const checkConnection = async () => {
    if (isChecking) return;
    setIsChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(`/manifest.webmanifest?_t=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok || res.status < 500) {
        setIsRestored(true);
        setTimeout(() => {
          setIsOffline(false);
          setIsRestored(false);
          window.location.reload();
        }, 1200);
      }
    } catch {
      // Still offline
    } finally {
      setIsChecking(false);
    }
  };

  // Do not show floating banner if user is already on the dedicated /offline page
  if (pathname === "/offline" || (!isOffline && !isRestored)) {
    return null;
  }

  return (
    <aside
      aria-live="polite"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9990] w-[94%] max-w-md animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto"
    >
      <div
        className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all ${
          isRestored
            ? "bg-emerald-900/90 text-white border-emerald-500/40"
            : "bg-neutral-900/90 text-white border-amber-500/40"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {isRestored ? (
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <WifiOff size={18} className="text-amber-400 shrink-0" />
          )}

          <div className="min-w-0">
            <p className="text-xs font-bold leading-snug truncate">
              {isRestored
                ? "Connection restored! Syncing..."
                : "Offline Mode — Viewing cached data"}
            </p>
            {!isRestored && (
              <p className="text-[11px] text-white/70 leading-tight">
                Any previously loaded menu and pages remain visible.
              </p>
            )}
          </div>
        </div>

        {!isRestored && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={checkConnection}
              disabled={isChecking}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-white"
              title="Retry connection"
            >
              <RefreshCw
                size={12}
                className={isChecking ? "animate-spin" : ""}
              />
              <span>{isChecking ? "Checking" : "Retry"}</span>
            </button>
            <Link
              href="/offline"
              className="text-[11px] font-semibold text-amber-400 hover:underline px-1 py-1"
            >
              Help
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
