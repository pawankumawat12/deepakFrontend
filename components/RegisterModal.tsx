"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import RegisterForm from "./RegisterForm";

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-[2px] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create an account"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md py-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close registration"
          className="absolute right-3 top-8 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-text-secondary)] shadow-md transition hover:text-[var(--color-primary)]"
        >
          <X size={20} />
        </button>
        <RegisterForm onComplete={onClose} />
      </div>
    </div>
  );
}
