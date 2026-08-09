const KEY = "sfc_cart_v1";

type CartItem = { id: number; qty: number };

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function setCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
  try {
    window.dispatchEvent(new CustomEvent("sfc_cart_updated", { detail: items }));
  } catch (e) {
    // ignore
  }
}

export function addToCart(id: number, qty = 1) {
  const cur = getCart();
  const found = cur.find((c) => c.id === id);
  if (found) {
    const next = cur.map((c) => (c.id === id ? { ...c, qty: c.qty + qty } : c));
    setCart(next);
    return next;
  }
  const next = [...cur, { id, qty }];
  setCart(next);
  return next;
}

export function updateQty(id: number, qty: number) {
  const cur = getCart();
  const next = cur
    .map((c) => (c.id === id ? { ...c, qty } : c))
    .filter((c) => c.qty > 0);
  setCart(next);
  return next;
}

export function clearCart() {
  setCart([]);
}

export default { getCart, setCart, addToCart, updateQty, clearCart };
