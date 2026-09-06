import { io, Socket } from "socket.io-client";

const SOCKET_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  process.env.VITE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  ""
).replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");

let socket: Socket | null = null;
let storeRef: any = null;

export function injectSocketStore(store: any) {
  storeRef = store;
}

function getStoredToken(): string {
  if (storeRef) {
    try {
      return storeRef.getState()?.auth?.accessToken || "";
    } catch {}
  }
  if (typeof window !== "undefined") {
    try {
      const persisted = localStorage.getItem("persist:sfc_root");
      if (persisted) {
        const parsed = JSON.parse(persisted);
        const auth = JSON.parse(parsed.auth || "{}");
        if (auth?.accessToken) return auth.accessToken;
      }
    } catch {}
  }
  return "";
}

export function getSocket(userId?: number | string | null): Socket {
  const token = getStoredToken();

  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      auth: {
        token: token || "",
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[Socket.IO] Frontend connected:", socket?.id);
    });

    socket.on("connect_error", (err) => {
      console.warn("[Socket.IO] Frontend auth/connect error:", err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.IO] Frontend disconnected:", reason);
    });
  } else if (token && (socket.auth as any)?.token !== token) {
    // Token updated, refresh socket auth
    socket.auth = { token };
    if (socket.connected) {
      socket.disconnect().connect();
    }
  }

  return socket;
}

/**
 * Dynamically update the frontend socket auth token on token refresh
 */
export function updateSocketToken(newToken: string) {
  if (socket && newToken) {
    socket.auth = { token: newToken };
    if (socket.connected) {
      socket.disconnect().connect();
    }
  }
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
