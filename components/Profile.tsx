"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Pencil,
  ShoppingBag,
  Heart,
  Bell,
  LogOut,
  ChevronRight,
  Camera,
  ShieldCheck,
  LoaderCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

import { useUpdateProfileMutation } from "@/redux/services/authApi";
import { setCredentials } from "@/redux/features/authSlice";
import { updateProfileSchema } from "@/schemas/authSchema";

type ProfileFormValues = z.infer<typeof updateProfileSchema>;

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
const assetOrigin = new URL(apiUrl).origin;

const toAssetUrl = (path?: string | null) => {
  if (!path || /^https?:\/\//i.test(path)) return path || "";
  return `${assetOrigin}${path.startsWith("/") ? path : `/${path}`}`;
};

export default function Profile() {
  const dispatch = useDispatch();
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const user = useSelector((state: { auth: { user: any | null } }) => state.auth.user);
  const [updateProfile, { isLoading: isSaving }] = useUpdateProfileMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user, reset]);

  const handleCancel = () => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setEditing(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("name", user?.name || "");
    if (user?.email) formData.append("email", user.email);
    if (user?.phone) formData.append("phone", user.phone);

    try {
      setIsUploadingImage(true);
      const response = await updateProfile(formData).unwrap();
      if (response?.user) {
        dispatch(setCredentials(response));
      }
      toast.success("Profile photo updated successfully!");
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        (err?.data?.errors && Object.values(err.data.errors)[0]) ||
        "Failed to upload profile photo.";
      toast.error(typeof msg === "string" ? msg : "Failed to upload photo");
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const response = await updateProfile({
        name: data.name.trim(),
        email: data.email?.trim() || null,
        phone: data.phone?.trim() || null,
      }).unwrap();

      if (response?.user) {
        dispatch(setCredentials(response));
      }
      toast.success(response?.message || "Profile updated successfully!");
      setEditing(false);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        (err?.data?.errors && Object.values(err.data.errors)[0]) ||
        "Failed to update profile. Please try again.";
      toast.error(typeof msg === "string" ? msg : "Failed to update profile");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-body)]">

      <section className="bg-[var(--color-primary-dark)]">

        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 md:py-14">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* User */}

            <div className="flex items-center gap-4">

              <div className="relative">

                <div
                  className="
                    flex
                    h-20
                    w-20
                    overflow-hidden
                    items-center
                    justify-center
                    rounded-[1.5rem]
                    bg-[var(--color-primary)]
                    text-white
                    shadow-xl
                    sm:h-24
                    sm:w-24
                  "
                >
                  {user?.image ? (
                    <img
                      src={toAssetUrl(user.image)}
                      alt={user?.name || "Profile photo"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User size={38} strokeWidth={1.8} />
                  )}
                  {isUploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-[1.5rem]">
                      <LoaderCircle size={24} className="animate-spin text-white" />
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  aria-label="Upload profile image"
                  className="
                    absolute
                    -bottom-2
                    -right-2
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    border-2
                    border-[var(--color-chocolate-dark)]
                    bg-white
                    text-[var(--color-primary)]
                    shadow-md
                    transition
                    hover:scale-105
                    active:scale-95
                  "
                >
                  <Camera size={14} />
                </button>

              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary-50)]">
                  My Account
                </p>

                <h1 className="mt-1 text-2xl font-black text-white sm:text-3xl">
                  {user?.name}
                </h1>

                <div className="mt-2 flex flex-wrap items-center gap-2.5">
                  <p className="text-xs text-white/80">
                    Welcome back to SFC Cafe 👋
                  </p>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-lg
                      bg-white/20
                      px-2.5
                      py-1
                      text-[10px]
                      font-bold
                      text-white
                      backdrop-blur-sm
                      transition
                      hover:bg-white/30
                      active:scale-95
                    "
                  >
                    <Camera size={12} />
                    {isUploadingImage ? "Uploading..." : user?.image ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>

              </div>

            </div>


            <Link
              href="/menu"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-2xl
                bg-[var(--color-primary)]
                px-5
                py-3
                text-xs
                font-bold
                shadow-lg
                transition
                hover:-translate-y-0.5
                hover:bg-[var(--color-primary-dark)]
              "
              style={{color: "white"}}
            >
              Order Something
              <ShoppingBag size={15} />
            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-5 py-8 sm:px-8 md:py-12">

        <div className="grid gap-6 lg:grid-cols-3">

          {/* =====================================================
              LEFT - PROFILE INFORMATION
          ===================================================== */}

          <div className="lg:col-span-2">

            <div
              className="
                overflow-hidden
                rounded-[2rem]
                border
                border-[var(--color-border)]
                bg-white
                shadow-sm
              "
            >

              {/* Header */}

              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5 sm:px-8">

                <div>

                  <h2 className="text-lg font-black text-[var(--color-text-primary)]">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                    Manage your account details
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (editing) {
                      handleCancel();
                    } else {
                      setEditing(true);
                    }
                  }}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[var(--color-primary-50)]
                    px-3
                    py-2
                    text-xs
                    font-bold
                    text-[var(--color-primary)]
                    transition
                    hover:bg-[var(--color-primary)]
                    hover:text-white
                  "
                >
                  <Pencil size={14} />

                  {editing ? "Cancel" : "Edit"}
                </button>

              </div>

              {/* Form */}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6 sm:p-8">

                {/* Profile Photo Row */}
                <div className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--bg-body)] p-4">
                  <div className="flex items-center gap-3.5">
                    <div className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[var(--color-primary)] text-white shadow-sm">
                      {user?.image ? (
                        <img
                          src={toAssetUrl(user.image)}
                          alt={user?.name || "Profile"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={22} />
                      )}
                      {isUploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <LoaderCircle size={18} className="animate-spin text-white" />
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-primary)]">
                        Profile Photo
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)]">
                        Upload JPEG, PNG or WEBP (Max 10MB)
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-xl
                      border
                      border-[var(--color-border)]
                      bg-white
                      px-3.5
                      py-2
                      text-xs
                      font-bold
                      text-[var(--color-primary)]
                      shadow-sm
                      transition
                      hover:bg-[var(--color-primary-50)]
                      active:scale-95
                      disabled:opacity-70
                    "
                  >
                    <Camera size={13} />
                    {isUploadingImage ? "Uploading..." : user?.image ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>

                {/* Name */}

                <div>

                  <label
                    htmlFor="name"
                    className="mb-2 block text-xs font-bold text-[var(--color-text-primary)]"
                  >
                    Full Name
                  </label>

                  <div className="relative">

                    <User
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[var(--color-text-muted)]
                      "
                    />

                    <input
                      id="name"
                      {...register("name")}
                      disabled={!editing || isSaving}
                      placeholder="Your full name"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--bg-body)]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        font-medium
                        text-[var(--color-text-primary)]
                        outline-none
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />

                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.name.message}
                    </p>
                  )}

                </div>

                {/* Email */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2 block text-xs font-bold text-[var(--color-text-primary)]"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    <Mail
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[var(--color-text-muted)]
                      "
                    />

                    <input
                      id="email"
                      type="email"
                      {...register("email")}
                      disabled={!editing || isSaving}
                      placeholder="name@example.com"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--bg-body)]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-[var(--color-text-primary)]
                        outline-none
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />

                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.email.message}
                    </p>
                  )}

                </div>

                {/* Phone */}

                <div>

                  <label
                    htmlFor="phone"
                    className="mb-2 block text-xs font-bold text-[var(--color-text-primary)]"
                  >
                    Phone Number
                  </label>

                  <div className="relative">

                    <Phone
                      size={17}
                      className="
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-[var(--color-text-muted)]
                      "
                    />

                    <input
                      id="phone"
                      type="tel"
                      {...register("phone")}
                      disabled={!editing || isSaving}
                      placeholder="10-digit mobile number"
                      className="
                        w-full
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-[var(--bg-body)]
                        py-3
                        pl-11
                        pr-4
                        text-sm
                        text-[var(--color-text-primary)]
                        outline-none
                        transition
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                        focus:border-[var(--color-primary)]
                        focus:ring-2
                        focus:ring-[var(--color-primary)]/10
                      "
                    />

                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500 font-medium">
                      {errors.phone.message}
                    </p>
                  )}

                </div>

                {/* Save & Cancel */}

                {editing && (
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-[var(--color-primary)]
                        px-6
                        py-3
                        text-xs
                        font-bold
                        text-white
                        shadow-md
                        transition
                        hover:bg-[var(--color-primary-dark)]
                        active:scale-95
                        disabled:cursor-not-allowed
                        disabled:opacity-70
                      "
                    >
                      {isSaving ? (
                        <>
                          <LoaderCircle size={15} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleCancel}
                      className="
                        rounded-xl
                        border
                        border-[var(--color-border)]
                        bg-white
                        px-5
                        py-3
                        text-xs
                        font-bold
                        text-[var(--color-text-secondary)]
                        shadow-sm
                        transition
                        hover:bg-[var(--bg-body)]
                        active:scale-95
                        disabled:opacity-70
                      "
                    >
                      Cancel
                    </button>
                  </div>
                )}

              </form>

            </div>

          </div>


          <div className="space-y-4">

            <h2 className="px-1 text-sm font-black text-[var(--color-text-primary)]">
              Quick Access
            </h2>

            {/* Orders */}

            <Link
              href="/orders"
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <ShoppingBag size={19} />
              </div>

              <div className="flex-1">

                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  My Orders
                </p>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  View your order history
                </p>

              </div>

              <ChevronRight
                size={17}
                className="text-[var(--color-text-muted)] transition group-hover:translate-x-1"
              />

            </Link>

            {/* Favorites */}

            <Link
              href="/favorites"
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <Heart size={19} />
              </div>

              <div className="flex-1">

                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  Favorites
                </p>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Your favorite food items
                </p>

              </div>

              <ChevronRight
                size={17}
                className="text-[var(--color-text-muted)] transition group-hover:translate-x-1"
              />

            </Link>

            {/* Notifications */}

            <Link
              href="/notifications"
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-[var(--color-border)]
                bg-white
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >

              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <Bell size={19} />
              </div>

              <div className="flex-1">

                <p className="text-xs font-black text-[var(--color-text-primary)]">
                  Notifications
                </p>

                <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                  Offers and order updates
                </p>

              </div>

              <ChevronRight
                size={17}
                className="text-[var(--color-text-muted)] transition group-hover:translate-x-1"
              />

            </Link>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8 sm:px-8">

        <div
          className="
            rounded-[2rem]
            border
            border-[var(--color-border)]
            bg-white
            p-6
            shadow-sm
            sm:p-8
          "
        >

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-[var(--color-primary-50)]
                  text-[var(--color-primary)]
                "
              >
                <MapPin size={21} />
              </div>

              <div>

                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Delivery Address
                </p>

                <h3 className="mt-1 text-sm font-black text-[var(--color-text-primary)]">
                  Home
                </h3>

                <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                  Jaipur, Rajasthan, India
                </p>

              </div>

            </div>

            <button
              type="button"
              className="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-[var(--color-border)]
                px-4
                py-2.5
                text-xs
                font-bold
                text-[var(--color-primary)]
                transition
                hover:bg-[var(--color-primary-50)]
              "
            >
              <Pencil size={14} />
              Manage Address
            </button>

          </div>

        </div>

      </section>

      <section className="mx-auto max-w-6xl px-5 pb-14 sm:px-8">

        <div
          className="
            flex
            flex-col
            gap-4
            rounded-[2rem]
            border
            border-red-100
            bg-red-50/50
            p-6
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-xl
                bg-red-100
                text-red-500
              "
            >
              <LogOut size={18} />
            </div>

            <div>

              <p className="text-xs font-black text-[var(--color-text-primary)]">
                Sign out of your account
              </p>

              <p className="mt-1 text-[10px] text-[var(--color-text-muted)]">
                You can sign back in anytime.
              </p>

            </div>

          </div>

          <Link
            href="/logout"
            className="
              inline-flex
              items-center
              justify-center
              rounded-xl
              bg-red-500
              px-5
              py-2.5
              text-xs
              font-bold
              text-white
              transition
              hover:bg-red-600
              active:scale-95
            "
          >
            Logout
          </Link>

        </div>

      </section>

    </div>
  );
}