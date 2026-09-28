"use client";

import { useRouter } from "next/navigation";
import { rem } from "@/lib/scale";
import { ASISTENTES } from "@/lib/asistentes";
import { guardarAsistente } from "@/lib/sesion";
import { hablar } from "@/lib/voz";

/**
 * Uno encima del otro, a lo ancho.
 *
 * En dos columnas cada tarjeta se quedaba en ~170px de texto y las
 * descripciones se partían, además de dejar media pantalla vacía. A lo ancho
 * caben enteras, la ilustración se ve más grande y es el mismo patrón de fila
 * que usa el inicio.
 */
export default function SelectorAsistente() {
  const router = useRouter();

  const elegir = (id: string) => {
    guardarAsistente(id);
    const asistente = ASISTENTES.find((a) => a.id === id);
    if (asistente) {
      hablar(`Hola, soy ${asistente.nombre}. A partir de hoy te acompaño.`, asistente.voz);
    }
    router.push("/animo");
  };

  return (
    <div className="flex flex-col gap-4" role="list">
      {ASISTENTES.map((asistente, i) => (
        <button
          key={asistente.id}
          onClick={() => elegir(asistente.id)}
          role="listitem"
          className="card pressable animate-rise flex items-center gap-4 p-4 w-full text-left"
          style={{ animationDelay: `${i * 60}ms` }}
          aria-label={`Elegir a ${asistente.nombre}. ${asistente.presentacion}`}
        >
          <span
            className="flex items-end justify-center"
            style={{
              backgroundColor: asistente.tinte,
              border: `1px solid ${asistente.borde}`,
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              height: rem(150),
              width: rem(118),
              flexShrink: 0,
            }}
            aria-hidden="true"
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
            <img
              src={asistente.imagen}
              alt=""
              style={{ height: rem(140), width: "auto", display: "block" }}
            />
          </span>

          <span className="flex-1 min-w-0">
            <span className="block" style={{ fontSize: "var(--t-lg)", fontWeight: 800 }}>
              {asistente.nombre}
            </span>
            <span
              className="block mt-1.5"
              style={{ fontSize: "var(--t-sm)", fontWeight: 500, color: "var(--ink-mute)" }}
            >
              {asistente.presentacion}
            </span>
          </span>

        </button>
      ))}
    </div>
  );
}
