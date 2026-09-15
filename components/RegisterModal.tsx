"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { X } from "lucide-react";
import RegisterForm from "./RegisterForm";

type RegisterModalProps = {
  open: boolean;
  onClose: () => void;
  onOpenLogin?: () => void;
};

export default function RegisterModal({
  open,
  onClose,
  onOpenLogin,
}: RegisterModalProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if ((user || accessToken) && open) {
      onClose();
    }
  }, [user, accessToken, open, onClose]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (open) window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open || user || accessToken) return null;

  return (
    <div
      className="fixed inset-0 z-[110] flex items-start justify-center overflow-y-auto bg-black/40 p-3 backdrop-blur-[2px] sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Create an account"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="relative my-3 w-full max-w-md py-5 sm:my-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close registration"
          className="absolute right-3 top-8 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[var(--color-text-secondary)] shadow-md transition hover:text-[var(--color-primary)]"
        >
          <X size={20} />
        </button>
        <RegisterForm onComplete={onClose} onOpenLogin={onOpenLogin} />
      </div>
    </div>
  );
}
