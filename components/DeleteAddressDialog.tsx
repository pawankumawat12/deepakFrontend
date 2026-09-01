"use client";

import React from "react";
import { Trash2, AlertTriangle, LoaderCircle } from "lucide-react";
import { Address, useDeleteAddressMutation } from "@/redux/services/addressApi";
import toast from "react-hot-toast";

interface DeleteAddressDialogProps {
  open: boolean;
  onClose: () => void;
  address: Address | null;
  onDeleted?: (deletedId: number) => void;
}

export default function DeleteAddressDialog({
  open,
  onClose,
  address,
  onDeleted,
}: DeleteAddressDialogProps) {
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();

  if (!open || !address) return null;

  const handleDelete = async () => {
    try {
      await deleteAddress(address.id).unwrap();
      toast.success("Address deleted successfully");
      if (onDeleted) {
        onDeleted(address.id);
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete address");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white p-6 shadow-2xl transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-inner">
          <Trash2 size={26} />
        </div>

        <div className="mt-4 text-center">
          <h3 className="text-base font-black text-[var(--color-text-primary)]">
            Delete this address?
          </h3>
          <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
            Are you sure you want to delete <span className="font-bold text-[var(--color-text-primary)]">"{address.label}"</span> address?
          </p>

          <div className="mt-3 rounded-xl border border-[var(--color-border)] bg-stone-50/70 p-3 text-left">
            <p className="text-xs font-bold text-[var(--color-text-primary)]">
              {address.receiver_name} • {address.phone_number}
            </p>
            <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)] line-clamp-2">
              {address.house_number}, {address.building_name ? `${address.building_name}, ` : ""}
              {address.formatted_address || `${address.city} - ${address.pincode}`}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 rounded-xl border border-[var(--color-border)] bg-white py-3 text-xs font-bold text-[var(--color-text-secondary)] transition hover:bg-stone-50 active:scale-[0.98] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-600 py-3 text-xs font-bold text-white shadow-md shadow-red-500/20 transition hover:bg-red-700 active:scale-[0.98] disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <LoaderCircle size={14} className="animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 size={14} />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

