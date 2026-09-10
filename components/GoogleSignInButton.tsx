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
  const [isLoaded, setIsLoaded] = useState(() => {
    return typeof window !== "undefined" && Boolean(window.google?.accounts?.id);
  });
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

      dispatch(setCredentials(res));

      try {
        const me = await getMe().unwrap();
        if (me?.user) {
          dispatch(
            setCredentials({
              ...me,
              token: me.token || me.accessToken || res.token || res.accessToken,
              accessToken: me.accessToken || me.token || res.accessToken || res.token,
            })
          );
        }
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

  const buttonLabel =
    mode === "signup"
      ? "Sign up with Google"
      : mode === "signin"
      ? "Sign in with Google"
      : "Continue with Google";

  const handleManualClick = () => {
    if (isAuthenticating) return;

    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification?.isNotDisplayed?.()) {
            console.warn(
              "Google prompt not displayed:",
              notification.getNotDisplayedReason?.()
            );
          }
        });
      } catch (err) {
        console.warn("Manual Google prompt error:", err);
      }
    } else {
      toast("Loading Google Sign-In, please wait a moment...", { icon: "⏳" });
    }
  };

  useEffect(() => {
    const clientId =
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
      "420858372096-fjfvremm8ft15384onvqnbgmmhr852v4.apps.googleusercontent.com";
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

        const checkMounted = () => {
          if (containerRef.current && containerRef.current.children.length > 0) {
            setIsLoaded(true);
          }
        };

        checkMounted();
        setTimeout(checkMounted, 100);
        setTimeout(checkMounted, 300);
        setTimeout(checkMounted, 600);
      } catch (err) {
        console.error("Error rendering Google Sign-In button:", err);
      }
    };

    let pollInterval: ReturnType<typeof setInterval> | null = null;
    let pollTimeout: ReturnType<typeof setTimeout> | null = null;

    if (window.google?.accounts?.id) {
      renderGsiButton();
    } else {
      pollInterval = setInterval(() => {
        if (window.google?.accounts?.id) {
          if (pollInterval) clearInterval(pollInterval);
          renderGsiButton();
        }
      }, 50);

      pollTimeout = setTimeout(() => {
        if (pollInterval) clearInterval(pollInterval);
      }, 4000);

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

    return () => {
      if (pollInterval) clearInterval(pollInterval);
      if (pollTimeout) clearTimeout(pollTimeout);
    };
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

      {/* 1. Manual Fallback Button (Shown immediately until Google official button mounts) */}
      {!isLoaded && (
        <button
          type="button"
          onClick={handleManualClick}
          disabled={isAuthenticating}
          className="flex h-[44px] w-full max-w-[400px] items-center justify-center gap-3 rounded-xl border border-gray-300 bg-white px-4 text-sm font-medium text-gray-700 shadow-xs hover:bg-gray-50 active:bg-gray-100 transition-colors cursor-pointer"
        >
          <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span className="text-gray-700">{buttonLabel}</span>
        </button>
      )}

      {/* 2. Official Google GIS Button Container */}
      <div
        ref={containerRef}
        className={`flex w-full min-h-[44px] items-center justify-center overflow-hidden rounded-xl transition-opacity duration-200 ${
          !isLoaded
            ? "absolute opacity-0 pointer-events-none -z-10"
            : "relative opacity-100"
        }`}
      />
    </div>
  );
}
