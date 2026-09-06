import type { MetadataRoute } from "next";
import { getApiUrl, getSiteUrl } from "@/utils/backendUrl";

interface ProductEntry {
  id: number;
  updated_at?: string | null;
  created_at?: string | null;
  is_active?: boolean;
}

interface CategoryEntry {
  id: number;
  updated_at?: string | null;
  created_at?: string | null;
  is_active?: boolean;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  // Core static marketing and information routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/menu`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/offers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/reviews`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms-and-conditions`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/refund-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Fetch active products dynamically
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/products?limit=100&isActive=true`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      let allProducts: ProductEntry[] = Array.isArray(data?.data) ? data.data : [];

      const totalPages = data?.pagination?.totalPages || 1;
      if (totalPages > 1) {
        const remainingPages = Array.from(
          { length: Math.min(totalPages - 1, 9) },
          (_, i) => i + 2
        );

        const pageResponses = await Promise.allSettled(
          remainingPages.map((page) =>
            fetch(`${apiUrl}/products?limit=100&page=${page}&isActive=true`, {
              next: { revalidate: 3600 },
            }).then((r) => (r.ok ? r.json() : null))
          )
        );

        pageResponses.forEach((settled) => {
          if (settled.status === "fulfilled" && settled.value?.data) {
            allProducts = allProducts.concat(settled.value.data);
          }
        });
      }

      productRoutes = allProducts.map((product) => {
        const lastMod = product.updated_at
          ? new Date(product.updated_at)
          : product.created_at
          ? new Date(product.created_at)
          : now;

        return {
          url: `${siteUrl}/product/${product.id}`,
          lastModified: Number.isNaN(lastMod.getTime()) ? now : lastMod,
          changeFrequency: "weekly",
          priority: 0.8,
        };
      });
    }
  } catch (err) {
    console.error("Error generating dynamic product sitemap:", err);
  }

  // Fetch active categories dynamically
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/categories?limit=100&isActive=true`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const categories: CategoryEntry[] = Array.isArray(data?.data) ? data.data : [];

      categoryRoutes = categories.map((category) => {
        const lastMod = category.updated_at
          ? new Date(category.updated_at)
          : category.created_at
          ? new Date(category.created_at)
          : now;

        return {
          url: `${siteUrl}/menu?category=${category.id}`,
          lastModified: Number.isNaN(lastMod.getTime()) ? now : lastMod,
          changeFrequency: "weekly",
          priority: 0.7,
        };
      });
    }
  } catch (err) {
    console.error("Error generating dynamic category sitemap:", err);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}

