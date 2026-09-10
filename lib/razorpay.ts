export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(false);
    }
    if ((window as any).Razorpay) {
      return resolve(true);
    }

    let resolved = false;
    const finish = (result: boolean) => {
      if (!resolved) {
        resolved = true;
        resolve(result);
      }
    };

    const existing = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    ) as HTMLScriptElement | null;
    if (existing) {
      if ((window as any).Razorpay) {
        return finish(true);
      }
      existing.addEventListener("load", () => finish(true), { once: true });
      existing.addEventListener("error", () => finish(false), { once: true });

      const interval = setInterval(() => {
        if ((window as any).Razorpay) {
          clearInterval(interval);
          finish(true);
        }
      }, 100);

      setTimeout(() => {
        clearInterval(interval);
        finish(Boolean((window as any).Razorpay));
      }, 10000);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => finish(true);
    script.onerror = () => finish(false);
    document.body.appendChild(script);

    setTimeout(() => {
      finish(Boolean((window as any).Razorpay));
    }, 10000);
  });
}

