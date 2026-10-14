"use client";

import { useEffect } from "react";
import { Check, Info, TriangleAlert } from "lucide-react";

export type ToastTone = "success" | "error" | "info";

interface ToastProps {
  message: string;
  tone?: ToastTone;
  onClose: () => void;
  duration?: number;
}

const TONES = {
  success: { icon: Check, color: "var(--green-solid)" },
  error: { icon: TriangleAlert, color: "var(--red-solid)" },
  info: { icon: Info, color: "var(--yellow-solid)" },
} as const;

export default function Toast({
  message,
  tone = "success",
  onClose,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const { icon: Icon, color } = TONES[tone];

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-50 flex items-center gap-3 animate-slide-in"
      style={{
        transform: "translateX(-50%)",
        backgroundColor: "#303F49",
        color: "#FBF9F3",
        borderRadius: "var(--r-md)",
        boxShadow: "var(--shadow-lg)",
        padding: "0.85rem 1.2rem",
        fontSize: "var(--t-sm)",
        fontWeight: 700,
        maxWidth: "min(26rem, 92vw)",
      }}
    >
      <Icon size={22} strokeWidth={2.5} color={color} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
