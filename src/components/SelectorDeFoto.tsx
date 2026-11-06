"use client";

import { useRef, useState } from "react";
import { ImagePlus, Trash2 } from "lucide-react";
import { prepararFoto, type FotoElegida } from "@/lib/foto-navegador";
import { rem } from "@/lib/scale";

/**
 * Elegir una foto para un post: un botón grande, la foto ya elegida en
 * grande debajo y un botón para quitarla. Un solo botón y no dos ("cámara" /
 * "galería"): el selector del teléfono ya ofrece las dos cosas, y dos
 * botones obligarían a decidir antes de ver nada.
 */
export default function SelectorDeFoto({
  foto,
  onCambio,
  deshabilitado,
}: {
  foto: FotoElegida | null;
  onCambio: (foto: FotoElegida | null) => void;
  deshabilitado?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [preparando, setPreparando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const elegir = async (archivo: File | undefined) => {
    if (!archivo) return;

    setError(null);
    setPreparando(true);
    try {
      onCambio(await prepararFoto(archivo));
    } catch {
      setError("No se pudo usar esa foto. Pruebe con otra.");
      onCambio(null);
    } finally {
      setPreparando(false);
      // Para que elegir el mismo archivo otra vez vuelva a disparar el
      // evento (si no, el input recuerda el valor y no pasa nada).
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className="flex flex-col">
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => void elegir(e.target.files?.[0])}
        tabIndex={-1}
        aria-hidden="true"
      />

      {foto && (
        <div
          className="card overflow-hidden mt-3"
          style={{ padding: 0, lineHeight: 0 }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- es una foto local (data URL) todavía sin subir: no hay nada que optimizar. */}
          <img
            src={foto.dataUrl}
            alt="La foto que va a publicar"
            width={foto.width}
            height={foto.height}
            style={{
              display: "block",
              width: "100%",
              height: "auto",
              borderRadius: "calc(var(--r-lg) - 2px)",
            }}
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => (foto ? onCambio(null) : input.current?.click())}
        disabled={deshabilitado || preparando}
        className="btn-soft pressable w-full mt-3"
        style={{ minHeight: rem(70), fontSize: "var(--t-sm)", opacity: preparando ? 0.6 : 1 }}
      >
        {foto ? (
          <>
            <Trash2 size={22} strokeWidth={2.2} aria-hidden="true" />
            Quitar la foto
          </>
        ) : (
          <>
            <ImagePlus size={22} strokeWidth={2.2} aria-hidden="true" />
            {preparando ? "Preparando la foto..." : "Agregar una foto"}
          </>
        )}
      </button>

      {error && (
        <p
          className="mt-2 px-1"
          style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--red-solid)" }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}
