import React from "react";
import ProductDetailsClient from "@/components/ProductDetailsClient";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await fetch(`${apiUrl}/products/${id}`, { cache: "no-store" });

  if (!response.ok) return <div className="p-8">Product not found</div>;

  const { data } = await response.json();
  const assetOrigin = new URL(apiUrl).origin;
  const firstImage = data.images?.[0] || "";
  const image = /^https?:\/\//i.test(firstImage)
    ? firstImage
    : `${assetOrigin}${firstImage.startsWith("/") ? firstImage : `/${firstImage}`}`;

  return <ProductDetailsClient product={{
    ...data,
    id: Number(data.id),
    category: String(data.category_id),
    categoryName: data.category_name || "Menu",
    price: Number(data.price),
    img: image,
  }} />;
}
