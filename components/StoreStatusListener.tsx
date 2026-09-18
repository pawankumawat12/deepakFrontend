"use client";

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { getSocket } from "@/lib/socket";
import { settingsApi } from "../redux/services/settingsApi";
import { cartApi } from "../redux/services/cartApi";
import { catalogApi } from "../redux/services/catalogApi";
import type { AppDispatch } from "../redux/store";

export default function StoreStatusListener() {
  const dispatch = useDispatch<AppDispatch>();
  const previousStatusRef = useRef<boolean | null>(null);

  useEffect(() => {
    const socket = getSocket();

    const handleStatusChange = (data: {
      is_open?: boolean;
      closed_message?: string;
    }) => {
      if (!data || data.is_open === undefined) return;

      const newIsOpen = Boolean(data.is_open);
      const closedMessage =
        data.closed_message ||
        "Store is currently closed. We are not accepting new orders at this moment.";

      // 1. Immediately update RTK Query cache so all subscribed UI (Navbar, Cart, etc.) update live
      dispatch(
        settingsApi.util.updateQueryData("getStoreStatus", undefined, (draft) => {
          if (draft?.data) {
            draft.data.is_open = newIsOpen;
            if (data.closed_message !== undefined) {
              draft.data.closed_message = data.closed_message;
            }
          } else {
            draft.data = {
              is_open: newIsOpen,
              closed_message: closedMessage,
            };
          }
        })
      );

      // 2. Also trigger a background tag invalidation to ensure full backend consistency
      dispatch(settingsApi.util.invalidateTags(["Settings"]));

      // 3. Show a clear toast alert on transition
      if (previousStatusRef.current !== null && previousStatusRef.current !== newIsOpen) {
        if (!newIsOpen) {
          toast.error(closedMessage, {
            id: "store-status-alert",
            duration: 5000,
          });
        } else {
          toast.success("Store is now OPEN for orders!", {
            id: "store-status-alert",
            duration: 4000,
          });
        }
      }
      previousStatusRef.current = newIsOpen;

      // 4. Dispatch a custom window event for any non-Redux consumers
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sfc_store_status_changed", {
            detail: {
              isOpen: newIsOpen,
              closedMessage: data.closed_message,
            },
          })
        );
      }
    };

    socket.on("store_status_changed", handleStatusChange);

    // Branch status is independent from the global shop toggle. Refresh carts & catalogs so
    // products from a branch that just closed become unavailable immediately across all views.
    const handleBranchStatusChange = (data: {
      storeId?: number | string;
      id?: number | string;
      is_open?: boolean;
      is_active?: boolean;
      store_name?: string;
      deleted?: boolean;
    }) => {
      const targetStoreId = data?.storeId || data?.id;
      if (!targetStoreId) return;

      // Invalidate Cart so item out-of-stock / closure states update immediately
      dispatch(cartApi.util.invalidateTags(["Cart"]));

      // Invalidate Catalog so product menu reflects latest store availability
      dispatch(catalogApi.util.invalidateTags(["Catalog"]));

      // Check if user currently has this store selected
      let currentSelectedStoreId: string | null = null;
      try {
        currentSelectedStoreId = localStorage.getItem("sfc_selected_store_id");
      } catch {}

      if (currentSelectedStoreId && String(currentSelectedStoreId) === String(targetStoreId)) {
        if (data.deleted) {
          try {
            localStorage.removeItem("sfc_selected_store_id");
          } catch {}
          toast.error(`The store you were browsing has been removed. Switched to main menu.`, {
            id: `branch-status-${targetStoreId}`,
            duration: 6000,
          });
        } else if (data.is_active === false) {
          toast.error(`"${data.store_name || "Store"}" is currently inactive.`, {
            id: `branch-status-${targetStoreId}`,
            duration: 5000,
          });
        } else if (data.is_open === false) {
          toast.error(`"${data.store_name || "Store"}" is currently closed for orders.`, {
            id: `branch-status-${targetStoreId}`,
            duration: 5000,
          });
        } else if (data.is_open === true) {
          toast.success(`"${data.store_name || "Store"}" is now OPEN for orders!`, {
            id: `branch-status-${targetStoreId}`,
            duration: 4000,
          });
        }
      }

      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("sfc_branch_status_changed", {
            detail: {
              storeId: Number(targetStoreId),
              isOpen: data.is_open !== false,
              isActive: data.is_active !== false,
              isDeleted: Boolean(data.deleted),
              storeName: data.store_name || "Store",
            },
          })
        );
      }
    };
    socket.on("branch_status_changed", handleBranchStatusChange);

    // When socket reconnects, re-fetch settings to guarantee latest state
    const handleConnect = () => {
      dispatch(settingsApi.util.invalidateTags(["Settings"]));
    };
    socket.on("connect", handleConnect);

    // Revalidate when user returns to the tab
    const handleVisibilityChange = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        dispatch(settingsApi.util.invalidateTags(["Settings"]));
      }
    };
    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", handleVisibilityChange);
    }

    return () => {
      socket.off("store_status_changed", handleStatusChange);
      socket.off("branch_status_changed", handleBranchStatusChange);
      socket.off("connect", handleConnect);
      if (typeof document !== "undefined") {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
      }
    };
  }, [dispatch]);

  return null;
}
