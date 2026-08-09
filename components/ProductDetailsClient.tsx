"use client";

import React, { useEffect, useRef, useState } from "react";
import cartStore from "./cart/store";

export default function ProductDetailsClient({ product }: { product: any }) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState<number>(1);
  const [inCartQty, setInCartQty] = useState<number | null>(null);
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    // reveal after mount
    requestAnimationFrame(() => el.classList.add("revealed"));
  }, []);
  useEffect(() => {
    const cur = cartStore.getCart();
    const found = cur.find((c) => c.id === product.id);
    if (found) setInCartQty(found.qty);
  }, [product.id]);
  function formatRupee(v: number) {
    return v % 100 === 0 ? (v / 100).toFixed(0) : (v / 100).toFixed(2);
  }

  function handleAdd() {
    cartStore.addToCart(product.id, qty);
    setInCartQty((q) => (q || 0) + qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  }

  function changeQty(newQty: number) {
    if (newQty <= 0) {
      cartStore.updateQty(product.id, 0);
      setInCartQty(null);
      return;
    }
    const next = cartStore.updateQty(product.id, newQty);
    const found = next.find((c) => c.id === product.id);
    setInCartQty(found ? found.qty : null);
  }

  return (
    <div className="mx-auto max-w-4xl p-6 animate-fade-up">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <img ref={imgRef} src={product.img} alt={product.name} className="w-full rounded shadow detail-img" />
        </div>
        <div>
          <h1 className="mb-2 text-2xl font-bold">{product.name}</h1>
          <div className="mb-4 text-sm text-[var(--color-text-secondary)]">Category: {product.category}</div>
          <div className="mb-4 text-xl font-semibold">₹{formatRupee(product.price)}</div>
          <p className="mb-6 text-sm">Delicious and freshly prepared at SFC Cafe. Perfect for celebrations and daily treats.</p>
          <div className="flex items-center gap-4">
            {inCartQty ? (
              <div className="flex items-center gap-2">
                <button onClick={() => changeQty(Math.max(0, inCartQty - 1))} className="rounded-full bg-gray-100 px-3 py-1">-</button>
                <div className="px-3">{inCartQty}</div>
                <button onClick={() => changeQty(inCartQty + 1)} className="rounded-full bg-gray-100 px-3 py-1">+</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="rounded-full bg-gray-100 px-3 py-1">-</button>
                  <div className="px-3">{qty}</div>
                  <button onClick={() => setQty(qty + 1)} className="rounded-full bg-gray-100 px-3 py-1">+</button>
                </div>
                <button onClick={handleAdd} className={`rounded-full px-4 py-2 text-white shadow ${added ? "animate-twinkle btn-accent" : "btn-accent"}`}>
                  {added ? "Added" : `Add ${qty}`}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
