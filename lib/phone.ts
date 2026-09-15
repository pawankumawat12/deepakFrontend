/**
 * Shared Indian Phone Number Validation & Normalization for Frontend
 */

export function normalizeIndianPhone(raw: unknown): string {
  if (!raw) return "";
  let digits = String(raw).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }
  return digits;
}

export function isValidIndianPhone(phone: unknown): boolean {
  if (!phone) return false;
  const digits = normalizeIndianPhone(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

export function sanitizePhoneInput(value: unknown): string {
  return String(value || "").replace(/\D/g, "").slice(0, 10);
}

