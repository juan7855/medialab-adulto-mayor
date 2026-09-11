"use client";

import Link from "next/link";
import SectionIcon from "./SectionIcon";
import { animalPorId } from "@/lib/animales";
import { leerAnimal } from "@/lib/sesion";
import { useIsClient } from "@/lib/today";

/**
 * Muestra con qué animal se entró y permite volver a la pantalla de acceso
 * para cambiar. Se lee del navegador, así que sólo existe tras hidratar.
 */
export default function AnimalActivo() {
  const isClient = useIsClient();
  const animal = isClient ? animalPorId(leerAnimal()) : null;

  if (!animal) return null;

  return (
    <Link
      href="/"
      className="chip-btn pressable"
      style={{ paddingLeft: "0.4rem", paddingRight: "0.8rem" }}
      aria-label={`Entraste como ${animal.nombre}. Tocar para cambiar`}
    >
      <SectionIcon src={animal.icon} size={32} />
      <span>{animal.nombre}</span>
    </Link>
  );
}
