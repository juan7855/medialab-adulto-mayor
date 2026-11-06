import { Clock, CloudSun, Moon, Sun, Sunrise, Sunset, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

/**
 * Franjas del día en que se agrupa la rutina. Módulo aparte (sin "use client")
 * para que lo usen tanto la página de cada franja, que es de servidor, como
 * las listas del cliente.
 */
export const GROUPS: { key: string; label: string; icon: LucideIcon; accent: AccentName }[] = [
  { key: "amanecer", label: "Amanecer", icon: Sunrise, accent: "yellow" },
  { key: "manana", label: "Mañana", icon: CloudSun, accent: "green" },
  { key: "mediodia", label: "Mediodía", icon: Sun, accent: "orange" },
  { key: "tarde", label: "Tarde", icon: Sunset, accent: "cyan" },
  { key: "noche", label: "Noche", icon: Moon, accent: "purple" },
  { key: "otros", label: "Durante el día", icon: Clock, accent: "blue" },
];

/**
 * Franja de una actividad. La plataforma del cuidador escribe la franja en
 * español ("Amanecer", "Mañana", "Mediodía", "Tarde", "Noche"); el seed
 * original la escribía en inglés ("morning"...). Se aceptan ambas, sin
 * importar mayúsculas ni tildes, y lo que no se reconozca cae en "otros"
 * para que ninguna actividad desaparezca de la pantalla.
 */
const ALIAS_FRANJA: Record<string, string> = {
  amanecer: "amanecer",
  madrugada: "amanecer",
  dawn: "amanecer",
  manana: "manana",
  morning: "manana",
  mediodia: "mediodia",
  noon: "mediodia",
  tarde: "tarde",
  afternoon: "tarde",
  noche: "noche",
  evening: "noche",
  night: "noche",
};

export function franjaDe(timeOfDay: string | null | undefined): string {
  const clave = (timeOfDay ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
  return ALIAS_FRANJA[clave] ?? "otros";
}

