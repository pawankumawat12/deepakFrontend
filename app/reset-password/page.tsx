"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const router = useRouter();

  useEffect(() => {
    // Password reset links have been migrated to secure OTP flow
    router.replace("/forgot-password");
  }, [router]);

  return null;
}
