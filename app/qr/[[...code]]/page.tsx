import { redirect } from "next/navigation";
import { getBackendUrl } from "@/utils/backendUrl";

export const dynamic = "force-dynamic";

export default async function QrRedirectPage() {
  let targetUrl = "/";

  try {
    const backendUrl = getBackendUrl();
    const res = await fetch(`${backendUrl}/api/v1/qr-destination`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.target_url) {
        targetUrl = data.target_url;
      } else if (data?.destination_url) {
        targetUrl = data.destination_url;
      }
    }
  } catch (error: any) {
    // Next.js redirect throws an internal error that must be re-thrown
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Failed to fetch dynamic QR destination:", error);
  }

  redirect(targetUrl);
}

