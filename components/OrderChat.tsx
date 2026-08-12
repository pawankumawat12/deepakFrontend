"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  CheckCheck,
  MessageCircle,
  MoreVertical,
  Send,
  User,
  X,
} from "lucide-react";

interface OrderChatProps {
  open: boolean;
  orderId: string;
  onClose: () => void;
}

type Message = {
  id: number;
  sender: "customer" | "owner";
  text: string;
  time: string;
  read?: boolean;
};

export default function OrderChat({
  open,
  orderId,
  onClose,
}: OrderChatProps) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "owner",
      text: "Hi! 👋 Thanks for ordering from SFC Cafe.",
      time: "7:36 PM",
    },
    {
      id: 2,
      sender: "owner",
      text: "Your order is being prepared. Is there anything we can help you with?",
      time: "7:36 PM",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  function sendMessage() {
    const trimmed = message.trim();

    if (!trimmed) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "customer",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      read: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");

    // UI demo owner reply
    window.setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "owner",
          text: "Sure! We’ll check that for you. 😊",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1000);
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  }

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-end justify-center
        bg-black/40
        backdrop-blur-[2px]
        sm:items-center
        sm:p-5
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="
          flex
          h-[85vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[2rem]
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.25)]
          sm:h-[650px]
          sm:max-w-[430px]
          sm:rounded-[2rem]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-[var(--color-border)]
            bg-white
            px-5
            py-4
          "
        >
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary)]
                text-white
              "
            >
              <MessageCircle size={21} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                  SFC Cafe
                </h2>

                <span className="h-2 w-2 rounded-full bg-green-500" />
              </div>

              <p className="mt-0.5 text-[10px] text-[var(--color-text-muted)]">
                Order #{orderId}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[var(--color-text-muted)]
                transition
                hover:bg-[var(--color-primary-50)]
                hover:text-[var(--color-primary)]
              "
            >
              <MoreVertical size={18} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                text-[var(--color-text-muted)]
                transition
                hover:bg-red-50
                hover:text-red-500
              "
              aria-label="Close chat"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* ORDER INFO */}

        <div
          className="
            border-b
            border-[var(--color-border)]
            bg-[var(--color-primary-50)]
            px-5
            py-3
          "
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                Chatting about
              </p>

              <p className="mt-1 text-xs font-black text-[var(--color-text-primary)]">
                Order #{orderId}
              </p>
            </div>

            <span
              className="
                rounded-full
                bg-orange-50
                px-3
                py-1.5
                text-[9px]
                font-bold
                text-orange-600
              "
            >
              Preparing
            </span>
          </div>
        </div>

        {/* MESSAGES */}

        <div
          className="
            flex-1
            overflow-y-auto
            bg-[#fafaf8]
            px-4
            py-5
            sm:px-5
          "
        >
          <div className="mb-5 text-center">
            <span
              className="
                rounded-full
                bg-white
                px-3
                py-1.5
                text-[9px]
                font-semibold
                text-[var(--color-text-muted)]
                shadow-sm
              "
            >
              Today
            </span>
          </div>

          <div className="space-y-3">
            {messages.map((item) => {
              const isCustomer = item.sender === "customer";

              return (
                <div
                  key={item.id}
                  className={`flex ${
                    isCustomer
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      flex
                      max-w-[82%]
                      gap-2
                      ${
                        isCustomer
                          ? "flex-row-reverse"
                          : "flex-row"
                      }
                    `}
                  >
                    {!isCustomer && (
                      <div
                        className="
                          mt-1
                          flex
                          h-7
                          w-7
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[var(--color-primary)]
                          text-white
                        "
                      >
                        <User size={14} />
                      </div>
                    )}

                    <div>
                      <div
                        className={`
                          rounded-2xl
                          px-4
                          py-3
                          text-xs
                          leading-5
                          ${
                            isCustomer
                              ? `
                                rounded-br-md
                                bg-[var(--color-primary)]
                                text-white
                              `
                              : `
                                rounded-bl-md
                                bg-white
                                text-[var(--color-text-primary)]
                                shadow-sm
                              `
                          }
                        `}
                      >
                        {item.text}
                      </div>

                      <div
                        className={`
                          mt-1
                          flex
                          items-center
                          gap-1
                          text-[8px]
                          text-[var(--color-text-muted)]
                          ${
                            isCustomer
                              ? "justify-end"
                              : "justify-start"
                          }
                        `}
                      >
                        {item.time}

                        {isCustomer && (
                          <CheckCheck
                            size={12}
                            className="text-[var(--color-primary)]"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT */}

        <div
          className="
            border-t
            border-[var(--color-border)]
            bg-white
            p-3
            sm:p-4
          "
        >
          <div
            className="
              flex
              items-center
              gap-2
              rounded-2xl
              border
              border-[var(--color-border)]
              bg-[var(--bg-body)]
              p-1.5
              transition
              focus-within:border-[var(--color-primary)]
              focus-within:ring-2
              focus-within:ring-[var(--color-primary)]/10
            "
          >
            <input
              value={message}
              onChange={(event) =>
                setMessage(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="
                min-w-0
                flex-1
                bg-transparent
                px-3
                py-2.5
                text-xs
                text-[var(--color-text-primary)]
                outline-none
                placeholder:text-[var(--color-text-muted)]
              "
            />

            <button
              type="button"
              onClick={sendMessage}
              disabled={!message.trim()}
              className="
                flex
                h-10
                w-10
                shrink-0
                items-center
                justify-center
                rounded-xl
                bg-[var(--color-primary)]
                text-white
                shadow-sm
                transition
                hover:bg-[var(--color-primary-dark)]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </div>

          <p className="mt-2 text-center text-[8px] text-[var(--color-text-muted)]">
            Usually replies within a few minutes
          </p>
        </div>
      </div>
    </div>
  );
}