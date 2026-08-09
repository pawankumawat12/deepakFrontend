import React from "react";
import data from "@/components/data/products";
import ProductDetailsClient from "@/components/ProductDetailsClient";

export default async function ProductPage({ params }: { params: any }) {
  const resolved = await params;
  const id = Number(resolved.id);
  const product = data.products.find((p) => p.id === id);

  if (!product) return <div className="p-8">Product not found</div>;

  return <ProductDetailsClient product={product} />;
}
