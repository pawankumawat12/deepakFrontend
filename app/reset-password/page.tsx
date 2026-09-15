"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function ResetPasswordPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);

  useEffect(() => {
    if (user || accessToken) {
      router.replace("/");
    } else {
      // Password reset links have been migrated to secure OTP flow
      router.replace("/forgot-password");
    }
  }, [user, accessToken, router]);

  return null;
}
