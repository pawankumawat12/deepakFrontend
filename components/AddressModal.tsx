"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  MapPin,
  Home,
  Briefcase,
  Building,
  User,
  Phone,
  Check,
  LoaderCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  Address,
  CreateAddressPayload,
  useCreateAddressMutation,
  useUpdateAddressMutation,
} from "@/redux/services/addressApi";

interface AddressModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: Address | null;
  defaultUserName?: string;
  defaultUserPhone?: string;
  onSuccess?: (address: Address) => void;
}

export default function AddressModal({
  open,
  onClose,
  initialData,
  defaultUserName = "",
  defaultUserPhone = "",
  onSuccess,
}: AddressModalProps) {
  const [createAddress, { isLoading: isCreating }] = useCreateAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();
  const isSaving = isCreating || isUpdating;

  const [label, setLabel] = useState<string>("Home");
  const [customLabel, setCustomLabel] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [houseNumber, setHouseNumber] = useState<string>("");
  const [buildingName, setBuildingName] = useState<string>("");
  const [floor, setFloor] = useState<string>("");
  const [formattedAddress, setFormattedAddress] = useState<string>("");
  const [landmark, setLandmark] = useState<string>("");
  const [city, setCity] = useState<string>("Jaipur");
  const [state, setState] = useState<string>("Rajasthan");
  const [pincode, setPincode] = useState<string>("");
  const [isDefault, setIsDefault] = useState<boolean>(false);

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode
        const isStandard = ["Home", "Work"].includes(initialData.label);
        setLabel(isStandard ? initialData.label : "Other");
        setCustomLabel(isStandard ? "" : initialData.label === "Other" ? "" : initialData.label);
        setReceiverName(initialData.receiver_name || "");
        setPhoneNumber(initialData.phone_number || "");
        setHouseNumber(initialData.house_number || "");
        setBuildingName(initialData.building_name || "");
        setFloor(initialData.floor || "");
        setFormattedAddress(initialData.formatted_address || "");
        setLandmark(initialData.landmark || "");
        setCity(initialData.city || "Jaipur");
        setState(initialData.state || "Rajasthan");
        setPincode(initialData.pincode || "");
        setIsDefault(Boolean(initialData.is_default));
      } else {
        // Add mode
        setLabel("Home");
        setCustomLabel("");
        setReceiverName(defaultUserName || "");
        setPhoneNumber(defaultUserPhone || "");
        setHouseNumber("");
        setBuildingName("");
        setFloor("");
        setFormattedAddress("");
        setLandmark("");
        setCity("Jaipur");
        setState("Rajasthan");
        setPincode("");
        setIsDefault(false);
      }
    }
  }, [open, initialData, defaultUserName, defaultUserPhone]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!receiverName.trim()) {
      toast.error("Please enter receiver name");
      return;
    }
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    if (!houseNumber.trim()) {
      toast.error("Please enter house / flat / room number");
      return;
    }
    if (!formattedAddress.trim()) {
      toast.error("Please enter street, area or locality");
      return;
    }
    if (!city.trim()) {
      toast.error("Please enter city");
      return;
    }
    if (!pincode.trim() || pincode.trim().length < 6) {
      toast.error("Please enter a valid 6-digit postal pincode");
      return;
    }

    const finalLabel =
      label === "Other" && customLabel.trim() ? customLabel.trim() : label;

    const payload: CreateAddressPayload = {
      label: finalLabel,
      receiver_name: receiverName.trim(),
      phone_number: cleanPhone,
      house_number: houseNumber.trim(),
      building_name: buildingName.trim() || undefined,
      floor: floor.trim() || undefined,
      landmark: landmark.trim() || undefined,
      formatted_address: formattedAddress.trim(),
      city: city.trim() || "Jaipur",
      state: state.trim() || "Rajasthan",
      pincode: pincode.trim(),
      is_default: isDefault,
    };

    try {
      if (initialData?.id) {
        const res = await updateAddress({
          id: initialData.id,
          data: payload,
        }).unwrap();
        toast.success(res?.message || "Address updated successfully!");
        if (res?.data && onSuccess) {
          onSuccess(res.data);
        }
      } else {
        const res = await createAddress(payload).unwrap();
        toast.success(res?.message || "Address saved successfully!");
        if (res?.data && onSuccess) {
          onSuccess(res.data);
        }
      }
      onClose();
    } catch (err: any) {
      const errorMsg =
        err?.data?.message ||
        (err?.data?.errors && Object.values(err.data.errors)[0]) ||
        "Failed to save address. Please try again.";
      toast.error(typeof errorMsg === "string" ? errorMsg : "Error saving address");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-[2rem] border border-[var(--color-border)] bg-white shadow-2xl transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-[var(--color-border)] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary-50)] text-[var(--color-primary)]">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--color-text-primary)] sm:text-lg">
                {initialData ? "Edit Delivery Address" : "Add New Address"}
              </h3>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                {initialData
                  ? "Update your location & receiver details"
                  : "Save complete details for accurate doorstep delivery"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100 hover:text-stone-700 active:scale-95"
          >
            <X size={18} />
          </button>
        </div>

        {/* MODAL FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. SAVE AS / LABEL SELECTION */}
          <div>
            <label className="mb-2 block text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
              Save Address As *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "Home", label: "Home", icon: Home, hint: "Delivery 24/7" },
                { id: "Work", label: "Work", icon: Briefcase, hint: "Office hours" },
                { id: "Other", label: "Other", icon: Building, hint: "Friends / Other" },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = label === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLabel(item.id)}
                    className={`
                      flex flex-col items-center justify-center rounded-2xl border-2 p-3 text-center transition-all duration-150
                      ${
                        isSelected
                          ? "border-[var(--color-primary)] bg-[var(--color-primary-50)] text-[var(--color-primary)] shadow-sm"
                          : "border-[var(--color-border)] bg-stone-50/70 text-[var(--color-text-secondary)] hover:border-stone-300 hover:bg-stone-100"
                      }
                    `}
                  >
                    <Icon size={18} className="mb-1" />
                    <span className="text-xs font-black">{item.label}</span>
                    <span className="text-[9px] opacity-75 font-medium">{item.hint}</span>
                  </button>
                );
              })}
            </div>

            {label === "Other" && (
              <div className="mt-2.5">
                <input
                  type="text"
                  placeholder="Custom label (e.g. Grandma's House, Gym, Farm)"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 px-3.5 py-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                />
              </div>
            )}
          </div>

          {/* 2. RECEIVER DETAILS */}
          <div>
            <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
              Contact Details
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                  Receiver's Full Name *
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 py-2.5 pl-10 pr-3.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                  10-Digit Mobile Number *
                </label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="e.g. 9876543210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 py-2.5 pl-10 pr-3.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. ADDRESS LOCATION DETAILS */}
          <div>
            <p className="mb-2 text-[11px] font-black uppercase tracking-wider text-[var(--color-text-muted)]">
              Address Information
            </p>

            <div className="space-y-3">
              {/* House / Flat / Floor */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                    Flat / House / Room No. *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 304, Tower B"
                    value={houseNumber}
                    onChange={(e) => setHouseNumber(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                    Floor (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3rd Floor / Ground"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Building / Society */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                  Building / Apartment / Society Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Royal Palms Residency"
                  value={buildingName}
                  onChange={(e) => setBuildingName(e.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                />
              </div>

              {/* Street / Locality */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                  Street / Area / Sector / Locality *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. Tonk Road, Near Mahaveer Nagar, Sector 5"
                  value={formattedAddress}
                  onChange={(e) => setFormattedAddress(e.target.value)}
                  className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                />
              </div>

              {/* Landmark, City, State, Pincode */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                    Nearby Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Opposite City Hospital"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="e.g. 302018"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jaipur"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-[var(--color-text-secondary)]">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajasthan"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-stone-50/60 p-2.5 text-xs font-medium text-[var(--color-text-primary)] outline-none focus:border-[var(--color-primary)] focus:bg-white transition"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. DEFAULT ADDRESS TOGGLE */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-stone-50/80 p-3.5">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 rounded text-[var(--color-primary)] accent-[var(--color-primary)] focus:ring-[var(--color-primary)]"
              />
              <div className="flex-1">
                <p className="text-xs font-bold text-[var(--color-text-primary)]">
                  Make this my default delivery address
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Will be automatically selected at checkout for faster ordering
                </p>
              </div>
            </label>
          </div>

          {/* 5. ACTION BUTTONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 rounded-xl border border-[var(--color-border)] bg-white py-3 text-xs font-bold text-[var(--color-text-secondary)] transition hover:bg-stone-50 active:scale-[0.98] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="
                flex
                flex-[2]
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--color-primary)]
                py-3
                text-xs
                font-black
                text-white
                shadow-lg
                shadow-[var(--color-primary)]/25
                transition-all
                hover:bg-[var(--color-primary-dark)]
                active:scale-[0.98]
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSaving ? (
                <>
                  <LoaderCircle size={15} className="animate-spin" />
                  <span>Saving Address...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>{initialData ? "Update Address" : "Save Address"}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

