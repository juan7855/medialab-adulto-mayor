"use client";

import { useRouter } from "next/navigation";
import { rem } from "@/lib/scale";
import { ASISTENTES } from "@/lib/asistentes";
import { guardarAsistente } from "@/lib/sesion";

export default function SelectorAsistente() {
  const router = useRouter();

  const elegir = (id: string) => {
    guardarAsistente(id);
    router.push("/animo");
  };

  return (
    <div className="grid grid-cols-2 gap-3.5" role="list">
      {ASISTENTES.map((asistente, i) => (
        <button
          key={asistente.id}
          onClick={() => elegir(asistente.id)}
          role="listitem"
          className="card pressable animate-rise flex flex-col items-center p-4"
          style={{ animationDelay: `${i * 60}ms` }}
          aria-label={`Elegir a ${asistente.nombre}. ${asistente.presentacion}`}
        >
          <span
            className="flex items-end justify-center w-full"
            style={{
              backgroundColor: asistente.tinte,
              border: `1px solid ${asistente.borde}`,
              borderRadius: "var(--r-md)",
              overflow: "hidden",
              height: rem(150),
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

          <span className="mt-3" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
            {asistente.nombre}
          </span>
          <span
            className="mt-0.5 text-center"
            style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
          >
            {asistente.presentacion}
          </span>
        </button>
      ))}
    </div>
  );
}
