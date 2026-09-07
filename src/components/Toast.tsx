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
  success: { icon: Check, color: "#7BE0A6" },
  error: { icon: TriangleAlert, color: "#FFA894" },
  info: { icon: Info, color: "#CFC6B4" },
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
        backgroundColor: "#22201A",
        color: "#FAF7F1",
        borderRadius: "var(--r-md)",
        boxShadow: "var(--shadow-lg)",
        padding: "0.8rem 1.15rem",
        fontSize: "0.92rem",
        fontWeight: 600,
        maxWidth: "min(26rem, 90vw)",
      }}
    >
      <Icon size={20} strokeWidth={2.4} color={color} aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}
