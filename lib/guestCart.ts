/**
 * Client-side Guest Cart Manager
 * Persists guest cart items in localStorage and synchronizes real-time state across components.
 */

export interface GuestCartItem {
  productId: number;
  quantity: number;
}

const GUEST_CART_STORAGE_KEY = "sfc_guest_cart";
export const GUEST_CART_EVENT = "sfc_cart_updated";

/**
 * Safely retrieve guest cart items from localStorage
 */
export function getGuestCart(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item: any) => ({
        productId: Number(item.productId || item.id),
        quantity: Math.max(1, Number(item.quantity || item.qty || 1)),
      }))
      .filter((item) => Number.isInteger(item.productId) && item.productId > 0);
  } catch (error) {
    console.error("Failed to parse guest cart from localStorage:", error);
    return [];
  }
}

/**
 * Persist guest cart items and emit custom synchronization event
 */
export function setGuestCart(items: GuestCartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(
      new CustomEvent(GUEST_CART_EVENT, {
        detail: {
          items,
          count: items.length,
          totalQuantity: items.reduce((sum, it) => sum + it.quantity, 0),
        },
      })
    );
  } catch (error) {
    console.error("Failed to save guest cart to localStorage:", error);
  }
}

/**
 * Add a product to the guest cart with stock boundary verification
 */
export function addGuestCartItem(
  productId: number,
  quantity = 1,
  maxStock?: number,
  isMadeToOrder = false
): { success: boolean; message?: string; items: GuestCartItem[] } {
  const cur = getGuestCart();
  const id = Number(productId);
  const qtyToAdd = Math.max(1, Number(quantity) || 1);

  if (!isMadeToOrder && maxStock !== undefined && maxStock <= 0) {
    return { success: false, message: "Product is out of stock", items: cur };
  }

  const existingIndex = cur.findIndex((item) => item.productId === id);
  const currentQty = existingIndex >= 0 ? cur[existingIndex].quantity : 0;
  const requestedTotal = currentQty + qtyToAdd;

  if (!isMadeToOrder && maxStock !== undefined && Number.isFinite(maxStock)) {
    if (currentQty >= maxStock) {
      return {
        success: false,
        message: `Maximum available stock (${maxStock}) already in your cart`,
        items: cur,
      };
    }
    if (requestedTotal > maxStock) {
      return {
        success: false,
        message: `Only ${maxStock} item(s) available. You already have ${currentQty} in cart.`,
        items: cur,
      };
    }
  }

  let next: GuestCartItem[];
  if (existingIndex >= 0) {
    next = cur.map((item, idx) =>
      idx === existingIndex ? { ...item, quantity: requestedTotal } : item
    );
  } else {
    next = [...cur, { productId: id, quantity: qtyToAdd }];
  }

  setGuestCart(next);
  return { success: true, items: next };
}

/**
 * Update the quantity of a product in the guest cart
 */
export function updateGuestCartItemQty(
  productId: number,
  quantity: number,
  maxStock?: number,
  isMadeToOrder = false
): { success: boolean; message?: string; items: GuestCartItem[] } {
  const cur = getGuestCart();
  const id = Number(productId);
  const nextQty = Number(quantity);

  if (nextQty <= 0) {
    const next = cur.filter((item) => item.productId !== id);
    setGuestCart(next);
    return { success: true, message: "Removed from cart", items: next };
  }

  if (!isMadeToOrder && maxStock !== undefined && Number.isFinite(maxStock) && nextQty > maxStock) {
    return {
      success: false,
      message: `Only ${maxStock} item(s) available in stock`,
      items: cur,
    };
  }

  const existing = cur.find((item) => item.productId === id);
  let next: GuestCartItem[];
  if (existing) {
    next = cur.map((item) =>
      item.productId === id ? { ...item, quantity: nextQty } : item
    );
  } else {
    next = [...cur, { productId: id, quantity: nextQty }];
  }

  setGuestCart(next);
  return { success: true, items: next };
}

/**
 * Remove an item from the guest cart
 */
export function removeGuestCartItem(productId: number): GuestCartItem[] {
  const cur = getGuestCart();
  const next = cur.filter((item) => item.productId !== Number(productId));
  setGuestCart(next);
  return next;
}

/**
 * Clear the entire guest cart
 */
export function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
    window.dispatchEvent(
      new CustomEvent(GUEST_CART_EVENT, {
        detail: { items: [], count: 0, totalQuantity: 0 },
      })
    );
  } catch (error) {
    console.error("Failed to clear guest cart:", error);
  }
}

/**
 * Get distinct item types count in guest cart
 */
export function getGuestCartCount(): number {
  return getGuestCart().length;
}

/**
 * Subscribe to guest cart changes across windows and tabs
 */
export function subscribeGuestCart(callback: (items: GuestCartItem[]) => void): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (e: Event) => {
    const custom = e as CustomEvent;
    if (custom.detail?.items) {
      callback(custom.detail.items);
    } else {
      callback(getGuestCart());
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === GUEST_CART_STORAGE_KEY) {
      callback(getGuestCart());
    }
  };

  window.addEventListener(GUEST_CART_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(GUEST_CART_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

