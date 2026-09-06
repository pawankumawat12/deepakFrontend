import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/utils/backendUrl";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/menu",
          "/product/",
          "/offers",
          "/reviews",
          "/about",
          "/contact",
          "/privacy-policy",
          "/privacy",
          "/terms-and-conditions",
          "/terms",
          "/refund-policy",
          "/refund",
        ],
        disallow: [
          "/cart",
          "/checkout",
          "/orders",
          "/profile",
          "/favorites",
          "/notifications",
          "/forgot-password",
          "/reset-password",
          "/api/",
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

