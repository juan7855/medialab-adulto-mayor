import { Armchair, Dumbbell, Footprints, Scale, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

export type Level = "Ligero" | "Moderado";

/** El acento comunica la intensidad: verde suave, ámbar exige algo más. */
export const LEVEL_ACCENT: Record<Level, AccentName> = {
  Ligero: "green",
  Moderado: "amber",
};

export const LEVELS: Level[] = ["Ligero", "Moderado"];

export interface Exercise {
  id: string;
  name: string;
  level: Level;
  duration: string;
  durationSeconds: number;
  icon: LucideIcon;
  description: string;
  steps: string[];
  tip: string;
}

export const EXERCISES: Exercise[] = [
  {
    id: "caminar",
    name: "Caminata Suave",
    level: "Ligero",
    duration: "15 min",
    durationSeconds: 900,
    icon: Footprints,
    description: "Caminata pausada para activar el cuerpo",
    steps: [
      "Ponte ropa cómoda y zapatos antideslizantes",
      "Comienza caminando despacio durante 2 minutos",
      "Mantén la espalda recta y los brazos relajados",
      "Camina a paso normal durante 10 minutos",
      "Termina con 3 minutos de caminata muy lenta",
    ],
    tip: "Si sientes dolor, detente y descansa.",
  },
  {
    id: "estiramiento",
    name: "Estiramiento",
    level: "Ligero",
    duration: "10 min",
    durationSeconds: 600,
    icon: Armchair,
    description: "Ejercicios de flexibilidad sentado",
    steps: [
      "Siéntate en una silla firme con los pies en el suelo",
      "Gira el cuello lentamente de lado a lado (5 veces)",
      "Levanta los brazos sobre la cabeza y baja lentamente (8 veces)",
      "Estira las piernas hacia adelante una a una (5 veces)",
      "Respira profundo 5 veces para terminar",
    ],
    tip: "Haz cada movimiento sin prisa y sin dolor.",
  },
  {
    id: "equilibrio",
    name: "Equilibrio",
    level: "Moderado",
    duration: "12 min",
    durationSeconds: 720,
    icon: Scale,
    description: "Ejercicios para mejorar el equilibrio",
    steps: [
      "Párate junto a una silla o pared para apoyo",
      "Levanta un pie del suelo por 10 segundos",
      "Repite con el otro pie (5 veces cada uno)",
      "Camina talón-punta en línea recta (10 pasos)",
      "Descansa sentado 2 minutos",
    ],
    tip: "Ten siempre algo cerca para apoyarte.",
  },
  {
    id: "fuerza",
    name: "Fuerza Suave",
    level: "Moderado",
    duration: "15 min",
    durationSeconds: 900,
    icon: Dumbbell,
    description: "Ejercicios de fuerza sin pesas",
    steps: [
      "Siéntate y levántate de la silla sin usar los brazos (8 veces)",
      "Aprieta y suelta los puños durante 30 segundos",
      "Levanta los talones del suelo parado (10 veces)",
      "Haz pequeños círculos con los hombros (5 cada dirección)",
      "Termina con respiración profunda",
    ],
    tip: "Descansa 1 minuto entre cada ejercicio.",
  },
];
