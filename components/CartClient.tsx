"use client";

import React, { useEffect, useMemo, useState } from "react";
import cartStore from "./cart/store";
import data from "./data/products";

export default function CartClient() {
  const [items, setItems] = useState(() => cartStore.getCart());

  useEffect(() => {
    setItems(cartStore.getCart());
  }, []);

  useEffect(() => {
    function onUpdate() {
      setItems(cartStore.getCart());
    }
    window.addEventListener("sfc_cart_updated", onUpdate);
    return () => window.removeEventListener("sfc_cart_updated", onUpdate);
  }, []);

  const enriched = useMemo(() => items.map((it) => ({ ...it, product: data.products.find((p) => p.id === it.id) })), [items]);

  function changeQty(id: number, qty: number) {
    const next = cartStore.updateQty(id, qty);
    setItems(next);
  }

  function clear() {
    cartStore.clearCart();
    setItems([]);
  }

  const total = enriched.reduce((acc, it) => acc + (it.product?.price || 0) * it.qty, 0);

  function formatRupee(v: number) {
    return v % 100 === 0 ? (v / 100).toFixed(0) : (v / 100).toFixed(2);
  }

  if (!items.length)
    return (
      <div className="p-8 text-center">
        <div className="mb-4 text-lg">Your cart is empty</div>
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-xl font-bold">Your Cart</h1>
      <ul className="space-y-4">
        {enriched.map((it) => (
          <li key={it.id} className="flex items-center justify-between gap-4 rounded bg-white p-3 shadow">
            <div className="flex items-center gap-3">
              <img src={it.product?.img} className="h-12 w-12 rounded object-cover" />
              <div>
                <div className="font-medium">{it.product?.name}</div>
                <div className="text-sm text-[var(--color-text-secondary)]">₹{formatRupee(it.product?.price || 0)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => changeQty(it.id, Math.max(0, it.qty - 1))} className="px-2">-</button>
              <div>{it.qty}</div>
              <button onClick={() => changeQty(it.id, it.qty + 1)} className="px-2">+</button>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-[var(--color-text-secondary)]">Total</div>
        <div className="text-lg font-semibold">₹{formatRupee(total)}</div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={clear} className="rounded px-4 py-2">Clear</button>
        <button className="rounded bg-[var(--color-primary)] px-4 py-2 text-white">Checkout</button>
      </div>
    </div>
  );
}
