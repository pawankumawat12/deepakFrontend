"use client";

import React, { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import {
  CheckCheck,
  Check,
  Send,
  X,
  LoaderCircle,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Lock,
  Image as ImageIcon,
  FileText,
  Download,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import {
  useGetOrderMessagesQuery,
  usePostOrderMessageMutation,
  useMarkMessagesReadMutation,
  OrderMessage,
} from "../redux/services/chatApi";
import { getSocket } from "../lib/socket";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const API_ORIGIN = (
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_BACKEND_URL) ||
  process.env.VITE_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
  ""
).replace(/\/+$/, "");

interface OrderChatProps {
  open: boolean;
  orderId: string | number;
  dbOrderId?: number;
  orderNumber?: string;
  orderStatus?: string;
  deliveredAt?: string | null;
  chatStatus?: {
    isExpired?: boolean;
    is_expired?: boolean;
    canChat?: boolean;
    can_chat?: boolean;
    expiresAt?: string | null;
    expires_at?: string | null;
    remainingMinutes?: number | null;
  } | null;
  onClose: () => void;
}

// Full categorized WhatsApp Emojis
const EMOJI_CATEGORIES = [
  {
    name: "Smileys",
    icon: "😀",
    emojis: [
      "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃",
      "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😋",
      "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐",
      "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌",
      "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧",
      "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐",
      "😕", "😟", "🙁", "😮", "😯", "😲", "😳", "🥺", "😦", "😧",
      "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓",
      "😩", "😫", "🥱", "😤", "😡", "😠", "🤬", "💀", "☠️", "💩",
    ],
  },
  {
    name: "Gestures",
    icon: "👍",
    emojis: [
      "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞",
      "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍",
      "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝",
      "🙏", "✍️", "💅", "🤳", "💪", "❤️", "🧡", "💛", "💚", "💙",
      "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗",
      "💖", "💘", "💝", "🔥", "✨", "🎉", "🎊", "💯", "⭐", "🌟",
    ],
  },
  {
    name: "Food",
    icon: "🍕",
    emojis: [
      "🍕", "🍔", "🍟", "🌭", "🍿", "🧈", "🥞", "🧇", "🥓", "🥩",
      "🍗", "🍖", "🥪", "🥙", "🧆", "🌮", "🌯", "🫔", "🥗", "🥘",
      "🫕", "🥫", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪",
      "🍤", "🍙", "🍚", "🍘", "🍦", "🍧", "🍨", "🍩", "🍪", "🎂",
      "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛",
      "☕️", "🫖", "🍵", "🧃", "🥤", "🧋", "🍶", "🍺", "🍻", "🥂",
    ],
  },
  {
    name: "Objects",
    icon: "🎉",
    emojis: [
      "🎉", "🎊", "🎈", "🎁", "🎀", "🪄", "🪅", "🏷", "🛎", "🔑",
      "🚪", "🛋", "🛏", "🛒", "🛍", "💳", "💵", "💸", "💰", "💎",
      "💡", "🔦", "⏰", "⏱", "💻", "📱", "📲", "☎️", "📦", "✉️",
      "📝", "✏️", "📎", "📌", "📍", "🔒", "🔓", "🛡", "🩺", "💊",
    ],
  },
];

export default function OrderChat({
  open,
  orderId,
  dbOrderId,
  orderNumber,
  orderStatus = "Pending",
  deliveredAt = null,
  chatStatus = null,
  onClose,
}: OrderChatProps) {
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const effectiveOrderId =
    dbOrderId ||
    (typeof orderId === "number"
      ? orderId
      : parseInt(String(orderId).replace(/\D/g, ""), 10) || orderId);
  const displayOrderNum =
    orderNumber || (typeof orderId === "string" ? orderId : `#SFC-${orderId}`);

  const [inputText, setInputText] = useState("");
  const [liveMessages, setLiveMessages] = useState<OrderMessage[]>([]);
  const [isAdminTyping, setIsAdminTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [activeEmojiCategory, setActiveEmojiCategory] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [previewLightboxImg, setPreviewLightboxImg] = useState<string | null>(
    null
  );

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const docInputRef = useRef<HTMLInputElement | null>(null);
  const inputFieldRef = useRef<HTMLInputElement | null>(null);
  const isSendingRef = useRef(false);

  const {
    data: historyData,
    isLoading: isHistoryLoading,
  } = useGetOrderMessagesQuery(effectiveOrderId, {
    skip: !open || !effectiveOrderId,
  });

  const queryChatStatus = (historyData as any)?.chatStatus;
  const isExpired =
    queryChatStatus?.isExpired ??
    queryChatStatus?.is_expired ??
    chatStatus?.isExpired ??
    chatStatus?.is_expired ??
    ((orderStatus === "Delivered" || orderStatus === "Completed") &&
      deliveredAt &&
      Date.now() > new Date(deliveredAt).getTime() + 20 * 60 * 1000);

  const [postMessageMutation, { isLoading: isSending }] =
    usePostOrderMessageMutation();
  const [markReadMutation] = useMarkMessagesReadMutation();

  // Initialize messages from history
  useEffect(() => {
    if (historyData?.data) {
      setLiveMessages(historyData.data);
    }
  }, [historyData]);

  // Socket.IO Room Connection and Events
  useEffect(() => {
    if (!open || !effectiveOrderId) return;

    const socket = getSocket(user?.id);

    // Join order room
    socket.emit("join_order_room", { orderId: effectiveOrderId });

    // Mark messages read on open
    markReadMutation(effectiveOrderId);

    // Listen for incoming live chat messages
    const handleNewMessage = (payload: {
      orderId: number | string;
      message: OrderMessage;
    }) => {
      if (String(payload.orderId) === String(effectiveOrderId)) {
        setLiveMessages((prev) => {
          if (prev.some((m) => String(m.id) === String(payload.message.id))) {
            return prev;
          }
          return [...prev, payload.message];
        });

        // If message is from admin, mark read immediately
        if (payload.message.sender_role === "admin") {
          markReadMutation(effectiveOrderId);
        }
      }
    };

    // Listen for read receipts from admin
    const handleMessagesRead = (payload: {
      orderId: number | string;
      readerRole: string;
    }) => {
      if (
        String(payload.orderId) === String(effectiveOrderId) &&
        payload.readerRole === "admin"
      ) {
        setLiveMessages((prev) =>
          prev.map((m) =>
            m.sender_role === "customer" ? { ...m, is_read: true } : m
          )
        );
      }
    };

    // Listen for typing indicators
    const handleUserTyping = (payload: {
      orderId: number | string;
      senderRole: string;
      isTyping: boolean;
    }) => {
      if (
        String(payload.orderId) === String(effectiveOrderId) &&
        payload.senderRole === "admin"
      ) {
        setIsAdminTyping(payload.isTyping);
      }
    };

    socket.on("new_chat_message", handleNewMessage);
    socket.on("messages_read", handleMessagesRead);
    socket.on("user_typing", handleUserTyping);

    return () => {
      socket.emit("leave_order_room", { orderId: effectiveOrderId });
      socket.off("new_chat_message", handleNewMessage);
      socket.off("messages_read", handleMessagesRead);
      socket.off("user_typing", handleUserTyping);
    };
  }, [open, effectiveOrderId, user?.id, markReadMutation]);

  // Scroll to bottom on new messages, typing or file preview
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [liveMessages, isAdminTyping, filePreview]);

  // Disable body scroll when modal open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    // Emit typing indicator to socket
    const socket = getSocket(user?.id);
    socket.emit("typing_start", {
      orderId: effectiveOrderId,
      senderRole: "customer",
      senderName: user?.name || "Customer",
    });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing_stop", {
        orderId: effectiveOrderId,
        senderRole: "customer",
      });
    }, 1500);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText((prev) => prev + emoji);
    inputFieldRef.current?.focus();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size cannot exceed 10 MB");
      return;
    }

    setSelectedFile(file);
    setShowAttachMenu(false);

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (docInputRef.current) docInputRef.current.value = "";
  };

  const handleSendMessage = async () => {
    if (isExpired) {
      toast.error("Chat support for this order expired 20 minutes after delivery.");
      return;
    }
    const trimmed = inputText.trim();
    if (!trimmed && !selectedFile) return;
    if (isSending || isSendingRef.current) return;
    isSendingRef.current = true;

    const socket = getSocket(user?.id);
    socket.emit("typing_stop", {
      orderId: effectiveOrderId,
      senderRole: "customer",
    });

    const fileToSend = selectedFile;
    const textToSend = trimmed;

    setInputText("");
    clearSelectedFile();
    setShowEmojiPicker(false);

    try {
      if (fileToSend) {
        const formData = new FormData();
        formData.append("orderId", String(effectiveOrderId));
        formData.append("message", textToSend);
        formData.append("senderRole", "customer");
        formData.append("file", fileToSend);

        const res = await postMessageMutation(formData).unwrap();
        if (res.data) {
          setLiveMessages((prev) => {
            if (prev.some((m) => String(m.id) === String(res.data.id))) return prev;
            return [...prev, res.data];
          });
        }
      } else {
        const res = await postMessageMutation({
          orderId: effectiveOrderId,
          message: textToSend,
        }).unwrap();

        if (res.data) {
          setLiveMessages((prev) => {
            if (prev.some((m) => String(m.id) === String(res.data.id))) return prev;
            return [...prev, res.data];
          });
        }
      }
    } catch (err: any) {
      console.error("Failed to send chat message:", err);
      // Restore input text on error
      setInputText(textToSend);
      if (fileToSend) setSelectedFile(fileToSend);
      toast.error(err?.data?.message || "Failed to send message");
    } finally {
      isSendingRef.current = false;
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-end justify-center
        bg-black/60
        backdrop-blur-xs
        sm:items-center
        sm:p-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`
          flex
          h-[92vh]
          w-full
          flex-col
          overflow-hidden
          rounded-t-[1.5rem]
          shadow-2xl
          sm:h-[680px]
          sm:max-w-[460px]
          sm:rounded-[1.5rem]
          border
          animate-in fade-in zoom-in-95
          relative
          ${isDark ? "bg-[#0b141a] border-[#222e35] text-[#e9edef]" : "bg-[#efeae2] border-[#d1d7db] text-[#111b21]"}
        `}
        style={{
          backgroundColor: isDark ? "#0b141a" : "#efeae2",
          backgroundImage: isDark
            ? `radial-gradient(#1e2a30 0.85px, transparent 0.85px), radial-gradient(#1e2a30 0.85px, #0b141a 0.85px)`
            : `radial-gradient(#d1d7db 0.85px, transparent 0.85px), radial-gradient(#d1d7db 0.85px, #efeae2 0.85px)`,
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 12px 12px",
        }}
      >
        {/* WHATSAPP TOP APP BAR (HEADER) */}
        <div className={`flex items-center justify-between px-3.5 py-2.5 text-white shadow-md select-none z-10 ${
          isDark ? "bg-[#202c33] border-b border-[#222e35]" : "bg-[#008069]"
        }`}>
          <div className="flex items-center gap-2.5 min-w-0">
            {/* Store Avatar */}
            <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
              isDark ? "bg-[#1f3540] text-emerald-400 ring-white/10" : "bg-[#128c7e] text-white ring-white/20"
            } font-bold text-sm shadow-inner ring-1`}>
              <span>SFC</span>
              <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#25d366] ring-2 ${
                isDark ? "ring-[#202c33]" : "ring-[#008069]"
              }`} />
            </div>

            {/* Title & Status */}
            <div className="min-w-0 flex-1">
              <h2 className="text-[15px] font-semibold text-white leading-tight truncate">
                SFC Bakers Support
              </h2>

              <p className={`text-[11.5px] leading-tight truncate font-normal mt-0.5 ${
                isDark ? "text-[#8696a0]" : "text-[#c1eedb]"
              }`}>
                {isAdminTyping ? (
                  <span className="font-semibold text-[#25d366] animate-pulse">
                    typing...
                  </span>
                ) : (
                  <span>online • Order {displayOrderNum}</span>
                )}
              </p>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 text-white/90">
            <button
              type="button"
              className="rounded-full p-2 hover:bg-white/15 transition active:scale-90"
              title="Store Support Helpline"
              onClick={() => alert("Connecting to SFC Support Helpline...")}
            >
              <Phone size={17} />
            </button>

            <button
              type="button"
              className="rounded-full p-2 hover:bg-white/15 transition active:scale-90"
              title="Video Support"
              onClick={() => alert("Video support will be available shortly.")}
            >
              <Video size={18} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-red-500/80 transition text-white active:scale-90 ml-0.5"
              aria-label="Close chat"
              title="Close chat"
            >
              <X size={19} />
            </button>
          </div>
        </div>

        {/* ORDER INFO SUB-HEADER */}
        <div className={`flex items-center justify-between border-b px-3.5 py-1.5 text-[11px] shadow-2xs z-10 ${
          isDark
            ? "border-[#222e35] bg-[#111b21] text-[#8696a0]"
            : "border-[#d1d7db]/80 bg-[#f0f2f5] text-[#54656f]"
        }`}>
          <span className="font-medium">
            Order: <b className={isDark ? "text-[#e9edef]" : "text-[#111b21]"}>{displayOrderNum}</b>
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${
              orderStatus === "Delivered"
                ? isDark ? "bg-emerald-950/70 text-emerald-400 border-emerald-800" : "bg-emerald-100 text-emerald-800 border-emerald-200"
                : orderStatus === "Preparing"
                ? isDark ? "bg-blue-950/70 text-blue-400 border-blue-800" : "bg-blue-100 text-blue-800 border-blue-200"
                : orderStatus === "Out for Delivery"
                ? isDark ? "bg-orange-950/70 text-orange-400 border-orange-800" : "bg-orange-100 text-orange-800 border-orange-200"
                : isDark ? "bg-amber-950/70 text-amber-400 border-amber-800" : "bg-amber-100 text-amber-800 border-amber-200"
            }`}
          >
            {orderStatus}
          </span>
        </div>

        {/* WHATSAPP MESSAGE STREAM */}
        <div
          className="flex-1 overflow-y-auto px-3 py-3 space-y-1.5 flex flex-col w-full"
          onClick={() => {
            setShowEmojiPicker(false);
            setShowAttachMenu(false);
          }}
        >
          {/* Encryption Notice */}
          <div className="flex justify-center my-1 w-full">
            <div className={`flex items-center gap-1.5 rounded-[7.5px] px-3 py-1 text-[10px] text-center max-w-[320px] leading-tight ${
              isDark
                ? "bg-[#182229] text-[#8696a0] border border-[#222e35]"
                : "bg-[#ffeecd] text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,.13)]"
            }`}>
              <Lock size={11} className={`shrink-0 ${isDark ? "text-[#ffd279]" : "text-[#856404]"}`} />
              <span>Messages to SFC Kitchen are end-to-end encrypted.</span>
            </div>
          </div>

          {/* Chat Expired Notice */}
          {isExpired && (
            <div className="flex justify-center my-1 w-full">
              <div className={`flex items-center justify-center gap-1.5 rounded-[8px] border px-3.5 py-1.5 text-[11px] font-semibold text-center max-w-[420px] leading-tight shadow-xs ${
                isDark
                  ? "bg-red-950/60 border-red-800 text-red-300"
                  : "bg-red-100 border-red-300 text-red-800"
              }`}>
                <span>⚠️ Chat support for this order closed 20 minutes after delivery.</span>
              </div>
            </div>
          )}

          {/* Date Separator */}
          <div className="flex justify-center my-1 w-full">
            <span className={`rounded-[7.5px] px-3 py-1 text-[11px] font-medium uppercase tracking-wide ${
              isDark
                ? "bg-[#182229] text-[#8696a0] border border-[#222e35]"
                : "bg-white text-[#54656f] shadow-[0_1px_0.5px_rgba(11,20,26,.13)]"
            }`}>
              Today
            </span>
          </div>

          {isHistoryLoading ? (
            <div className={`flex h-40 items-center justify-center gap-2 text-xs font-semibold ${
              isDark ? "text-[#8696a0]" : "text-[#54656f]"
            }`}>
              <LoaderCircle size={18} className="animate-spin text-[#008069]" />
              <span>Loading messages...</span>
            </div>
          ) : liveMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className={`rounded-2xl p-3.5 shadow-sm mb-2 ${
                isDark ? "bg-[#202c33] text-stone-300 border border-[#2a3942]" : "bg-white text-stone-500"
              }`}>
                👋
              </div>
              <p className={`text-xs font-bold ${isDark ? "text-[#e9edef]" : "text-[#111b21]"}`}>No messages yet</p>
              <p className={`text-[11px] max-w-[240px] mt-0.5 ${isDark ? "text-[#8696a0]" : "text-[#54656f]"}`}>
                Send instructions, photos, receipts, or chat with the chef here!
              </p>
            </div>
          ) : (
            liveMessages.map((item) => {
              const isAdminMsg = item.sender_role === "admin";
              const isCustomerMsg = item.sender_role === "customer";
              // In customer view: Customer is 'Me' (Right), Admin is 'Received' (Left)
              const isMe = !isAdminMsg && isCustomerMsg;
              const hasAttachment = Boolean(item.attachment_url);

              const timeStr = new Date(item.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: isMe ? "flex-end" : "flex-start",
                    margin: "2px 0",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "80%",
                      width: "fit-content",
                      marginLeft: isMe ? "auto" : "2px",
                      marginRight: isMe ? "2px" : "auto",
                      backgroundColor: isMe
                        ? isDark ? "#005c4b" : "#d9fdd3"
                        : isDark ? "#202c33" : "#ffffff",
                      borderRadius: isMe
                        ? "7.5px 7.5px 0px 7.5px"
                        : "7.5px 7.5px 7.5px 0px",
                      boxShadow: "0 1px 0.5px rgba(11,20,26,.13)",
                      border: isDark
                        ? isMe ? "1px solid #005c4b" : "1px solid #2a3942"
                        : "none",
                      padding: hasAttachment
                        ? "4px 4px 4px 4px"
                        : "6px 8px 4px 9px",
                      position: "relative",
                    }}
                  >
                    {!isMe && (
                      <p
                        style={{
                          fontSize: "11.5px",
                          fontWeight: 700,
                          color: isDark ? "#25d366" : "#008069",
                          lineHeight: "1",
                          marginBottom: "3px",
                          paddingLeft: hasAttachment ? "4px" : "0",
                          paddingTop: hasAttachment ? "2px" : "0",
                          userSelect: "none",
                        }}
                      >
                        {item.sender_name || "SFC Bakers Support"}
                      </p>
                    )}

                    {/* ATTACHMENT RENDERING */}
                    {hasAttachment && (
                      <div className="mb-1">
                        {item.attachment_type === "image" ? (
                          /* Fixed-size Image Attachment */
                          <div
                            className={`relative overflow-hidden rounded-md cursor-pointer group ${
                              isDark ? "bg-[#111b21]" : "bg-stone-100"
                            }`}
                            style={{
                              width: "240px",
                              maxHeight: "200px",
                            }}
                            onClick={() =>
                              setPreviewLightboxImg(
                                item.attachment_url?.startsWith("http")
                                  ? item.attachment_url
                                  : `${API_ORIGIN}${item.attachment_url}`
                              )
                            }
                          >
                            <NextImage
                              src={
                                item.attachment_url?.startsWith("http")
                                  ? item.attachment_url
                                  : `${API_ORIGIN}${item.attachment_url}`
                              }
                              alt={item.attachment_name || "Image attachment"}
                              width={320}
                              height={200}
                              unoptimized
                              className="w-full h-auto object-cover max-h-[200px] transition group-hover:scale-102"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                          </div>
                        ) : (
                          /* Fixed-size Document Attachment Card */
                          <a
                            href={
                              item.attachment_url?.startsWith("http")
                                ? item.attachment_url
                                : `${API_ORIGIN}${item.attachment_url}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            download={item.attachment_name || "document"}
                            className={`flex items-center gap-2.5 rounded-lg border p-2.5 transition w-[230px] sm:w-[250px] ${
                              isDark
                                ? "border-[#2a3942] bg-[#111b21] hover:bg-[#182229]"
                                : "border-stone-200 bg-stone-50/90 hover:bg-stone-100"
                            }`}
                          >
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${
                              isDark
                                ? "bg-red-950/60 text-red-400 border-red-800"
                                : "bg-red-50 text-red-600 border-red-200"
                            }`}>
                              <FileText size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className={`text-xs font-bold truncate ${isDark ? "text-[#e9edef]" : "text-stone-900"}`}>
                                {item.attachment_name || "Document"}
                              </p>
                              <p className={`text-[10px] ${isDark ? "text-[#8696a0]" : "text-stone-500"}`}>
                                {item.attachment_size || "Document"}
                              </p>
                            </div>
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full shadow-xs ${
                              isDark ? "bg-[#202c33] text-[#e9edef] hover:bg-[#2a3942]" : "bg-white text-stone-600 hover:bg-stone-200"
                            }`}>
                              <Download size={13} />
                            </div>
                          </a>
                        )}
                      </div>
                    )}

                    {/* Message Text & Inline Ticks */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        flexWrap: "wrap",
                        gap: "6px",
                        justifyContent: "space-between",
                        padding: hasAttachment ? "2px 4px 1px 4px" : "0",
                      }}
                    >
                      {item.message &&
                        (!hasAttachment ||
                          (item.message !== "📷 Photo" &&
                            item.message !== "📄 Document")) && (
                          <span
                            style={{
                              fontSize: "13.5px",
                              lineHeight: "19px",
                              color: isDark ? "#e9edef" : "#111b21",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              flex: "1 1 auto",
                              marginRight: "4px",
                            }}
                          >
                            {item.message}
                          </span>
                        )}

                      {/* WhatsApp inline bottom-right timestamp & ticks */}
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "10.5px",
                          color: isDark ? "#8696a0" : "#667781",
                          userSelect: "none",
                          marginLeft: "auto",
                          paddingBottom: "1px",
                        }}
                      >
                        <span>{timeStr}</span>
                        {isMe && (
                          <span
                            className="inline-flex items-center"
                            title={
                              item.is_read
                                ? "Read / Seen by Store"
                                : "Delivered / Sent"
                            }
                          >
                            {item.is_read ? (
                              <CheckCheck size={15} color="#53bdeb" />
                            ) : (
                              <CheckCheck size={15} color={isDark ? "#8696a0" : "#8696a0"} />
                            )}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {/* WhatsApp Typing Indicator Bubble */}
          {isAdminTyping && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
                margin: "2px 0",
              }}
            >
              <div
                style={{
                  backgroundColor: isDark ? "#202c33" : "#ffffff",
                  borderRadius: "7.5px 7.5px 7.5px 0px",
                  padding: "7px 12px",
                  boxShadow: "0 1px 0.5px rgba(11,20,26,.13)",
                  border: isDark ? "1px solid #2a3942" : "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "12px",
                  color: isDark ? "#8696a0" : "#54656f",
                }}
              >
                <span>SFC Bakers is typing</span>
                <span className="flex gap-1 items-center">
                  <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-[#25d366]" : "bg-[#008069]"} animate-bounce`} />
                  <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-[#25d366]" : "bg-[#008069]"} animate-bounce [animation-delay:0.2s]`} />
                  <span className={`h-1.5 w-1.5 rounded-full ${isDark ? "bg-[#25d366]" : "bg-[#008069]"} animate-bounce [animation-delay:0.4s]`} />
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* SELECTED FILE PREVIEW TRAY */}
        {selectedFile && (
          <div className={`p-2 border-t flex items-center justify-between gap-3 animate-in fade-in ${
            isDark ? "bg-[#111b21] border-[#222e35]" : "bg-[#e9edef] border-[#d1d7db]"
          }`}>
            <div className="flex items-center gap-2.5 min-w-0">
              {filePreview ? (
                <NextImage
                  src={filePreview}
                  alt="Preview"
                  width={48}
                  height={48}
                  unoptimized
                  className={`h-12 w-12 rounded-lg object-cover border ${isDark ? "border-[#2a3942]" : "border-stone-300"}`}
                />
              ) : (
                <div className={`flex h-12 w-12 items-center justify-center rounded-lg border ${
                  isDark ? "bg-[#202c33] border-[#2a3942] text-[#8696a0]" : "bg-white border-stone-300 text-stone-600"
                }`}>
                  <FileText size={22} />
                </div>
              )}
              <div className="min-w-0">
                <p className={`text-xs font-bold truncate max-w-[220px] ${isDark ? "text-[#e9edef]" : "text-[#111b21]"}`}>
                  {selectedFile.name}
                </p>
                <p className={`text-[10px] ${isDark ? "text-[#8696a0]" : "text-[#54656f]"}`}>
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to send
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={clearSelectedFile}
              className={`flex h-7 w-7 items-center justify-center rounded-full ${
                isDark ? "bg-[#2a3942] text-[#e9edef] hover:bg-[#374248]" : "bg-stone-300 text-stone-600 hover:bg-stone-400"
              }`}
            >
              <X size={15} />
            </button>
          </div>
        )}
        {/* ATTACHMENT POPUP MENU (PHOTOS & DOCUMENTS) */}
        {showAttachMenu && (
          <div
            className={`absolute bottom-16 left-4 rounded-2xl shadow-xl border p-2.5 flex flex-col gap-1.5 z-50 animate-in fade-in zoom-in-95 ${
              isDark ? "bg-[#202c33] border-[#2a3942]" : "bg-white border-stone-200"
            }`}
            style={{ width: "190px" }}
          >
            {/* Image / Photos option */}
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className={`flex items-center gap-3 p-2 rounded-xl text-left text-xs font-bold transition ${
                isDark ? "hover:bg-[#111b21] text-[#e9edef]" : "hover:bg-purple-50 text-stone-700"
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isDark ? "bg-purple-950/70 text-purple-400" : "bg-purple-100 text-purple-600"
              }`}>
                <ImageIcon size={17} />
              </div>
              <div>
                <p className={`leading-tight font-bold ${isDark ? "text-[#e9edef]" : "text-stone-900"}`}>Photos & Media</p>
                <p className={`text-[9px] ${isDark ? "text-[#8696a0]" : "text-stone-400"}`}>JPG, PNG, WEBP</p>
              </div>
            </button>

            {/* Document option */}
            <button
              type="button"
              onClick={() => docInputRef.current?.click()}
              className={`flex items-center gap-3 p-2 rounded-xl text-left text-xs font-bold transition ${
                isDark ? "hover:bg-[#111b21] text-[#e9edef]" : "hover:bg-blue-50 text-stone-700"
              }`}
            >
              <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                isDark ? "bg-blue-950/70 text-blue-400" : "bg-blue-100 text-blue-600"
              }`}>
                <FileText size={17} />
              </div>
              <div>
                <p className={`leading-tight font-bold ${isDark ? "text-[#e9edef]" : "text-stone-900"}`}>Document</p>
                <p className={`text-[9px] ${isDark ? "text-[#8696a0]" : "text-stone-400"}`}>PDF, DOC, TXT</p>
              </div>
            </button>
          </div>
        )}

        {/* WHATSAPP EMOJI PICKER POPUP */}
        {showEmojiPicker && (
          <div
            className={`absolute bottom-16 left-2 right-2 sm:left-3 sm:right-3 rounded-2xl shadow-2xl border overflow-hidden z-50 animate-in fade-in zoom-in-95 ${
              isDark ? "bg-[#202c33] border-[#2a3942]" : "bg-white border-stone-200"
            }`}
            style={{ maxHeight: "260px" }}
          >
            {/* Emoji Category Tabs */}
            <div className={`flex items-center justify-between border-b px-2 py-1.5 ${
              isDark ? "border-[#2a3942] bg-[#111b21]" : "border-stone-200 bg-[#f0f2f5]"
            }`}>
              <div className="flex items-center gap-1">
                {EMOJI_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setActiveEmojiCategory(idx)}
                    className={`flex items-center justify-center h-8 w-8 rounded-xl text-base transition ${
                      activeEmojiCategory === idx
                        ? isDark ? "bg-[#202c33] text-white shadow-xs scale-110" : "bg-white shadow-xs scale-110"
                        : isDark ? "hover:bg-[#202c33]/70 opacity-70 hover:opacity-100 text-stone-300" : "hover:bg-stone-200/70 opacity-70 hover:opacity-100"
                    }`}
                    title={cat.name}
                  >
                    {cat.icon}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(false)}
                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                  isDark ? "bg-[#2a3942] text-[#8696a0] hover:bg-[#374248]" : "bg-stone-200/80 text-stone-500 hover:bg-stone-300"
                }`}
              >
                <X size={14} />
              </button>
            </div>

            {/* Emojis Grid */}
            <div
              className="p-2.5 overflow-y-auto grid grid-cols-8 gap-1"
              style={{ maxHeight: "200px" }}
            >
              {EMOJI_CATEGORIES[activeEmojiCategory].emojis.map(
                (emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xl active:scale-125 transition ${
                      isDark ? "hover:bg-[#111b21]" : "hover:bg-stone-100"
                    }`}
                  >
                    {emoji}
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* HIDDEN FILE INPUTS */}
        <input
          ref={imageInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={docInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.zip"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* WHATSAPP INPUT BAR (BOTTOM) */}
        <div className={`p-2 border-t z-10 ${
          isDark ? "bg-[#202c33] border-[#222e35]" : "bg-[#f0f2f5] border-[#d1d7db]"
        }`}>
          <div className="flex items-center gap-1.5">
            {/* Input Box Capsule */}
            <div
              className={`flex flex-1 items-center gap-2 rounded-full px-3 py-2 shadow-2xs border ${
                isExpired
                  ? isDark ? "bg-[#111b21] border-[#222e35] opacity-70" : "bg-stone-100 border-stone-200 opacity-70"
                  : isDark ? "bg-[#2a3942] border-[#2a3942]" : "bg-white border-[#e9edef]"
              }`}
            >
              <button
                type="button"
                disabled={isExpired}
                className={`transition ${
                  isExpired
                    ? "text-stone-400 cursor-not-allowed"
                    : showEmojiPicker
                    ? isDark ? "text-[#00a884] scale-110" : "text-[#008069] scale-110"
                    : isDark ? "text-[#8696a0] hover:text-[#e9edef]" : "text-[#54656f] hover:text-[#111b21]"
                }`}
                onClick={() => {
                  if (!isExpired) {
                    setShowEmojiPicker((prev) => !prev);
                    setShowAttachMenu(false);
                  }
                }}
                title={isExpired ? "Chat closed" : "Choose Emoji"}
              >
                <Smile size={21} />
              </button>

              <input
                ref={inputFieldRef}
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  isExpired
                    ? "Chat closed (20m after delivery)"
                    : selectedFile
                    ? `Add caption for ${selectedFile.name}...`
                    : "Type a message"
                }
                disabled={isSending || isExpired}
                className={`flex-1 bg-transparent text-[14px] outline-none ${
                  isExpired
                    ? "text-stone-400 placeholder:text-stone-400 cursor-not-allowed"
                    : isDark
                    ? "text-[#e9edef] placeholder:text-[#8696a0]"
                    : "text-[#111b21] placeholder:text-[#8696a0]"
                }`}
              />

              <button
                type="button"
                disabled={isExpired}
                onClick={() => {
                  if (!isExpired) {
                    setShowAttachMenu((prev) => !prev);
                    setShowEmojiPicker(false);
                  }
                }}
                className={`transition ${
                  isExpired
                    ? "text-stone-400 cursor-not-allowed"
                    : showAttachMenu
                    ? isDark ? "text-[#00a884] scale-110" : "text-[#008069] scale-110"
                    : isDark ? "text-[#8696a0] hover:text-[#e9edef]" : "text-[#54656f] hover:text-[#111b21]"
                }`}
                title={isExpired ? "Chat closed" : "Attach photo or document"}
              >
                <Paperclip size={19} />
              </button>
            </div>

            {/* WhatsApp Send / Mic Circular Button */}
            <button
              type="button"
              onClick={handleSendMessage}
              disabled={isSending || isExpired}
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-md transition ${
                isExpired
                  ? isDark ? "bg-stone-700 cursor-not-allowed opacity-60" : "bg-stone-400 cursor-not-allowed opacity-60"
                  : isDark ? "bg-[#00a884] hover:bg-[#008f6f] active:scale-95 disabled:opacity-50" : "bg-[#008069] hover:bg-[#006e5a] active:scale-95 disabled:opacity-50"
              }`}
              title={
                isExpired
                  ? "Chat closed 20 minutes after delivery"
                  : "Send message"
              }
              aria-label={
                isExpired
                  ? "Chat closed"
                  : inputText.trim() || selectedFile
                  ? "Send message"
                  : "Voice message"
              }
            >
              {isSending ? (
                <LoaderCircle size={18} className="animate-spin" />
              ) : inputText.trim() || selectedFile ? (
                <Send size={16} className="translate-x-0.5" />
              ) : isExpired ? (
                <Send size={16} className="translate-x-0.5" />
              ) : (
                <Mic size={18} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX PREVIEW */}
      {previewLightboxImg && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md animate-in fade-in"
          onClick={() => setPreviewLightboxImg(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <NextImage
              src={previewLightboxImg}
              alt="Full Preview"
              width={1200}
              height={900}
              unoptimized
              className="max-h-[80vh] w-auto max-w-full object-contain rounded-2xl"
            />
            <button
              type="button"
              onClick={() => setPreviewLightboxImg(null)}
              className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}