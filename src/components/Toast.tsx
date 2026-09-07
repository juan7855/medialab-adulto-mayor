"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  emoji?: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  emoji = "✅",
  onClose,
  duration = 2500,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-gray-900 text-white rounded-2xl shadow-2xl animate-slide-in"
      style={{ padding: "16px 28px", fontSize: "1.1rem", fontWeight: 700, minWidth: "280px", maxWidth: "90vw" }}
    >
      <span style={{ fontSize: "1.5rem" }} aria-hidden="true">{emoji}</span>
      <span>{message}</span>
    </div>
  );
}
