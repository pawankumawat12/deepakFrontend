import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsPageView from "@/components/CmsPageView";
import { getApiUrl, getSiteUrl } from "@/utils/backendUrl";
import { CmsPage } from "@/redux/services/cmsApi";

const SLUG = "privacy-policy";

async function fetchPageData(): Promise<CmsPage | null> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/cms/pages/${SLUG}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await fetchPageData();
  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${SLUG}`;
  const title = page?.seoTitle || "Privacy Policy | SFC Bakers";
  const description =
    page?.seoDescription ||
    "Read the Privacy Policy of SFC Bakers to understand how we collect, protect, and use your personal information.";

  return {
    title,
    description,
    keywords: page?.seoKeywords?.split(",").map((k) => k.trim()),
    alternates: { canonical: pageUrl },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "SFC Bakers",
      type: "article",
    },
  };
}

export default async function PrivacyPolicyPage() {
  const page = await fetchPageData();
  if (!page) {
    notFound();
  }
  return <CmsPageView slug={SLUG} initialData={page} />;
}
