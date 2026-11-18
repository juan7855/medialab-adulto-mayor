"use client";

export default function BotonImprimir({ texto = "Imprimir" }: { texto?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-dark pressable"
      style={{ fontSize: "var(--t-sm)", padding: "0.6rem 1.1rem" }}
    >
      {texto}
    </button>
  );
}
