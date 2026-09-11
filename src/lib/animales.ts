/**
 * Los seis animales del acceso.
 *
 * De momento no hay usuarios ni claves: tocar cualquiera entra. Cuando los
 * haya, cada persona tendrá el suyo asignado y este archivo seguirá siendo el
 * catálogo de símbolos.
 */
export interface Animal {
  id: string;
  nombre: string;
  /** Ficha en /public/iconos/animales. */
  icon: string;
}

export const ANIMALES: Animal[] = [
  { id: "aguila", nombre: "Águila", icon: "/iconos/animales/aguila.svg" },
  { id: "ballena", nombre: "Ballena", icon: "/iconos/animales/ballena.svg" },
  { id: "pez", nombre: "Pez", icon: "/iconos/animales/pez.svg" },
  { id: "perro", nombre: "Perro", icon: "/iconos/animales/perro.svg" },
  { id: "gato", nombre: "Gato", icon: "/iconos/animales/gato.svg" },
  { id: "leon", nombre: "León", icon: "/iconos/animales/leon.svg" },
];

export function animalPorId(id: string | null): Animal | null {
  if (!id) return null;
  return ANIMALES.find((a) => a.id === id) ?? null;
}
