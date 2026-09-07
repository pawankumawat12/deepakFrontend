import React from "react";
import type { Metadata } from "next";
import ProductPageClient from "@/components/ProductPageClient";
import { getApiUrl, getSiteUrl, toAssetUrl } from "@/utils/backendUrl";

interface ProductData {
  id: number;
  name: string;
  description?: string | null;
  price?: number | string | null;
  images?: string[] | null;
  category_name?: string | null;
  is_active?: boolean;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return {
      title: "Product Not Found",
      description: "The requested product does not exist.",
    };
  }

  const siteUrl = getSiteUrl();
  const canonicalUrl = `${siteUrl}/product/${productId}`;

  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/products/${productId}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const payload = await res.json();
    const product: ProductData | undefined = payload?.data;

    if (!product || !product.name) {
      return {
        title: "Product Not Found",
        description: "The requested product could not be found.",
      };
    }

    const title = product.name;
    const description =
      product.description?.trim() ||
      `Discover ${product.name} at SFC Bakers. Freshly made with premium ingredients and fast delivery.`;

    let imageUrl = "";
    if (Array.isArray(product.images) && product.images.length > 0 && product.images[0]) {
      imageUrl = toAssetUrl(product.images[0]);
    } else {
      imageUrl = `${siteUrl}/icons/icon-512.png`;
    }

    const categoryName = product.category_name || "Food & Beverages";

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: "SFC Bakers",
        type: "website",
        images: imageUrl
          ? [
              {
                url: imageUrl,
                width: 800,
                height: 800,
                alt: product.name,
              },
            ]
          : [],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
      keywords: [
        product.name,
        categoryName,
        "SFC Bakers",
        "online food ordering",
        "fresh food",
      ].filter(Boolean) as string[],
      other: {
        ...(product.price
          ? {
              "product:price:amount": String(product.price),
              "product:price:currency": "INR",
            }
          : {}),
      },
    };
  } catch (error) {
    console.error("Error generating product metadata:", error);
    return {
      title: "Product Details",
      description: "Explore fresh, delicious food and beverages at SFC Bakers.",
    };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductPageClient id={id} />;
}
