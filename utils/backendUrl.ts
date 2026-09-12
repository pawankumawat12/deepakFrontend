export const getBackendUrl = (): string => {
  const envUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "") : "") ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_BACKEND_URL) ||
    process.env.VITE_BACKEND_URL ||
    "";

  if (envUrl && envUrl.trim()) {
    return envUrl.trim().replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      return "http://localhost:5000";
    }
    return window.location.origin;
  }

  return "http://localhost:5000";
};

export const getApiUrl = (): string => {
  // In the browser, use same-origin relative path "/api/v1".
  // This routes requests through Next.js rewrites, guaranteeing first-party cookie persistence in mobile PWAs.
  if (typeof window !== "undefined") {
    return "/api/v1";
  }

  const backendUrl = getBackendUrl();
  if (!backendUrl) return "/api/v1";
  return backendUrl.endsWith("/api/v1") ? backendUrl : `${backendUrl}/api/v1`;
};

export const getSiteUrl = (): string => {
  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).trim();
  return siteUrl.replace(/\/+$/, "");
};

export const toAssetUrl = (path?: string | null): string => {
  if (!path || typeof path !== "string") return "";
  const trimmed = path.trim();
  if (!trimmed) return "";

  // Already an absolute URL or data/blob URI
  if (/^https?:\/\//i.test(trimmed) || /^(?:data:|blob:)/i.test(trimmed)) {
    return trimmed;
  }

  // Normalize backslashes from Windows paths
  const normalized = trimmed.replace(/\\/g, "/");

  // Local frontend static assets in /public folder
  if (
    normalized.startsWith("/images/") ||
    normalized.startsWith("/icons/") ||
    normalized.startsWith("/assets/") ||
    normalized.startsWith("images/") ||
    normalized.startsWith("icons/") ||
    normalized.startsWith("assets/")
  ) {
    return normalized.startsWith("/") ? normalized : `/${normalized}`;
  }

  const backend = getBackendUrl();

  // If path already starts with /uploads/ or uploads/
  if (normalized.startsWith("/uploads/") || normalized.startsWith("uploads/")) {
    const clean = normalized.startsWith("/") ? normalized : `/${normalized}`;
    return `${backend}${clean}`;
  }

  // If path is a standalone filename or relative subpath, ensure /uploads/
  const clean = normalized.startsWith("/") ? normalized.slice(1) : normalized;
  return `${backend}/uploads/${clean}`;
};
