"use client";

import { useRouter } from "next/navigation";
import SectionIcon from "./SectionIcon";
import { ANIMALES } from "@/lib/animales";
import { guardarAnimal } from "@/lib/sesion";

/**
 * Rejilla de acceso. Hoy cualquier animal entra; se guarda cuál se eligió
 * sólo para poder mostrarlo luego en el inicio.
 */
export default function SelectorAnimal() {
  const router = useRouter();

  const entrar = (id: string) => {
    guardarAnimal(id);
    router.push("/inicio");
  };

  return (
    <div className="grid grid-cols-2 gap-3.5" role="list">
      {ANIMALES.map((animal, i) => (
        <button
          key={animal.id}
          onClick={() => entrar(animal.id)}
          role="listitem"
          className="card pressable animate-rise flex flex-col items-center justify-center p-4"
          style={{ animationDelay: `${i * 50}ms`, minHeight: "9.5rem" }}
          aria-label={`Entrar como ${animal.nombre}`}
        >
          <SectionIcon src={animal.icon} size={92} />
          <span className="mt-3" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
            {animal.nombre}
          </span>
        </button>
      ))}
    </div>
  );
}
