"use client";

interface ConfirmDialogProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  emoji?: string;
}

export default function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Sí, confirmar",
  cancelLabel = "Cancelar",
  emoji = "❓",
}: ConfirmDialogProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Confirmación"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 animate-fade-in"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
        <div className="flex flex-col items-center p-8 gap-4">
          <span style={{ fontSize: "3rem" }} aria-hidden="true">{emoji}</span>
          <p
            className="text-center font-semibold text-gray-800"
            style={{ fontSize: "1.25rem", lineHeight: 1.4 }}
          >
            {message}
          </p>
        </div>
        <div className="flex flex-col gap-3 px-6 pb-8">
          <button
            onClick={onConfirm}
            autoFocus
            className="w-full rounded-2xl font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all"
            style={{ minHeight: "64px", fontSize: "1.2rem" }}
          >
            {confirmLabel}
          </button>
          <button
            onClick={onCancel}
            className="w-full rounded-2xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-95 transition-all border-2 border-gray-300"
            style={{ minHeight: "64px", fontSize: "1.2rem" }}
          >
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
