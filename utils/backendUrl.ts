export const getBackendUrl = (): string => {
  const url = (
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
    process.env.VITE_BACKEND_URL ||
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
    ""
  ).trim();
  return url.replace(/\/+$/, "");
};

export const getApiUrl = (): string => {
  const backendUrl = getBackendUrl();
  if (!backendUrl) return "/api/v1";
  return backendUrl.endsWith("/api/v1") ? backendUrl : `${backendUrl}/api/v1`;
};

export const getSiteUrl = (): string => {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000"
  ).trim();
  return siteUrl.replace(/\/+$/, "");
};

export const toAssetUrl = (path?: string | null): string => {
  if (!path || /^https?:\/\//i.test(path) || /^(?:data:|blob:)/i.test(path)) {
    return path || "";
  }
  const backend = getBackendUrl();
  if (!backend) {
    const site = getSiteUrl();
    return `${site}${path.startsWith("/") ? path : `/${path}`}`;
  }
  return `${backend}${path.startsWith("/") ? path : `/${path}`}`;
};
