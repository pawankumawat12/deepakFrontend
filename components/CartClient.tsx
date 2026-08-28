"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  LoaderCircle,
  LogIn,
  Minus,
  Plus,
  ShoppingBag,
  Sparkles,
  Trash2,
  Truck,
  Utensils,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Home,
  Briefcase,
  Building,
  CheckCircle2,
  X,
  Phone,
  User,
  QrCode,
  Banknote,
  Copy,
  ExternalLink,
  CreditCard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useClearCartMutation,
  CartItem,
  CartSummary,
} from "../redux/services/cartApi";
import { useCreateOrderMutation } from "../redux/services/orderApi";
import {
  useGetAddressesQuery,
  useCreateAddressMutation,
  useDeleteAddressMutation,
  Address,
} from "../redux/services/addressApi";
import { useGetPaymentQrQuery } from "../redux/services/settingsApi";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

const API_ORIGIN = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1"
).replace(/\/api\/v1$/, "");

function formatRupee(v: number) {
  return Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function CartClient() {
  const router = useRouter();
  const user = useSelector(
    (state: { auth: { user: any | null } }) => state.auth.user
  );

  const [authOpen, setAuthOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState({
    label: "Home",
    receiver_name: "",
    phone_number: "",
    house_number: "",
    building_name: "",
    landmark: "",
    formatted_address: "",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "",
    is_default: false,
  });

  // Payment Method State
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "Cash on Delivery" | "Online Payment"
  >("Cash on Delivery");
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>("Google Pay");
  const [transactionIdInput, setTransactionIdInput] = useState<string>("");

  const { data: paymentQrResponse } = useGetPaymentQrQuery();
  const paymentQr = paymentQrResponse?.data;

  const {
    data: cartResponse,
    isLoading,
    isFetching,
  } = useGetCartQuery(
    {
      addressId: selectedAddressId || undefined,
      paymentMethod: selectedPaymentMethod,
    },
    {
      skip: !user,
    }
  );

  const { data: addressResponse, isLoading: isAddressesLoading } = useGetAddressesQuery(
    undefined,
    { skip: !user }
  );
  const addresses: Address[] = addressResponse?.data || [];

  const [createAddress, { isLoading: isSavingAddress }] = useCreateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();

  // Auto-select default or first address
  useEffect(() => {
    if (addresses.length > 0) {
      if (!selectedAddressId || !addresses.some((a) => a.id === selectedAddressId)) {
        const defaultAddr = addresses.find((a) => a.is_default);
        setSelectedAddressId(defaultAddr ? defaultAddr.id : addresses[0].id);
      }
    } else {
      setSelectedAddressId(null);
    }
  }, [addresses, selectedAddressId]);

  // Pre-populate address form with user details when opening modal
  useEffect(() => {
    if (user && addressModalOpen) {
      setAddressForm((prev) => ({
        ...prev,
        receiver_name: prev.receiver_name || user.name || "",
        phone_number: prev.phone_number || user.phone || "",
      }));
    }
  }, [user, addressModalOpen]);

  const [updateCartItem] = useUpdateCartItemMutation();
  const [deleteCartItem] = useDeleteCartItemMutation();
  const [clearCart, { isLoading: isClearing }] = useClearCartMutation();
  const [createOrder, { isLoading: isPlacingOrder }] = useCreateOrderMutation();

  const items: CartItem[] = cartResponse?.data?.items || [];
  const defaultSummary: CartSummary = {
    totalItems: 0,
    itemTypesCount: 0,
    subtotal: 0,
    discountPercent: 0,
    discount: 0,
    discountedSubtotal: 0,
    gstPercent: 0,
    taxInclusive: false,
    taxAmount: 0,
    taxAddedToTotal: 0,
    taxLabel: "",
    deliveryChargeType: "fixed",
    deliveryChargeValue: 0,
    deliveryFee: 0,
    isFreeDelivery: true,
    freeDeliveryThreshold: 0,
    freeDeliverySavings: 0,
    freeDeliveryShortfall: 0,
    distanceKm: null,
    maxDeliveryDistance: 0,
    isOutOfRange: false,
    packagingFee: 0,
    platformFee: 0,
    codFee: 0,
    isCod: true,
    minimumOrderAmount: 0,
    isBelowMinimumOrder: false,
    minimumOrderShortfall: 0,
    grandTotal: 0,
    hasOutOfStockItems: false,
    outOfStockCount: 0,
  };
  const summary: CartSummary = cartResponse?.data?.summary || defaultSummary;

  const handleUpdateQty = async (
    productId: number,
    nextQty: number,
    maxStock: number,
    isMadeToOrder?: boolean
  ) => {
    if (!isMadeToOrder && nextQty > maxStock) {
      toast.error(`Only ${maxStock} items available in stock`);
      return;
    }
    try {
      setUpdatingId(productId);
      await updateCartItem({ productId, quantity: nextQty }).unwrap();
      if (nextQty === 0) {
        toast.success("Item removed from cart");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteItem = async (productId: number) => {
    try {
      setDeletingId(productId);
      await deleteCartItem(productId).unwrap();
      toast.success("Item removed from cart");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to remove item");
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return;
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to clear cart");
    }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.receiver_name.trim()) {
      toast.error("Please enter receiver name");
      return;
    }
    if (!addressForm.phone_number.trim() || addressForm.phone_number.trim().length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!addressForm.house_number.trim()) {
      toast.error("Please enter house / flat / room number");
      return;
    }
    if (!addressForm.formatted_address.trim()) {
      toast.error("Please enter street, area or locality");
      return;
    }
    if (!addressForm.pincode.trim()) {
      toast.error("Please enter postal pincode");
      return;
    }

    try {
      const res = await createAddress({
        label: addressForm.label,
        receiver_name: addressForm.receiver_name.trim(),
        phone_number: addressForm.phone_number.trim(),
        house_number: addressForm.house_number.trim(),
        building_name: addressForm.building_name.trim() || undefined,
        landmark: addressForm.landmark.trim() || undefined,
        formatted_address: addressForm.formatted_address.trim(),
        city: addressForm.city.trim() || "Jaipur",
        state: addressForm.state.trim() || "Rajasthan",
        pincode: addressForm.pincode.trim(),
        is_default: addressForm.is_default || addresses.length === 0,
      }).unwrap();

      const newAddrId = res?.data?.id;
      if (newAddrId) {
        setSelectedAddressId(newAddrId);
      }
      toast.success("Delivery address saved successfully! 📍");
      setAddressModalOpen(false);
      setAddressForm({
        label: "Home",
        receiver_name: user?.name || "",
        phone_number: user?.phone || "",
        house_number: "",
        building_name: "",
        landmark: "",
        formatted_address: "",
        city: "Jaipur",
        state: "Rajasthan",
        pincode: "",
        is_default: false,
      });
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to save address");
    }
  };

  const handleDeleteAddress = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Delete this delivery address?")) return;
    try {
      await deleteAddress(id).unwrap();
      toast.success("Address removed");
      if (selectedAddressId === id) {
        const remaining = addresses.filter((a) => a.id !== id);
        setSelectedAddressId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete address");
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  const handleCheckout = async () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    if (summary.hasOutOfStockItems) {
      toast.error("Please remove or adjust out-of-stock items before checkout");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!selectedAddress) {
      toast.error("Please select or add a delivery address to place your order");
      setAddressModalOpen(true);
      return;
    }

    const addressParts = [
      selectedAddress.house_number,
      selectedAddress.building_name,
      selectedAddress.landmark ? `Near ${selectedAddress.landmark}` : null,
      selectedAddress.formatted_address,
      `${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`,
    ].filter(Boolean);

    const shippingAddress = addressParts.join(", ");
    const isOnline = selectedPaymentMethod === "Online Payment";

    try {
      const orderResult = await createOrder({
        addressId: selectedAddress.id,
        customerName: selectedAddress.receiver_name || user.name || "Customer",
        customerEmail: user.email || "",
        customerPhone: selectedAddress.phone_number || user.phone || "",
        shippingAddress,
        deliveryAddressJson: selectedAddress,
        paymentMethod: isOnline ? "Online Payment" : "Cash on Delivery",
        paymentStatus: "Pending",
        paymentDetailsJson: isOnline
          ? {
              payment_app: selectedUpiApp,
              upi_id: paymentQr?.upi_id,
              merchant_name: paymentQr?.merchant_name,
            }
          : undefined,
      }).unwrap();

      const newOrderId = orderResult?.data?.id;

      if (isOnline) {
        toast.success("🎉 Order placed! Complete payment via UPI with 1-click.");
        router.push(`/orders?payOrderId=${newOrderId || ""}`);
      } else {
        toast.success("🎉 Order placed successfully! Fresh food is being prepared.");
        router.push("/orders");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to place order. Please try again.");
    }
  };
  if (!user) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)]">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm sm:p-12">
            <div
              className="
                mx-auto
                flex
                h-28
                w-28
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                shadow-inner
              "
            >
              <ShoppingBag size={48} strokeWidth={1.8} />
            </div>

            <p className="mt-6 text-[11px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Flipkart-Style Cart
            </p>

            <h1 className="mt-2 text-2xl font-black tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              Missing Cart items?
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[var(--color-text-muted)] sm:text-sm">
              Login to see the items you added previously and manage your delicious orders.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => setAuthOpen(true)}
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-[var(--color-primary)]
                  px-8
                  text-xs
                  font-black
                  text-white
                  shadow-lg
                  shadow-[var(--color-primary)]/25
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-[var(--color-primary-dark)]
                  active:scale-95
                "
              >
                <LogIn size={16} />
                Login to view Cart
              </button>

              <Link
                href="/menu"
                className="
                  inline-flex
                  h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  border
                  border-[var(--color-border)]
                  bg-white
                  px-6
                  text-xs
                  font-bold
                  text-[var(--color-text-primary)]
                  transition
                  hover:bg-[var(--color-primary-50)]
                  hover:text-[var(--color-primary)]
                "
              >
                <Utensils size={15} />
                Explore Menu
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-8">
              <div className="p-2">
                <div className="text-xl">🥬</div>
                <p className="mt-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                  Fresh Food
                </p>
              </div>
              <div className="p-2">
                <div className="text-xl">⚡</div>
                <p className="mt-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                  Quick Service
                </p>
              </div>
              <div className="p-2">
                <div className="text-xl">🛡️</div>
                <p className="mt-1 text-[10px] font-bold text-[var(--color-text-secondary)]">
                  Safe & Secure
                </p>
              </div>
            </div>
          </div>
        </div>

        <LoginModal
          open={authOpen}
          onClose={() => setAuthOpen(false)}
          onOpenRegister={() => {
            setAuthOpen(false);
            setRegisterOpen(true);
          }}
        />
        <RegisterModal
          open={registerOpen}
          onClose={() => setRegisterOpen(false)}
        />
      </main>
    );
  }

  /* ============================================================
     2. LOADING SPINNER
  ============================================================ */
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)] pt-28 pb-20">
        <div className="mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4">
          <LoaderCircle size={44} className="animate-spin text-[var(--color-primary)]" />
          <p className="mt-4 text-sm font-bold text-[var(--color-text-muted)]">
            Loading your persistent cart...
          </p>
        </div>
      </main>
    );
  }

  /* ============================================================
     3. EMPTY CART (LOGGED IN)
  ============================================================ */
  if (!items.length) {
    return (
      <main className="min-h-screen bg-[var(--bg-body)] pt-24 pb-20">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-[var(--color-border)] bg-white p-8 text-center shadow-sm sm:p-12">
            <div
              className="
                mx-auto
                flex
                h-24
                w-24
                items-center
                justify-center
                rounded-full
                bg-[var(--color-primary-50)]
                text-[var(--color-primary)]
                shadow-inner
              "
            >
              <ShoppingBag size={40} />
            </div>

            <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--color-primary)]">
              Your Cart
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight text-[var(--color-text-primary)]">
              Your cart is empty!
            </h1>

            <p className="mx-auto mt-3 max-w-sm text-xs leading-6 text-[var(--color-text-secondary)] sm:text-sm">
              Looks like you haven't added anything yet. Explore our freshly prepared menu and find something delicious.
            </p>

            <Link
              href="/menu"
              className="
                mx-auto
                mt-7
                inline-flex
                h-12
                items-center
                gap-2
                rounded-2xl
                bg-[var(--color-primary)]
                px-8
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-[var(--color-primary)]/25
                transition-all
                hover:-translate-y-0.5
                hover:bg-[var(--color-primary-dark)]
                active:scale-95
              "
            >
              <Utensils size={16} />
              Explore Menu
              <ArrowRight size={15} />
            </Link>

            <div className="mt-10 grid grid-cols-3 gap-2 border-t border-[var(--color-border)] pt-6">
              <div className="rounded-xl bg-[var(--color-primary-50)] p-3 text-center">
                <div className="text-lg">🥬</div>
                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Fresh
                </p>
              </div>
              <div className="rounded-xl bg-[var(--color-primary-50)] p-3 text-center">
                <div className="text-lg">⚡</div>
                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Fast
                </p>
              </div>
              <div className="rounded-xl bg-[var(--color-primary-50)] p-3 text-center">
                <div className="text-lg">❤️</div>
                <p className="mt-1 text-[9px] font-black text-[var(--color-text-secondary)]">
                  Delicious
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--bg-body)]">
      {/* HEADER BAR */}
      <section className="bg-[var(--color-primary-dark)]">
        <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-9">
          <Link
            href="/menu"
            className="
              inline-flex
              items-center
              gap-1.5
              text-xs
              font-bold
              text-white/70
              transition
              hover:text-white
            "
          >
            <ArrowLeft size={14} />
            Back to Menu
          </Link>

          <div className="mt-4 flex items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShoppingBag size={16} className="text-[var(--color-primary-light)]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
                  Flipkart-Style Cart
                </span>
              </div>
              <h1 className="mt-1.5 text-2xl font-black text-white sm:text-3xl md:text-4xl">
                My Cart ({summary.totalItems})
              </h1>
            </div>

            <div className="hidden rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-right backdrop-blur-md sm:block">
              <p className="text-[9px] font-bold uppercase tracking-wider text-white/50">
                Cart Total
              </p>
              <p className="mt-0.5 text-xl font-black text-white">
                ₹{formatRupee(summary.grandTotal)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CART CONTENT GRID */}
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_390px] lg:items-start">
          {/* ITEMS & ADDRESS SECTION */}
          <section>
            {/* =====================================================
                DELIVERY ADDRESS SELECTION SECTION (FLIPKART STYLE)
            ===================================================== */}
            <div className="mb-6 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h2 className="text-sm font-black text-[var(--color-text-primary)] sm:text-base">
                      Delivery Address
                    </h2>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      {addresses.length === 0
                        ? "Please add an address where you want your food delivered"
                        : `${addresses.length} saved address${addresses.length === 1 ? "" : "es"} available`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAddressModalOpen(true)}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    px-3.5
                    py-2
                    text-xs
                    font-bold
                    text-[var(--color-primary)]
                    transition
                    hover:bg-[var(--color-primary)]
                    hover:text-white
                  "
                >
                  <Plus size={15} />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* ADDRESSES LIST */}
              {isAddressesLoading ? (
                <div className="flex items-center justify-center py-6 text-xs text-[var(--color-text-muted)]">
                  <LoaderCircle size={16} className="mr-2 animate-spin text-[var(--color-primary)]" />
                  Loading saved addresses...
                </div>
              ) : addresses.length === 0 ? (
                <div className="mt-4 rounded-2xl border border-dashed border-amber-300 bg-amber-50/60 p-5 text-center">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <MapPin size={22} />
                  </div>
                  <h3 className="mt-2.5 text-xs font-black text-amber-900 sm:text-sm">
                    No Delivery Address Selected
                  </h3>
                  <p className="mx-auto mt-1 max-w-sm text-[11px] leading-5 text-amber-800">
                    You must add a delivery address before placing your order.
                  </p>
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(true)}
                    className="
                      mt-3.5
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      bg-amber-600
                      px-4
                      py-2.5
                      text-xs
                      font-black
                      text-white
                      shadow-sm
                      transition
                      hover:bg-amber-700
                    "
                  >
                    <Plus size={15} />
                    Add Address Now
                  </button>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`
                          group
                          relative
                          cursor-pointer
                          rounded-2xl
                          border-2
                          p-4
                          transition-all
                          duration-200
                          ${
                            isSelected
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-50)]/40 shadow-sm"
                              : "border-[var(--color-border)] bg-white hover:border-stone-300"
                          }
                        `}
                      >
                        {/* Header: Label & Radio */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`
                                inline-flex
                                items-center
                                gap-1
                                rounded-lg
                                px-2
                                py-0.5
                                text-[10px]
                                font-black
                                uppercase
                                tracking-wider
                                ${
                                  addr.label === "Work"
                                    ? "bg-blue-50 text-blue-700"
                                    : addr.label === "Home"
                                    ? "bg-green-50 text-green-700"
                                    : "bg-purple-50 text-purple-700"
                                }
                              `}
                            >
                              {addr.label === "Work" ? (
                                <Briefcase size={11} />
                              ) : addr.label === "Home" ? (
                                <Home size={11} />
                              ) : (
                                <Building size={11} />
                              )}
                              {addr.label}
                            </span>
                            {addr.is_default && (
                              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-bold text-stone-600">
                                Default
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleDeleteAddress(addr.id, e)}
                              aria-label="Delete address"
                              className="text-stone-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                            >
                              <Trash2 size={13} />
                            </button>

                            <div
                              className={`
                                flex
                                h-5
                                w-5
                                items-center
                                justify-center
                                rounded-full
                                border-2
                                transition
                                ${
                                  isSelected
                                    ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                                    : "border-stone-300 bg-white"
                                }
                              `}
                            >
                              {isSelected && <Check size={11} strokeWidth={3.5} />}
                            </div>
                          </div>
                        </div>

                        {/* Receiver details */}
                        <div className="mt-2.5">
                          <p className="text-xs font-black text-[var(--color-text-primary)]">
                            {addr.receiver_name}
                          </p>
                          <p className="text-[11px] font-bold text-[var(--color-text-secondary)]">
                            {addr.phone_number}
                          </p>
                        </div>

                        {/* Full address string */}
                        <p className="mt-1 text-[11px] leading-4.5 text-[var(--color-text-muted)] line-clamp-2">
                          {addr.house_number}
                          {addr.building_name ? `, ${addr.building_name}` : ""}
                          {addr.landmark ? `, Near ${addr.landmark}` : ""}
                          {`, ${addr.formatted_address || `${addr.city}, ${addr.state} - ${addr.pincode}`}`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* CART ITEMS HEADER */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-black text-[var(--color-text-primary)] sm:text-lg">
                  Cart Items ({items.length})
                </h2>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Persistent authenticated cart saved in database
                </p>
              </div>

              <button
                type="button"
                onClick={handleClearCart}
                disabled={isClearing}
                className="
                  flex
                  items-center
                  gap-1.5
                  rounded-full
                  px-3.5
                  py-2
                  text-[11px]
                  font-bold
                  text-[var(--color-error)]
                  transition
                  hover:bg-red-50
                  disabled:opacity-50
                "
              >
                <Trash2 size={13} />
                {isClearing ? "Clearing..." : "Clear Cart"}
              </button>
            </div>

            {/* CART ITEMS LIST */}
            <div className="space-y-3.5">
              {items.map((it) => {
                const isItemUpdating = updatingId === it.id;
                const isItemDeleting = deletingId === it.id;

                return (
                  <article
                    key={it.id}
                    className={`
                      overflow-hidden
                      rounded-2xl
                      border
                      border-[var(--color-border)]
                      bg-white
                      p-4
                      shadow-sm
                      transition-all
                      duration-200
                      hover:shadow-md
                      ${it.isOutOfStock ? "opacity-60 grayscale" : ""}
                    `}
                  >
                    <div className="flex gap-4">
                      {/* Product Thumbnail */}
                      <Link
                        href={`/product/${it.id}`}
                        className="
                          group
                          relative
                          h-24
                          w-24
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          bg-stone-100
                          sm:h-28
                          sm:w-28
                        "
                      >
                        <img
                          src={it.img || "/images/placeholder.png"}
                          alt={it.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        {it.isOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-[9px] font-black text-white uppercase">
                            Out of Stock
                          </div>
                        )}
                      </Link>

                      {/* Product Info */}
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <Link
                                href={`/product/${it.id}`}
                                className="line-clamp-1 text-sm font-black text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition sm:text-base"
                              >
                                {it.name}
                              </Link>
                              <p className="mt-0.5 text-[10px] font-medium text-[var(--color-text-muted)] capitalize">
                                {it.category_name}
                              </p>
                            </div>

                            {/* Item Price */}
                            <div className="shrink-0 text-right">
                              <p className="text-base font-black text-[var(--color-text-primary)]">
                                ₹{formatRupee(it.itemTotal)}
                              </p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">
                                ₹{formatRupee(it.price)} each
                              </p>
                            </div>
                          </div>

                          {/* Stock Warnings & Badges */}
                          {it.isMadeToOrder ? (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-orange-50 px-2.5 py-1 text-[11px] font-bold text-orange-700">
                              <Sparkles size={13} className="text-orange-500 shrink-0" />
                              <span>Freshly Made to Order — prepared hot on demand</span>
                            </div>
                          ) : it.isOutOfStock ? (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                              <AlertTriangle size={13} className="shrink-0" />
                              This item is currently out of stock. Please remove it to place your order.
                            </div>
                          ) : it.exceedsStock ? (
                            <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                              <AlertTriangle size={13} className="shrink-0" />
                              Only {it.stock} item(s) available in stock. Please decrease quantity.
                            </div>
                          ) : it.quantity >= it.stock && it.stock > 0 ? (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-[var(--color-primary)]">
                              <Check size={13} />
                              Maximum stock reached ({it.stock} items).
                            </div>
                          ) : it.stock <= 5 ? (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-bold text-amber-600">
                              <Clock3 size={12} />
                              Only {it.stock} left in stock — order soon!
                            </div>
                          ) : null}
                        </div>

                        {/* Controls: Stepper & Remove */}
                        <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-1.5 rounded-full bg-[var(--color-primary-50)] p-1 ring-1 ring-[var(--color-primary)]/10">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={isItemUpdating || isItemDeleting}
                              onClick={() => handleUpdateQty(it.id, it.quantity - 1, it.stock, it.isMadeToOrder)}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-[var(--color-primary)]
                                shadow-sm
                                transition
                                hover:bg-red-50
                                hover:text-red-500
                                disabled:opacity-40
                                active:scale-90
                              "
                            >
                              {it.quantity === 1 ? (
                                <Trash2 size={12} />
                              ) : (
                                <Minus size={12} strokeWidth={3} />
                              )}
                            </button>

                            <span className="min-w-[28px] text-center text-xs font-black text-[var(--color-primary)]">
                              {isItemUpdating ? (
                                <LoaderCircle size={12} className="mx-auto animate-spin" />
                              ) : (
                                it.quantity
                              )}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              title={!it.isMadeToOrder && it.quantity >= it.stock ? `Only ${it.stock} items available` : "Increase quantity"}
                              disabled={isItemUpdating || isItemDeleting || (!it.isMadeToOrder && it.quantity >= it.stock) || it.isOutOfStock}
                              onClick={() => handleUpdateQty(it.id, it.quantity + 1, it.stock, it.isMadeToOrder)}
                              className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                bg-[var(--color-primary)]
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[var(--color-primary-dark)]
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                                active:scale-90
                              "
                            >
                              <Plus size={12} strokeWidth={3} />
                            </button>
                          </div>

                          {/* Delete Item Action */}
                          <button
                            type="button"
                            disabled={isItemDeleting}
                            onClick={() => handleDeleteItem(it.id)}
                            className="
                              flex
                              items-center
                              gap-1.5
                              rounded-xl
                              px-3
                              py-1.5
                              text-[11px]
                              font-bold
                              text-[var(--color-text-muted)]
                              transition
                              hover:bg-red-50
                              hover:text-red-600
                              disabled:opacity-50
                            "
                          >
                            <Trash2 size={14} />
                            <span>{isItemDeleting ? "Removing..." : "Remove"}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* BENEFITS CARD */}
            <div className="mt-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-primary-50)] p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--color-primary)] shadow-sm">
                  <Sparkles size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-[var(--color-text-primary)]">
                    Delicious & Freshly Made
                  </p>
                  <p className="mt-0.5 text-[10px] leading-5 text-[var(--color-text-secondary)]">
                    All items are made to order with authentic ingredients and packed with hygiene standards.
                  </p>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD SELECTION CARD */}
            <div className="mt-5 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4">
                <div className="flex items-center gap-2">
                  <CreditCard size={18} className="text-[var(--color-primary)]" />
                  <h2 className="text-sm font-black text-[var(--color-text-primary)]">
                    Select Payment Method
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  100% Safe & Secure
                </span>
              </div>

              {/* Payment Method Options Grid */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* Cash on Delivery Option */}
                <div
                  onClick={() => setSelectedPaymentMethod("Cash on Delivery")}
                  className={`
                    relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all
                    ${
                      selectedPaymentMethod === "Cash on Delivery"
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-50)]/40 shadow-sm ring-1 ring-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-white hover:border-stone-300"
                    }
                  `}
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Banknote size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-black text-[var(--color-text-primary)]">
                        Cash on Delivery
                      </p>
                      <input
                        type="radio"
                        name="payment_method_choice"
                        checked={selectedPaymentMethod === "Cash on Delivery"}
                        onChange={() => setSelectedPaymentMethod("Cash on Delivery")}
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                      Pay cash or scan on delivery at doorstep
                    </p>
                    {summary.codFee > 0 && selectedPaymentMethod === "Cash on Delivery" && (
                      <span className="mt-2 inline-block rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        + ₹{formatRupee(summary.codFee)} COD fee applies
                      </span>
                    )}
                  </div>
                </div>

                {/* Online Payment Option */}
                <div
                  onClick={() => setSelectedPaymentMethod("Online Payment")}
                  className={`
                    relative flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all
                    ${
                      selectedPaymentMethod === "Online Payment"
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-50)]/40 shadow-sm ring-1 ring-[var(--color-primary)]"
                        : "border-[var(--color-border)] bg-white hover:border-stone-300"
                    }
                  `}
                >
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <QrCode size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-black text-[var(--color-text-primary)]">
                          Online UPI / QR
                        </p>
                        <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-black text-emerald-800">
                          ₹0 COD FEE
                        </span>
                      </div>
                      <input
                        type="radio"
                        name="payment_method_choice"
                        checked={selectedPaymentMethod === "Online Payment"}
                        onChange={() => setSelectedPaymentMethod("Online Payment")}
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
                      Instant payment via GPay, PhonePe, Paytm, QR
                    </p>
                  </div>
                </div>
              </div>

              {/* Online Payment QR & UPI Details (Shown when Online Payment is selected) */}
              {selectedPaymentMethod === "Online Payment" && (
                <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50/40 p-4 sm:p-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    {/* QR Code Scanner Display */}
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-purple-200 bg-white p-4 text-center shadow-sm sm:w-56 shrink-0">
                      <div className="relative flex h-40 w-40 items-center justify-center overflow-hidden rounded-xl bg-white p-2 border border-stone-200">
                        {paymentQr?.qr_code_url ? (
                          <img
                            src={`${API_ORIGIN}${paymentQr.qr_code_url}`}
                            alt="Scan & Pay QR Code"
                            className="h-full w-full object-contain"
                          />
                        ) : (
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                              `upi://pay?pa=${paymentQr?.upi_id || "sfccafe@upi"}&pn=${encodeURIComponent(
                                paymentQr?.merchant_name || "SFC Cafe"
                              )}&am=${summary.grandTotal}&cu=INR&tn=Order%20Payment`
                            )}`}
                            alt="Scan & Pay QR Code"
                            className="h-full w-full object-contain"
                          />
                        )}
                      </div>
                      <p className="mt-2 text-[11px] font-black text-purple-900">
                        Scan with Any UPI App
                      </p>
                      <p className="text-[10px] text-stone-500">
                        {paymentQr?.merchant_name || "SFC Cafe"}
                      </p>
                    </div>

                    {/* Payable Details & Quick UPI Apps */}
                    <div className="flex-1 min-w-0">
                      {/* Amount Banner */}
                      <div className="rounded-xl bg-white p-3 border border-purple-200 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                            Payable Amount
                          </p>
                          <p className="text-xl font-black text-[var(--color-text-primary)]">
                            ₹{formatRupee(summary.grandTotal)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-semibold text-emerald-600">
                            ✓ COD Fee Waived (₹0)
                          </p>
                        </div>
                      </div>

                      {/* UPI ID with Copy Button */}
                      <div className="mt-3 flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 border border-stone-200">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold text-stone-400 uppercase">UPI VPA</p>
                          <p className="text-xs font-bold text-stone-800 truncate font-mono">
                            {paymentQr?.upi_id || "sfccafe@upi"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(paymentQr?.upi_id || "sfccafe@upi");
                            toast.success("UPI ID copied to clipboard!");
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 text-[10px] font-bold text-stone-700 hover:bg-stone-200 transition"
                        >
                          <Copy size={11} /> Copy
                        </button>
                      </div>

                      {/* Quick UPI App Launch Buttons */}
                      <div className="mt-3">
                        <p className="text-[10px] font-bold text-stone-600 mb-1.5">
                          Tap to pay with your preferred app:
                        </p>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {[
                            { name: "Google Pay", color: "bg-blue-50 text-blue-700 border-blue-200" },
                            { name: "PhonePe", color: "bg-purple-50 text-purple-700 border-purple-200" },
                            { name: "Paytm", color: "bg-sky-50 text-sky-700 border-sky-200" },
                            { name: "BHIM / Other", color: "bg-stone-50 text-stone-700 border-stone-200" },
                          ].map((app) => {
                            const upiUrl = `upi://pay?pa=${paymentQr?.upi_id || "sfccafe@upi"}&pn=${encodeURIComponent(
                              paymentQr?.merchant_name || "SFC Cafe"
                            )}&am=${summary.grandTotal}&cu=INR&tn=Order%20Payment`;
                            return (
                              <a
                                key={app.name}
                                href={upiUrl}
                                onClick={() => setSelectedUpiApp(app.name)}
                                className={`flex items-center justify-center gap-1 rounded-xl border p-2 text-[10px] font-bold shadow-sm transition hover:scale-105 active:scale-95 text-center ${app.color}`}
                              >
                                <span>{app.name}</span>
                                <ExternalLink size={10} />
                              </a>
                            );
                          })}
                        </div>
                      </div>

                      {/* 1-Click Pay Guidance Note */}
                      <div className="mt-3.5 rounded-xl bg-purple-100/60 p-2.5 text-[11px] font-semibold text-purple-900 border border-purple-200">
                        ⚡ <b>1-Click UPI Payment:</b> Once you click "Place Order", your chosen UPI app will open directly with the exact order amount (<b>₹{formatRupee(summary.grandTotal)}</b>) pre-filled.
                      </div>
                    </div>
                  </div>

                  {paymentQr?.instructions && (
                    <p className="mt-3 border-t border-purple-200/60 pt-2 text-[10px] text-purple-900 leading-relaxed">
                      ℹ️ <b>Instructions:</b> {paymentQr.instructions}
                    </p>
                  )}
                </div>
              )}
            </div>
          </section>

          {/* FLIPKART-STYLE PRICE DETAILS SIDEBAR */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-sm">
              {/* Header */}
              <div className="border-b border-[var(--color-border)] p-5">
                <h2 className="text-xs font-black uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                  Price Details
                </h2>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 p-5">
                {/* Item Total */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)]">
                    Item Total ({summary.totalItems} item{summary.totalItems === 1 ? "" : "s"})
                  </span>
                  <span className="font-bold text-[var(--color-text-primary)]">
                    ₹{formatRupee(summary.subtotal)}
                  </span>
                </div>

                {/* Discount */}
                {summary.discount > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)] flex items-center gap-1.5">
                      <span>Discount</span>
                      {summary.discountPercent > 0 && (
                        <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-700">
                          {summary.discountPercent}% OFF
                        </span>
                      )}
                    </span>
                    <span className="font-bold text-emerald-600">
                      - ₹{formatRupee(summary.discount)}
                    </span>
                  </div>
                )}

                {/* Delivery Charges */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-text-secondary)] flex items-center gap-1">
                    <span>Delivery Charge</span>
                    {summary.distanceKm != null && (
                      <span className="text-[10px] text-stone-400 font-medium">
                        ({summary.distanceKm} km)
                      </span>
                    )}
                  </span>
                  {summary.isFreeDelivery ? (
                    <span className="font-bold text-emerald-600 flex items-center gap-1">
                      {summary.freeDeliverySavings > 0 && (
                        <span className="text-[11px] text-stone-400 line-through">
                          ₹{formatRupee(summary.freeDeliverySavings)}
                        </span>
                      )}
                      <span>FREE</span>
                    </span>
                  ) : summary.deliveryFee > 0 ? (
                    <span className="font-bold text-[var(--color-text-primary)]">
                      ₹{formatRupee(summary.deliveryFee)}
                    </span>
                  ) : (
                    <span className="font-bold text-emerald-600">FREE</span>
                  )}
                </div>

                {/* Taxes (GST) */}
                {summary.taxInclusive ? (
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>GST ({summary.gstPercent}%)</span>
                    <span className="font-semibold text-stone-600">
                      ₹{formatRupee(summary.taxAmount)} (Included)
                    </span>
                  </div>
                ) : summary.taxAddedToTotal > 0 ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Taxes & Charges (GST {summary.gstPercent}%)
                    </span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      + ₹{formatRupee(summary.taxAddedToTotal)}
                    </span>
                  </div>
                ) : null}

                {/* Packaging Fee */}
                {summary.packagingFee > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Packaging Fee
                    </span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      ₹{formatRupee(summary.packagingFee)}
                    </span>
                  </div>
                )}

                {/* Platform Fee */}
                {summary.platformFee > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Platform Fee
                    </span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      ₹{formatRupee(summary.platformFee)}
                    </span>
                  </div>
                )}

                {/* COD Fee */}
                {summary.codFee > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Cash on Delivery Fee
                    </span>
                    <span className="font-bold text-[var(--color-text-primary)]">
                      ₹{formatRupee(summary.codFee)}
                    </span>
                  </div>
                )}

                {/* Free Delivery Goal Prompt */}
                {!summary.isFreeDelivery && summary.freeDeliveryShortfall > 0 && (
                  <div className="rounded-xl bg-amber-50 p-2.5 text-[11px] font-bold text-amber-800 border border-amber-200">
                    🎁 Add items worth ₹{formatRupee(summary.freeDeliveryShortfall)} more to get <b>FREE Delivery</b>!
                  </div>
                )}

                {/* Minimum Order Warning */}
                {summary.isBelowMinimumOrder && (
                  <div className="rounded-xl bg-red-50 p-2.5 text-[11px] font-bold text-red-700 border border-red-200 flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>
                      Minimum order amount is ₹{formatRupee(summary.minimumOrderAmount)}. Please add ₹{formatRupee(summary.minimumOrderShortfall)} more to proceed.
                    </span>
                  </div>
                )}

                {/* Out of Delivery Radius Warning */}
                {summary.isOutOfRange && (
                  <div className="rounded-xl bg-red-50 p-2.5 text-[11px] font-bold text-red-700 border border-red-200 flex items-start gap-2">
                    <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                    <span>
                      Delivery address ({summary.distanceKm} km) exceeds our maximum service radius of {summary.maxDeliveryDistance} km.
                    </span>
                  </div>
                )}

                {/* Total Amount */}
                <div className="border-t border-dashed border-[var(--color-border)] pt-4">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                        Total Amount
                      </p>
                      <p className="mt-1 text-2xl font-black text-[var(--color-text-primary)]">
                        ₹{formatRupee(summary.grandTotal)}
                      </p>
                    </div>
                    <span className="pb-1 text-[10px] font-bold text-[var(--color-success)]">
                      Safe Payment
                    </span>
                  </div>
                </div>

                {/* SELECTED DELIVERY ADDRESS SUMMARY IN SIDEBAR */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-stone-50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-[var(--color-text-primary)]">
                      <MapPin size={14} className="text-[var(--color-primary)]" />
                      <span>Deliver to</span>
                    </div>

                    {selectedAddress ? (
                      <button
                        type="button"
                        onClick={() => setAddressModalOpen(true)}
                        className="text-[11px] font-bold text-[var(--color-primary)] hover:underline"
                      >
                        + Add New
                      </button>
                    ) : null}
                  </div>

                  {selectedAddress ? (
                    <div className="mt-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[var(--color-text-primary)]">
                          {selectedAddress.receiver_name}
                        </span>
                        <span className="rounded bg-[var(--color-primary-50)] px-1.5 py-0.5 text-[9px] font-black text-[var(--color-primary)]">
                          {selectedAddress.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-[var(--color-text-muted)]">
                        {selectedAddress.phone_number}
                      </p>
                      <p className="mt-1 text-[11px] text-[var(--color-text-secondary)] line-clamp-2">
                        {selectedAddress.house_number}, {selectedAddress.formatted_address || `${selectedAddress.city} - ${selectedAddress.pincode}`}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-2 text-center">
                      <p className="text-[11px] font-bold text-amber-700">
                        ⚠️ No delivery address selected
                      </p>
                      <button
                        type="button"
                        onClick={() => setAddressModalOpen(true)}
                        className="mt-2 inline-flex items-center gap-1 rounded-xl bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-bold text-white shadow-sm hover:bg-[var(--color-primary-dark)]"
                      >
                        <Plus size={13} />
                        Add Address
                      </button>
                    </div>
                  )}
                </div>

                {summary.hasOutOfStockItems && (
                  <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-[11px] font-bold text-red-600">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>Please remove or adjust out-of-stock items before checkout.</span>
                  </div>
                )}

                {/* Checkout Button */}
                <button
                  type="button"
                  disabled={
                    summary.hasOutOfStockItems ||
                    summary.isBelowMinimumOrder ||
                    summary.isOutOfRange ||
                    isPlacingOrder ||
                    items.length === 0 ||
                    !selectedAddress
                  }
                  onClick={handleCheckout}
                  className="
                    flex
                    h-13
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[var(--color-primary)]
                    px-5
                    py-3.5
                    text-xs
                    font-black
                    text-white
                    shadow-lg
                    shadow-[var(--color-primary)]/25
                    transition-all
                    hover:bg-[var(--color-primary-dark)]
                    hover:shadow-xl
                    active:scale-[0.98]
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <span>
                    {isPlacingOrder
                      ? "Placing Order..."
                      : summary.hasOutOfStockItems
                      ? "Resolve Stock Issues"
                      : summary.isBelowMinimumOrder
                      ? `Min Order ₹${summary.minimumOrderAmount}`
                      : summary.isOutOfRange
                      ? "Out of Delivery Range"
                      : !selectedAddress
                      ? "Select Delivery Address"
                      : selectedPaymentMethod === "Online Payment"
                      ? "Place Order & Pay Online"
                      : "Place Order (Cash on Delivery)"}
                  </span>
                  {isPlacingOrder ? (
                    <LoaderCircle size={16} className="animate-spin" />
                  ) : (
                    <ArrowRight size={16} />
                  )}
                </button>
              </div>

              {/* Secure guarantee badge */}
              <div className="border-t border-[var(--color-border)] bg-stone-50 p-4 text-center">
                <p className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-[var(--color-text-muted)]">
                  <ShieldCheck size={16} className="text-[var(--color-primary)]" />
                  Safe and Secure Payments • 100% Authentic Food
                </p>
              </div>
            </div>

            {/* Quick delivery cards */}
            <div className="mt-3.5 grid grid-cols-2 gap-2">
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Clock3 size={15} />
                </div>
                <p className="mt-2 text-[10px] font-black text-[var(--color-text-primary)]">
                  Quick Service
                </p>
                <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                  Freshly cooked on order
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <Truck size={15} />
                </div>
                <p className="mt-2 text-[10px] font-black text-[var(--color-text-primary)]">
                  Carefully Packed
                </p>
                <p className="mt-0.5 text-[9px] text-[var(--color-text-muted)]">
                  Ready to serve hot
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* =========================================================
          ADD NEW ADDRESS MODAL
      ========================================================= */}
      {addressModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setAddressModalOpen(false)}
        >
          <div
            className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--color-text-primary)] sm:text-base">
                    Add Delivery Address
                  </h3>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Enter complete details for doorstep delivery
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAddressModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveAddress} className="max-h-[75vh] overflow-y-auto p-6 space-y-4">
              {/* Address Label Selector */}
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5">
                  Address Type / Label *
                </label>
                <div className="flex gap-2">
                  {[
                    { label: "Home", icon: Home },
                    { label: "Work", icon: Briefcase },
                    { label: "Other", icon: Building },
                  ].map((t) => {
                    const Icon = t.icon;
                    const isSelected = addressForm.label === t.label;
                    return (
                      <button
                        key={t.label}
                        type="button"
                        onClick={() => setAddressForm({ ...addressForm, label: t.label })}
                        className={`
                          flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-bold transition
                          ${
                            isSelected
                              ? "border-[var(--color-primary)] bg-[var(--color-primary-50)] text-[var(--color-primary)]"
                              : "border-[var(--color-border)] bg-stone-50 text-[var(--color-text-secondary)] hover:border-stone-300"
                          }
                        `}
                      >
                        <Icon size={14} />
                        <span>{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Receiver Details */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                    Receiver's Name *
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={addressForm.receiver_name}
                      onChange={(e) => setAddressForm({ ...addressForm, receiver_name: e.target.value })}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                    10-Digit Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={addressForm.phone_number}
                      onChange={(e) => setAddressForm({ ...addressForm, phone_number: e.target.value.replace(/\D/g, "") })}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 py-2.5 pl-10 pr-3.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                    />
                  </div>
                </div>
              </div>

              {/* Flat / House No */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                    Flat / House No. / Room No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302 / House 12"
                    value={addressForm.house_number}
                    onChange={(e) => setAddressForm({ ...addressForm, house_number: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                    Building / Apartment Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Green Heights"
                    value={addressForm.building_name}
                    onChange={(e) => setAddressForm({ ...addressForm, building_name: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Area / Street & Landmark */}
              <div>
                <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                  Street / Area / Sector / Locality *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Malviya Nagar, Sector 4, Near Apex Mall"
                  value={addressForm.formatted_address}
                  onChange={(e) => setAddressForm({ ...addressForm, formatted_address: e.target.value })}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition resize-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Water Tank"
                    value={addressForm.landmark}
                    onChange={(e) => setAddressForm({ ...addressForm, landmark: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[var(--color-text-secondary)] block mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 302017"
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value.replace(/\D/g, "") })}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/50 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Make Default Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                  className="h-4 w-4 rounded text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <span className="text-xs font-bold text-[var(--color-text-secondary)]">
                  Set as default delivery address
                </span>
              </label>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingAddress}
                  className="
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    bg-[var(--color-primary)]
                    text-xs
                    font-black
                    text-white
                    shadow-lg
                    shadow-[var(--color-primary)]/25
                    transition
                    hover:bg-[var(--color-primary-dark)]
                    disabled:opacity-50
                  "
                >
                  {isSavingAddress ? (
                    <>
                      <LoaderCircle size={16} className="animate-spin" />
                      <span>Saving Address...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Save & Deliver Here</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
