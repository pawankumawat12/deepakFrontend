"use client";

import React, { useState } from "react";
import { Download, Smartphone, Share, Plus, CheckCircle2 } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";

type PWAInstallButtonProps = {
  variant?: "footer" | "compact";
};

export default function PWAInstallButton({
  variant = "footer",
}: PWAInstallButtonProps) {
  const { canInstall, showIOSGuide, isInstalled, isStandalone, install, openApp } =
    usePWAInstall();
  const [installing, setInstalling] = useState(false);
  const [showIOSSteps, setShowIOSSteps] = useState(false);

  if (isStandalone) {
    return (
      <div
        className={
          variant === "footer"
            ? "inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white/80"
            : "inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)]"
        }
      >
        <CheckCircle2 size={18} className="text-[var(--color-primary-light)]" />
        App installed
      </div>
    );
  }

  if (isInstalled) {
    return (
      <button
        type="button"
        onClick={openApp}
        className={
          variant === "footer"
            ? "inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(79,125,22,0.35)] transition hover:bg-[var(--color-primary-dark)] active:scale-[0.98] sm:w-auto"
            : "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
        }
      >
        <Smartphone size={18} />
        Open App
      </button>
    );
  }

  const handleInstall = async () => {
    if (showIOSGuide) {
      setShowIOSSteps((open) => !open);
      return;
    }

    if (!canInstall) return;

    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  const buttonClass =
    variant === "footer"
      ? "inline-flex w-full items-center justify-center gap-2.5 rounded-2xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white shadow-[0_10px_30px_rgba(79,125,22,0.35)] transition hover:bg-[var(--color-primary-dark)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      : "inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--color-primary-dark)]";

  return (
    <div className="w-full sm:w-auto">
      <button
        type="button"
        onClick={handleInstall}
        disabled={!canInstall && !showIOSGuide}
        className={buttonClass}
      >
        {canInstall || showIOSGuide ? (
          <>
            <Download size={18} />
            {installing ? "Installing..." : "Install App"}
          </>
        ) : (
          <>
            <Smartphone size={18} />
            Install on supported browser
          </>
        )}
      </button>

      {showIOSGuide && showIOSSteps && (
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">
            Add to Home Screen
          </p>
          <ol className="mt-3 space-y-2.5 text-sm text-white/60">
            <li className="flex items-start gap-2.5">
              <Share size={16} className="mt-0.5 shrink-0 text-[var(--color-primary-light)]" />
              Tap the Share button in Safari
            </li>
            <li className="flex items-start gap-2.5">
              <Plus size={16} className="mt-0.5 shrink-0 text-[var(--color-primary-light)]" />
              Select &quot;Add to Home Screen&quot;
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-[var(--color-primary-light)]" />
              Open SFC Cafe like a native app
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
