import React, { useMemo } from "react";

interface CmsContentRendererProps {
  content: string;
  className?: string;
}

/**
 * Sanitizes HTML to strip dangerous tags and executable attributes (XSS prevention)
 */
function sanitizeHtml(rawHtml: string): string {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  let cleaned = rawHtml;

  // 1. Remove dangerous executable tags
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "");
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "");
  cleaned = cleaned.replace(/<applet\b[^<]*(?:(?!<\/applet>)<[^<]*)*<\/applet>/gi, "");

  // 2. Remove inline event handlers (onclick, onerror, onload, etc.)
  cleaned = cleaned.replace(/(\s+on[a-zA-Z]+\s*=\s*["'][^"']*["'])|(\s+on[a-zA-Z]+\s*=\s*[^"'\s>]+)/gi, "");

  // 3. Remove javascript: or vbscript: URLs in href or src
  cleaned = cleaned.replace(/(href|src)\s*=\s*["']\s*(?:javascript|vbscript|data):[^"']*["']/gi, '$1="#"');

  return cleaned;
}

export default function CmsContentRenderer({ content, className = "" }: CmsContentRendererProps) {
  const safeHtml = useMemo(() => sanitizeHtml(content), [content]);

  return (
    <div
      className={`cms-content prose prose-neutral max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

