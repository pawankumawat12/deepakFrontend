"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { LoaderCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useGoogleLoginMutation, useLazyGetMeQuery } from "../redux/services/authApi";
import { setCredentials } from "../redux/features/authSlice";
import { useMergeCartMutation } from "../redux/services/cartApi";
import { getGuestCart, clearGuestCart } from "../lib/guestCart";

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          initialize: (config: Record<string, any>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, any>) => void;
          prompt: (notification?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  mode?: "signin" | "signup" | "continue";
  text?: "signin_with" | "signup_with" | "continue_with";
  onSuccess?: () => void;
  onError?: (message: string) => void;
  className?: string;
}

export default function GoogleSignInButton({
  mode = "continue",
  text,
  onSuccess,
  onError,
  className = "",
}: GoogleSignInButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [googleLogin] = useGoogleLoginMutation();
  const [getMe] = useLazyGetMeQuery();
  const [mergeCart] = useMergeCartMutation();
  const dispatch = useDispatch();

  const syncGuestCart = async () => {
    const guestItems = getGuestCart();
    if (guestItems.length === 0) return;
    try {
      const mergeRes = await mergeCart({
        items: guestItems.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      }).unwrap();
      clearGuestCart();
      const report = mergeRes?.data?.mergeReport;
      if (report?.adjustedItems?.length) {
        toast("Some cart items were adjusted to available stock.");
      }
      if (report?.outOfStockItems?.length || report?.skippedInactiveItems?.length) {
        toast("Unavailable items were removed from your cart.");
      }
    } catch {
      // keep guest cart if merge fails
    }
  };

  const handleCredentialResponse = async (response: { credential?: string }) => {
    if (!response?.credential) {
      toast.error("No credential received from Google.");
      return;
    }

    try {
      setIsAuthenticating(true);
      const res = await googleLogin({
        idToken: response.credential,
        credential: response.credential,
      }).unwrap();

      // Access token is held in Redux memory (no localStorage)
      dispatch(setCredentials(res));

      try {
        const me = await getMe().unwrap();
        dispatch(setCredentials(me));
      } catch {
        // me query error shouldn't block login
      }

      await syncGuestCart();

      toast.success(res?.message || "Signed in with Google successfully!");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: unknown) {
      const apiError = err as {
        data?: {
          message?: string;
          isBlocked?: boolean;
          errors?: Record<string, string>;
        };
      };

      const errorMsg =
        apiError.data?.message ||
        (apiError.data?.errors && Object.values(apiError.data.errors)[0]) ||
        "Unable to sign in with Google. Please try again.";

      toast.error(errorMsg);
      if (onError) {
        onError(errorMsg);
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn("NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured");
      return;
    }

    const buttonText =
      text || (mode === "signup" ? "signup_with" : mode === "signin" ? "signin_with" : "continue_with");

    const renderGsiButton = () => {
      if (!window.google?.accounts?.id || !containerRef.current) return;

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        // Google button width must be between 200 and 400
        const containerWidth = containerRef.current.parentElement?.clientWidth || 320;
        const buttonWidth = Math.min(Math.max(containerWidth, 200), 400);

        containerRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(containerRef.current, {
          type: "standard",
          theme: "outline",
          size: "large",
          text: buttonText,
          shape: "rectangular",
          logo_alignment: "center",
          width: buttonWidth,
        });
      } catch (err) {
        console.error("Error rendering Google Sign-In button:", err);
      }
    };

    if (window.google?.accounts?.id) {
      renderGsiButton();
    } else {
      const existingScript = document.getElementById("google-gsi-client");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "google-gsi-client";
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
          renderGsiButton();
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", renderGsiButton);
      }
    }
  }, [mode, text]);

  return (
    <div className={`relative flex w-full flex-col items-center justify-center ${className}`}>
      {isAuthenticating && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary)]">
            <LoaderCircle size={16} className="animate-spin" />
            <span>Verifying with Google...</span>
          </div>
        </div>
      )}
      <div
        ref={containerRef}
        className="flex w-full min-h-[44px] items-center justify-center overflow-hidden rounded-xl"
      />
    </div>
  );
}
