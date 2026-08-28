import { useState, useEffect } from "react";

export function useScript(src: string): "idle" | "loading" | "ready" | "error" {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">(
    src ? "loading" : "idle"
  );

  useEffect(() => {
    if (!src) {
      setStatus("idle");
      return;
    }

    let script: HTMLScriptElement | null = document.querySelector(
      `script[src="${src}"]`
    );

    if (script) {
      setStatus(script.getAttribute("data-status") === "ready" ? "ready" : "loading");
    } else {
      script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.setAttribute("data-status", "loading");
      document.body.appendChild(script);

      const setAttributeFromEvent = (event: Event) => {
        script?.setAttribute(
          "data-status",
          event.type === "load" ? "ready" : "error"
        );
      };

      script.addEventListener("load", setAttributeFromEvent);
      script.addEventListener("error", setAttributeFromEvent);
    }

    const setStateFromEvent = (event: Event) => {
      setStatus(event.type === "load" ? "ready" : "error");
    };

    script.addEventListener("load", setStateFromEvent);
    script.addEventListener("error", setStateFromEvent);

    return () => {
      if (script) {
        script.removeEventListener("load", setStateFromEvent);
        script.removeEventListener("error", setStateFromEvent);
      }
    };
  }, [src]);

  return status;
}

