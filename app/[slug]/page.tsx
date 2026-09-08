import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CmsPageView from "@/components/CmsPageView";
import { getApiUrl, getSiteUrl } from "@/utils/backendUrl";
import { CmsPage } from "@/redux/services/cmsApi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function fetchCmsPage(slug: string): Promise<CmsPage | null> {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/cms/pages/${encodeURIComponent(slug)}`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      return null;
    }

    const json = await res.json();
    return json?.data || null;
  } catch (error) {
    console.error(`Error fetching CMS page '${slug}':`, error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await fetchCmsPage(slug);

  if (!page) {
    return {
      title: "Page Not Found | SFC Bakers",
      description: "The requested page is unavailable.",
    };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/${slug}`;
  const title = page.seoTitle || `${page.title} | SFC Bakers`;
  const description =
    page.seoDescription ||
    `Read ${page.title} at SFC Bakers. Quality ingredients, fast delivery, and delicious meals.`;

  return {
    title,
    description,
    keywords: page.seoKeywords
      ? page.seoKeywords.split(",").map((k) => k.trim())
      : undefined,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "SFC Bakers",
      type: "article",
    },
  };
}

export default async function DynamicCmsPage({ params }: PageProps) {
  const { slug } = await params;
  const page = await fetchCmsPage(slug);

  if (!page) {
    notFound();
  }

  return <CmsPageView slug={slug} initialData={page} />;
}

