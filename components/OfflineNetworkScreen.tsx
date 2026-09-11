"use client";

import React, { useState } from "react";
import {
  RotateCw,
  WifiOff,
  Signal,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Home,
} from "lucide-react";
import Link from "next/link";

interface OfflineNetworkScreenProps {
  isStandalonePage?: boolean;
  isRestored?: boolean;
  onRetry?: () => void;
}

export default function OfflineNetworkScreen({
  isStandalonePage = false,
  isRestored = false,
  onRetry,
}: OfflineNetworkScreenProps) {
  const [retrying, setRetrying] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  const handleRetry = async () => {
    if (retrying) return;
    setRetrying(true);
    setRetryMessage("Checking network connection...");

    if (onRetry) {
      onRetry();
    }

    try {
      // Test connectivity by making a cache-busted HEAD request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(`/manifest.webmanifest?_t=${Date.now()}`, {
        method: "HEAD",
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok || res.status < 500) {
        setRetryMessage("Connection restored! Reloading...");
        setTimeout(() => {
          window.location.reload();
        }, 600);
        return;
      }
    } catch {
      // Still offline
    }

    setTimeout(() => {
      setRetrying(false);
      setRetryMessage("Still offline. Please check your data or Wi-Fi.");
    }, 1000);
  };

  return (
    <div
      className={`w-full flex flex-col items-center justify-center transition-all duration-300 ${
        isStandalonePage
          ? "min-h-[80vh] py-8 sm:py-12 px-4 bg-white dark:bg-neutral-950"
          : "fixed inset-0 z-[999999] w-screen h-screen h-[100dvh] bg-white dark:bg-neutral-950 overflow-hidden p-4 sm:p-6 select-none"
      }`}
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center text-center">
        {/* Animated Network Tower & Person Illustration */}
        <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[16/9] select-none pointer-events-none mb-2 sm:mb-3">
          <svg
            viewBox="0 0 520 280"
            className="w-full h-full drop-shadow-sm"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Background Ambient Glow */}
              <radialGradient id="towerGlow" cx="20%" cy="30%" r="50%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="phoneGlow" cx="76%" cy="60%" r="40%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-primary, #4f7d16)" stopOpacity="0.25" />
                <stop offset="100%" stopColor="var(--color-primary, #4f7d16)" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="towerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
            </defs>

            {/* Ambient Background Lights */}
            <circle cx="105" cy="80" r="90" fill="url(#towerGlow)" />
            <circle cx="395" cy="170" r="80" fill="url(#phoneGlow)" />

            {/* Subtle Landscape Hills & Ground */}
            <path
              d="M 0 250 Q 120 238 260 248 T 520 250 L 520 280 L 0 280 Z"
              fill="url(#groundGrad)"
            />
            <path
              d="M 30 252 Q 105 244 180 252"
              stroke="var(--color-border, #cbd5e1)"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            <ellipse cx="420" cy="254" rx="42" ry="7" fill="rgba(0,0,0,0.08)" />

            {/* Minimal Background Clouds */}
            <g opacity="0.35" fill="var(--color-text-muted, #94a3b8)">
              <path d="M 220 55 a 12 12 0 0 1 20 -4 a 16 16 0 0 1 28 4 a 12 12 0 0 1 16 12 l -64 0 a 12 12 0 0 1 0 -12 z" />
              <path d="M 340 70 a 10 10 0 0 1 16 -3 a 14 14 0 0 1 24 3 a 10 10 0 0 1 14 10 l -54 0 a 10 10 0 0 1 0 -10 z" />
            </g>

            {/* ================= TELECOM NETWORK TOWER (LEFT) ================= */}
            <g id="telecomTower">
              {/* Tower Legs & Truss Base */}
              <path
                d="M 72 250 L 105 45 L 138 250"
                stroke="url(#towerGrad)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />

              {/* Horizontal Crossbars */}
              <line x1="77" y1="220" x2="133" y2="220" stroke="#64748b" strokeWidth="2.5" />
              <line x1="83" y1="180" x2="127" y2="180" stroke="#64748b" strokeWidth="2.5" />
              <line x1="89" y1="140" x2="121" y2="140" stroke="#64748b" strokeWidth="2" />
              <line x1="95" y1="100" x2="115" y2="100" stroke="#64748b" strokeWidth="2" />
              <line x1="100" y1="68" x2="110" y2="68" stroke="#64748b" strokeWidth="2" />

              {/* Diagonal Lattice Braces */}
              <g stroke="#94a3b8" strokeWidth="1.5" opacity="0.7">
                <line x1="77" y1="220" x2="127" y2="180" />
                <line x1="133" y1="220" x2="83" y2="180" />
                <line x1="83" y1="180" x2="121" y2="140" />
                <line x1="127" y1="180" x2="89" y2="140" />
                <line x1="89" y1="140" x2="115" y2="100" />
                <line x1="121" y1="140" x2="95" y2="100" />
                <line x1="95" y1="100" x2="110" y2="68" />
                <line x1="115" y1="100" x2="100" y2="68" />
              </g>

              {/* Transceiver Dishes */}
              <ellipse cx="92" cy="74" rx="4" ry="9" fill="#475569" transform="rotate(-15 92 74)" />
              <ellipse cx="118" cy="74" rx="4" ry="9" fill="#475569" transform="rotate(15 118 74)" />
              <circle cx="105" cy="55" r="4" fill="#334155" />

              {/* Antenna Spike */}
              <line x1="105" y1="45" x2="105" y2="24" stroke="#d97706" strokeWidth="3" strokeLinecap="round" />

              {/* Pulsing Beacon Light on Top */}
              <circle
                cx="105"
                cy="22"
                r="5"
                fill={isRestored ? "#22c55e" : "#ef4444"}
                className="anim-beacon"
              />
              <circle
                cx="105"
                cy="22"
                r="10"
                fill={isRestored ? "#22c55e" : "#ef4444"}
                opacity="0.3"
                className="anim-beacon"
              />
            </g>

            {/* ================= TRANSMISSION WAVES FROM TOWER ================= */}
            <g id="towerWaves" stroke={isRestored ? "#22c55e" : "#f59e0b"} strokeLinecap="round" fill="none">
              {/* Concentric Signal Arcs towards right */}
              <path
                d="M 125 15 A 35 35 0 0 1 138 55"
                strokeWidth="2.8"
                className="anim-wave-1"
              />
              <path
                d="M 142 8 A 58 58 0 0 1 165 72"
                strokeWidth="2.6"
                className="anim-wave-2"
              />
              <path
                d="M 160 2 A 82 82 0 0 1 192 92"
                strokeWidth="2.2"
                className="anim-wave-3"
              />
            </g>

            {/* Floating Signal Packets searching across distance */}
            <g id="signalPackets">
              <circle r="4" fill={isRestored ? "#22c55e" : "#f59e0b"} className="anim-packet-1" />
              <circle r="3.5" fill={isRestored ? "#4ade80" : "#fbbf24"} className="anim-packet-2" />
            </g>

            {/* Dotted Signal Trajectory */}
            <path
              d="M 105 40 C 200 40, 260 110, 400 170"
              stroke={isRestored ? "#22c55e" : "#f59e0b"}
              strokeWidth="2"
              strokeDasharray="6 8"
              opacity="0.3"
              fill="none"
            />

            {/* ================= GHIBLI CHARACTER & COMPANION (RIGHT) ================= */}
            <g id="ghibliScene" className="anim-person-wait">
              {/* Soft shadow under boots and soot sprite */}
              <ellipse cx="414" cy="254" rx="42" ry="7" fill="rgba(0,0,0,0.12)" />

              {/* Little Ghibli Soot Sprite (Susuwatari) on the grass */}
              <g id="sootSprite" transform="translate(452, 243)">
                {/* Spiky fuzzy fur */}
                <circle cx="0" cy="0" r="9" fill="#1e1e24" />
                <path
                  d="M -7 -6 L -10 -9 M 0 -9 L 0 -13 M 7 -6 L 10 -9 M 9 0 L 13 0 M 7 6 L 10 9 M 0 9 L 0 13 M -7 6 L -10 9 M -9 0 L -13 0"
                  stroke="#1e1e24"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                {/* Big cute round anime eyes */}
                <ellipse cx="-3.5" cy="-1.5" rx="3.5" ry="4" fill="#ffffff" />
                <ellipse cx="3.5" cy="-1.5" rx="3.5" ry="4" fill="#ffffff" />
                {/* Pupils looking up toward tower signals */}
                <g className="anim-soot-eye">
                  <circle cx="-4.5" cy="-2.5" r="1.6" fill="#0f172a" />
                  <circle cx="2.5" cy="-2.5" r="1.6" fill="#0f172a" />
                  {/* Eye sparkle dots */}
                  <circle cx="-5" cy="-3.5" r="0.6" fill="#ffffff" />
                  <circle cx="2" cy="-3.5" r="0.6" fill="#ffffff" />
                </g>
                {/* Tiny twig feet */}
                <line x1="-3" y1="8" x2="-5" y2="11" stroke="#1e1e24" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="3" y1="8" x2="5" y2="11" stroke="#1e1e24" strokeWidth="1.5" strokeLinecap="round" />
              </g>

              {/* Wild grass blades and tiny buttercup flower */}
              <g stroke="#65a30d" strokeWidth="1.8" strokeLinecap="round" fill="none">
                <path d="M 374 252 Q 371 240 365 236" />
                <path d="M 377 252 Q 380 238 385 234" />
                <path d="M 440 252 Q 442 242 447 239" />
              </g>
              {/* Little yellow buttercup flower */}
              <circle cx="365" cy="235" r="3" fill="#facc15" />
              <circle cx="365" cy="235" r="1.2" fill="#d97706" />

              {/* Ghibli Chunky Rounded Leather Boots */}
              {/* Left Boot */}
              <path
                d="M 390 240 L 391 248 Q 391 254 397 254 L 406 254 Q 409 254 409 250 L 407 240 Z"
                fill="#543828"
              />
              <path d="M 391 251 L 409 251 L 408 254 L 392 254 Z" fill="#2d1b11" />
              {/* Right Boot */}
              <path
                d="M 419 240 L 420 248 Q 420 254 426 254 L 436 254 Q 439 254 439 250 L 436 240 Z"
                fill="#543828"
              />
              <path d="M 420 251 L 439 251 L 438 254 L 421 254 Z" fill="#2d1b11" />

              {/* Rolled-up Vintage Trousers */}
              {/* Left Leg with cuff */}
              <path
                d="M 388 198 L 390 241 L 408 241 L 405 198 Z"
                fill="#334155"
              />
              <rect x="389" y="237" width="19" height="5" rx="1.5" fill="#475569" stroke="#1e293b" strokeWidth="0.8" />
              {/* Right Leg with cuff */}
              <path
                d="M 416 198 L 419 241 L 437 241 L 432 198 Z"
                fill="#334155"
              />
              <rect x="418" y="237" width="19" height="5" rx="1.5" fill="#475569" stroke="#1e293b" strokeWidth="0.8" />

              {/* Oversized Cozy Ghibli Knit Sweater */}
              {/* Main sweater body with soft folds */}
              <path
                d="M 380 144 Q 412 134 442 144 Q 448 174 444 204 Q 412 212 382 204 Q 378 174 380 144 Z"
                fill="#d97706"
              />
              {/* Texture shading lines on sweater */}
              <path
                d="M 390 152 Q 402 180 398 204 M 432 152 Q 422 180 426 204"
                stroke="#b45309"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.4"
              />
              {/* Ribbed sweater hem */}
              <path
                d="M 382 202 Q 412 210 444 202 L 443 208 Q 412 216 383 208 Z"
                fill="#b45309"
              />

              {/* Arms holding phone in front */}
              {/* Left sleeve & forearm */}
              <path
                d="M 384 148 Q 374 168 388 178 L 394 174 Q 382 165 390 148 Z"
                fill="#d97706"
              />
              <path
                d="M 388 177 L 396 174 L 401 176 L 394 182 Z"
                fill="#b45309"
              />
              {/* Right sleeve & forearm */}
              <path
                d="M 438 148 Q 436 172 414 180 L 410 174 Q 426 166 430 148 Z"
                fill="#d97706"
              />
              <path
                d="M 414 179 L 407 174 L 403 177 L 411 183 Z"
                fill="#b45309"
              />

              {/* Ghibli Cute Hands cupping the smartphone */}
              <circle cx="395" cy="177" r="4.5" fill="#fed7aa" />
              <circle cx="406" cy="177" r="4.5" fill="#fed7aa" />
              {/* Little soft thumb fingers */}
              <path d="M 393 174 Q 396 171 398 175" stroke="#fbcfe8" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              <path d="M 407 174 Q 404 171 402 175" stroke="#fbcfe8" strokeWidth="1.2" strokeLinecap="round" fill="none" />

              {/* Fluttering Ghibli Scarf around neck */}
              <g className="anim-ghibli-scarf">
                {/* Scarf wrap */}
                <ellipse cx="412" cy="142" rx="14" ry="6" fill="#e11d48" />
                {/* Fluttering scarf tail blowing in breeze towards left */}
                <path
                  d="M 401 143 Q 391 148 384 144 Q 380 152 388 156 Q 398 152 404 145 Z"
                  fill="#be123c"
                />
              </g>

              {/* Ghibli Head with soft rosy anime face */}
              <path
                d="M 396 122 Q 392 138 404 143 Q 418 144 424 133 Q 428 120 416 113 Q 403 113 396 122 Z"
                fill="#fed7aa"
              />
              {/* Soft Rosy Blush on Cheek */}
              <ellipse cx="402" cy="132" rx="4.5" ry="2.8" fill="#f87171" opacity="0.45" />

              {/* Classic Ghibli Anime Eye (Warm, expressive, hopeful) */}
              <g id="ghibliEye">
                {/* Upper curved eyelash */}
                <path d="M 398 123 Q 403 120 408 123" stroke="#2d1b11" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                {/* Warm brown iris & dark pupil */}
                <ellipse cx="403" cy="125" rx="3" ry="3.5" fill="#543828" />
                <circle cx="402.5" cy="125" r="1.8" fill="#1c110a" />
                {/* White catchlight sparkles */}
                <circle cx="401.5" cy="123.5" r="1.1" fill="#ffffff" />
                <circle cx="404" cy="126" r="0.6" fill="#ffffff" />
                {/* Eyebrow curved with curious/hopeful expression */}
                <path d="M 398 118 Q 403 116 408 118" stroke="#3e281b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
              </g>

              {/* Cute button nose & gentle smile */}
              <path d="M 394 127 Q 393 129 395 130" stroke="#f87171" strokeWidth="1" strokeLinecap="round" fill="none" />
              <path d="M 398 136 Q 403 138 406 135" stroke="#991b1b" strokeWidth="1.2" strokeLinecap="round" fill="none" />

              {/* Ear with inner detail */}
              <path d="M 423 126 Q 427 129 423 133" stroke="#fbcfe8" strokeWidth="1.4" strokeLinecap="round" fill="#fed7aa" />

              {/* Fluffy Ghibli Hair (Windblown bangs & organic hair clumps) */}
              <g id="ghibliHair">
                {/* Back hair volume */}
                <path
                  d="M 408 111 Q 425 106 431 118 Q 436 128 430 137 Q 424 133 424 126 Q 422 115 410 112 Z"
                  fill="#3a2216"
                />
                {/* Front bangs and side tufts */}
                <path
                  d="M 394 121 Q 400 108 414 108 Q 428 108 427 116 Q 418 112 408 116 Q 400 119 394 121 Z"
                  fill="#4a2e1d"
                />
                <path
                  d="M 392 122 Q 397 126 399 122 Q 404 116 398 114 Z"
                  fill="#4a2e1d"
                />
                {/* Top whimsical windblown hair flick */}
                <path
                  d="M 412 108 Q 416 102 422 104 Q 418 107 415 109 Z"
                  fill="#5c3a26"
                />
              </g>

              {/* Smartphone held by the Ghibli character */}
              <g transform="translate(393, 158) rotate(-12)">
                <rect
                  x="0"
                  y="0"
                  width="15"
                  height="26"
                  rx="3.5"
                  fill="#1e293b"
                  stroke="#475569"
                  strokeWidth="1"
                />
                {/* Glowing screen casting gentle light */}
                <rect
                  x="1.5"
                  y="2"
                  width="12"
                  height="22"
                  rx="2"
                  fill={isRestored ? "#4ade80" : "#38bdf8"}
                  opacity="0.9"
                />
                {/* Phone screen search dot */}
                <circle cx="7.5" cy="13" r="3" fill="#ffffff" opacity="0.95" />
              </g>

              {/* Phone Radar Pulsing Rings */}
              <circle
                cx="400"
                cy="170"
                r="6"
                stroke={isRestored ? "#22c55e" : "#0284c7"}
                strokeWidth="1.8"
                fill="none"
                className="anim-phone-radar"
              />

              {/* Signal Status Indicator Above Phone */}
              <g transform="translate(382, 128)">
                {isRestored ? (
                  // Full Green Signal Bars
                  <g fill="#22c55e">
                    <rect x="0" y="14" width="3.5" height="5" rx="1.2" />
                    <rect x="5" y="10" width="3.5" height="9" rx="1.2" />
                    <rect x="10" y="6" width="3.5" height="13" rx="1.2" />
                    <rect x="15" y="2" width="3.5" height="17" rx="1.2" />
                  </g>
                ) : (
                  // Searching / Disconnected Signal Bars
                  <g>
                    <rect x="0" y="14" width="3.5" height="5" rx="1.2" fill="#ef4444" />
                    <rect x="5" y="10" width="3.5" height="9" rx="1.2" fill="#ef4444" opacity="0.4" />
                    <rect x="10" y="6" width="3.5" height="13" rx="1.2" fill="#94a3b8" opacity="0.3" />
                    <rect x="15" y="2" width="3.5" height="17" rx="1.2" fill="#94a3b8" opacity="0.2" />
                    {/* Small Red Warning Dot */}
                    <circle cx="25" cy="8" r="3" fill="#ef4444" className="anim-beacon" />
                  </g>
                )}
              </g>
            </g>
          </svg>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase shadow-xs mb-2 border transition-colors duration-300">
          {isRestored ? (
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 size={13} className="text-emerald-500" />
              Internet Connected
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 px-2.5 py-0.5 rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              No Network
            </span>
          )}
        </div>

        {/* Heading & Information */}
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight">
          {isRestored ? "You're Back Online!" : "No Network Connection"}
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-sm leading-relaxed">
          {isRestored
            ? "Your signal has been restored. Reconnecting to SFC Bakers..."
            : "Network tower se signal connect nahi ho pa raha hai. Kripya apna Wi-Fi ya Mobile Data check karein."}
        </p>

        {retryMessage && (
          <div className="mt-2 text-xs font-semibold text-[var(--color-primary)] animate-fade-up">
            {retryMessage}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 w-full max-w-xs">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] active:scale-[0.98] shadow-md shadow-[var(--color-primary)]/20 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-xs sm:text-sm"
          >
            <RotateCw
              size={15}
              className={`transition-transform duration-700 ${
                retrying ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
            {retrying ? "Checking..." : "Retry Now"}
          </button>

          {isStandalonePage && (
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-neutral-800 hover:bg-gray-200 dark:hover:bg-neutral-700 active:scale-[0.98] transition text-xs sm:text-sm"
            >
              <Home size={15} />
              Home
            </Link>
          )}
        </div>

        {/* Troubleshooting Accordion */}
        <div className="mt-3 w-full max-w-xs sm:max-w-sm">
          <button
            onClick={() => setShowTips((prev) => !prev)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-gray-200/80 dark:border-neutral-700/80 bg-white/70 dark:bg-neutral-900/70 text-[11px] font-bold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-neutral-900 transition shadow-xs"
          >
            <span className="flex items-center gap-1.5">
              <HelpCircle size={14} className="text-[var(--color-primary)]" />
              Quick Troubleshooting Tips
            </span>
            {showTips ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showTips && (
            <div className="mt-1.5 p-3 rounded-xl bg-white/95 dark:bg-neutral-900/95 border border-gray-200 dark:border-neutral-700 text-left text-[11px] text-gray-600 dark:text-gray-300 space-y-1.5 animate-fade-up shadow-sm">
              <div className="flex items-start gap-1.5">
                <Signal size={13} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span>Make sure your Wi-Fi or Mobile Data is turned on.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <RotateCw size={13} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span>Try toggling Airplane Mode on for 5 seconds and turn it back off.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <WifiOff size={13} className="text-[var(--color-primary)] shrink-0 mt-0.5" />
                <span>Move to an area with stronger cellular coverage.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

