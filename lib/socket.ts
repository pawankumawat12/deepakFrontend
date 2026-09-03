import { io, Socket } from "socket.io-client";

const SOCKET_URL = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  process.env.VITE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  ""
).replace(/\/api\/v1\/?$/, "").replace(/\/+$/, "");

let socket: Socket | null = null;

export function getSocket(userId?: number | string | null): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      query: {
        userId: userId || "",
        role: "customer",
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      console.log("[Socket.IO] Frontend connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.IO] Frontend disconnected:", reason);
    });
  } else if (userId && (!socket.io.opts.query || (socket.io.opts.query as any).userId !== String(userId))) {
    socket.io.opts.query = {
      userId: String(userId),
      role: "customer",
    };
    if (socket.connected) {
      socket.disconnect().connect();
    }
  }

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

