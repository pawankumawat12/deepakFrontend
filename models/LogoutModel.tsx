"use client";

import { Dialog, DialogPanel, DialogTitle, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { LogOut, X } from "lucide-react";

type LogoutModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
};

export default function LogoutModal({
  open,
  onClose,
  onConfirm,
  loading = false,
}: LogoutModalProps) {
  return (
    <Transition show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[100]"
        onClose={() => {
          if (!loading) onClose();
        }}
      >
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        {/* Modal container */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel
              className="
                w-full max-w-sm
                overflow-hidden
                rounded-3xl
                border border-[var(--color-border)]
                bg-white
                shadow-[0_20px_60px_rgba(45,27,15,0.18)]
              "
            >
              {/* Header */}
              <div
                className="
                  flex items-center justify-between
                  border-b border-[var(--color-border)]
                  px-5 py-4
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className="
                      flex h-10 w-10
                      items-center justify-center
                      rounded-xl
                      bg-[var(--color-primary-50)]
                      text-[var(--color-primary)]
                    "
                  >
                    <LogOut size={19} />
                  </div>

                  <DialogTitle
                    className="
                      text-lg font-bold
                      text-[var(--color-text-primary)]
                    "
                  >
                    Logout
                  </DialogTitle>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="
                    flex h-8 w-8
                    items-center justify-center
                    rounded-full
                    text-[var(--color-text-muted)]
                    transition
                    hover:bg-[var(--color-primary-50)]
                    hover:text-[var(--color-primary)]
                    disabled:opacity-50
                  "
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              <div className="px-5 py-6">
                <p
                  className="
                    text-sm leading-6
                    text-[var(--color-text-secondary)]
                  "
                >
                  Are you sure you want to logout from your account?
                </p>
              </div>

              {/* Actions */}
              <div
                className="
                  flex gap-3
                  border-t border-[var(--color-border)]
                  px-5 py-4
                "
              >
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="
                    flex-1
                    rounded-xl
                    border border-[var(--color-border)]
                    bg-white
                    px-4 py-2.5
                    text-sm font-semibold
                    text-[var(--color-text-primary)]
                    transition
                    hover:border-[var(--color-primary)]
                    hover:text-[var(--color-primary)]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={loading}
                  className="
                    flex-1
                    rounded-xl
                    bg-[var(--color-primary)]
                    px-4 py-2.5
                    text-sm font-bold
                    text-white
                    shadow-[0_8px_20px_rgba(79,125,22,0.22)]
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-[var(--color-primary-dark)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
              </div>
            </DialogPanel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}