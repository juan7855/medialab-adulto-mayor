"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  href?: string;
  label?: string;
}

export default function BackButton({ href = "/", label = "Inicio" }: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (href) {
      router.push(href);
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleBack}
      aria-label={`Volver a ${label}`}
      className="flex items-center gap-3 bg-white border-2 border-gray-300 rounded-2xl px-5 py-3 font-bold text-gray-800 hover:bg-gray-50 active:scale-95 transition-all duration-150 shadow-sm"
      style={{ minHeight: "56px", fontSize: "1.1rem" }}
    >
      <span className="text-2xl" aria-hidden="true">◀</span>
      <span>{label}</span>
    </button>
  );
}
