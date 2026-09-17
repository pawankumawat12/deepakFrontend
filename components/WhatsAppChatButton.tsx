"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { X, Send, Sparkles } from "lucide-react";
import { useGetFooterQuery } from "@/redux/services/settingsApi";
import Link from "next/link";

export default function WhatsAppChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const { data: footerResponse } = useGetFooterQuery();
  const footerSettings = footerResponse?.data;

  // Normalize phone number for international WhatsApp wa.me URL
  const rawPhone = footerSettings?.phone_number || "9001981084";
  const digitsOnly = rawPhone.replace(/\D/g, "");
  let whatsappNumber = digitsOnly;
  if (digitsOnly.length === 10) {
    whatsappNumber = `91${digitsOnly}`;
  } else if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    whatsappNumber = `91${digitsOnly.slice(1)}`;
  } else if (!whatsappNumber) {
    whatsappNumber = "919001981084";
  }

  const defaultMessage =
    "Hello SFC Bakers! I would like to inquire about ordering a custom cake / bakery items & flavors.";

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    defaultMessage
  )}`;

  // Gently show a welcome popup after 6 seconds once per session
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const seen = sessionStorage.getItem("sfc_wa_prompt_seen");
        if (!seen) {
          setIsOpen(true);
          setHasPrompted(true);
          sessionStorage.setItem("sfc_wa_prompt_seen", "true");
        }
      } catch {
        // sessionStorage fallback
      }
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  // Close popup if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <aside
      aria-label="WhatsApp customer support chat"
      className="fixed bottom-[calc(76px+env(safe-area-inset-bottom,0px))] right-4 z-[60] flex flex-col items-end print:hidden md:bottom-7 md:right-7"
    >
      {/* Floating Interactive Chat Card */}
      {isOpen && (
        <div
          ref={popupRef}
          role="dialog"
          aria-modal="false"
          aria-label="Chat with SFC Bakers on WhatsApp"
          className="mb-3 w-[min(calc(100vw-32px),320px)] animate-in fade-in slide-in-from-bottom-3 duration-200 rounded-3xl border border-stone-200/80 bg-white p-4 shadow-2xl shadow-emerald-950/15 dark:border-stone-800 dark:bg-stone-900"
        >
          {/* Card Header */}
          <div className="flex items-start justify-between border-b border-stone-100 pb-3 dark:border-stone-800">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[#25D366] text-white shadow-md shadow-emerald-600/30">
                <FaWhatsapp size={22} />
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-400 dark:border-stone-900" />
              </div>
              <div>
                <h4 className="text-sm font-black text-stone-900 dark:text-white">
                  SFC Bakers Support
                </h4>
                
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-stone-800 dark:hover:text-stone-200"
              aria-label="Close WhatsApp chat popup"
            >
              <X size={16} />
            </button>
          </div>

          {/* Chat Bubble Message */}
          <div className="my-3.5 rounded-2xl bg-stone-50 p-3 text-xs leading-relaxed text-stone-700 dark:bg-stone-800/70 dark:text-stone-300">
            <p className="font-semibold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1">
              <span>Hi there!</span>
              <Sparkles size={12} className="text-amber-500" />
            </p>
            <p>
              Looking for a custom cake, party order, or want to customize flavors? Click below to chat directly with our chef on WhatsApp!
            </p>
          </div>

          {/* Action CTA Button */}
          <Link
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-[#20bd5a] hover:shadow-emerald-600/35 active:scale-[0.98]"
            style={{color:"white"}}
         >
            <FaWhatsapp size={18} />
            <span>Chat on WhatsApp</span>
            <Send size={13} className="ml-0.5" />
          </Link>
        </div>
      )}

      {/* Floating Main Circular WhatsApp Button */}
      <div className="relative group">
        {/* Pulsing ring indicator */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366] opacity-30 blur-sm group-hover:opacity-60 transition duration-300 animate-pulse" />

        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-700/30 transition-all duration-300 hover:scale-105 hover:bg-[#20bd5a] active:scale-95"
          aria-label="Open WhatsApp chat"
          title="Chat with SFC Bakers on WhatsApp"
        >
          {isOpen ? (
            <X size={24} className="transition-transform duration-200 rotate-90" />
          ) : (
            <FaWhatsapp size={32} />
          )}

          {/* Small online green badge */}
          {!isOpen && (
            <span className="absolute right-1 top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#25D366] bg-white" />
            </span>
          )}
        </button>

        {/* Desktop hover badge/tooltip when popup is closed */}
        {!isOpen && (
          <div className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-stone-900 px-3 py-1.5 text-xs font-bold text-white opacity-0 shadow-lg transition-all duration-200 group-hover:opacity-100 hidden sm:block">
            Order Custom Cakes on WhatsApp
            <div className="absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-stone-900" />
          </div>
        )}
      </div>
    </aside>
  );
}

