"use client";

import type { LucideIcon } from "lucide-react";
import IconTile from "./IconTile";
import type { AccentName } from "@/lib/theme";
import { ACCENTS } from "@/lib/theme";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  icon: LucideIcon;
  accent: AccentName;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Sí, confirmar",
  cancelLabel = "Cancelar",
  icon,
  accent,
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirmación"
      className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in"
      style={{ backgroundColor: "rgba(30, 26, 18, 0.45)", backdropFilter: "blur(3px)" }}
    >
      <div
        className="w-full animate-rise"
        style={{
          maxWidth: "22rem",
          background: "var(--surface)",
          borderRadius: "var(--r-xl)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
        }}
      >
        <div className="flex flex-col items-center gap-4 px-7 pt-8 pb-6">
          <IconTile icon={icon} accent={accent} size={72} strokeWidth={1.6} />
          <p
            className="text-center"
            style={{ fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.35 }}
          >
            {message}
          </p>
        </div>

        <div className="flex flex-col gap-2.5 px-6 pb-7">
          <button
            onClick={onConfirm}
            autoFocus
            className="w-full pressable"
            style={{
              minHeight: "3.4rem",
              borderRadius: "var(--r-md)",
              backgroundColor: ACCENTS[accent].ink,
              color: "#fff",
              fontSize: "1rem",
              fontWeight: 700,
              border: "none",
            }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full pressable"
            style={{
              minHeight: "3.4rem",
              borderRadius: "var(--r-md)",
              backgroundColor: "var(--surface-soft)",
              color: "var(--ink-soft)",
              fontSize: "1rem",
              fontWeight: 700,
              border: "1px solid var(--line-strong)",
            }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
