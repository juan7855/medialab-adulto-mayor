import { Album, Brain, Calculator, Hash, Shapes, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

export type Level = "Fácil" | "Reto";

/** El acento comunica la exigencia: azul tranquilo, morado para el reto. */
export const LEVEL_ACCENT: Record<Level, AccentName> = {
  "Fácil": "blue",
  Reto: "purple",
};

export const LEVELS: Level[] = ["Fácil", "Reto"];

export interface CognitiveActivity {
  id: string;
  name: string;
  level: Level;
  duration: string;
  icon: LucideIcon;
  description: string;
  steps: string[];
  tip: string;
}

export const ACTIVITIES: CognitiveActivity[] = [
  {
    id: "memoria-palabras",
    name: "Memoria de palabras",
    level: "Fácil",
    duration: "5 min",
    icon: Brain,
    description: "Recuerda una lista corta de palabras",
    steps: [
      "Busca papel y lápiz, y siéntate con tranquilidad",
      "Escribe 8 palabras cualquiera: pan, silla, río, reloj...",
      "Léelas en voz alta dos veces, sin prisa",
      "Tapa la hoja y espera un minuto mirando por la ventana",
      "Escribe todas las que recuerdes y luego compara",
    ],
    tip: "No importa cuántas recuerdes hoy. Lo que ayuda es repetirlo cada día.",
  },
  {
    id: "cuentas-del-dia",
    name: "Cuentas del día",
    level: "Fácil",
    duration: "5 min",
    icon: Calculator,
    description: "Cálculo mental con cosas de casa",
    steps: [
      "Piensa en el precio de tres cosas que compras seguido",
      "Súmalas de cabeza, sin papel",
      "Ahora calcula cuánto sería si compraras dos de cada una",
      "Resta ese total de 100",
      "Comprueba el resultado con una calculadora",
    ],
    tip: "Si te cuesta, usa números más pequeños. La idea es pensar, no acertar.",
  },
  {
    id: "nombra-categorias",
    name: "Nombra categorías",
    level: "Reto",
    duration: "6 min",
    icon: Shapes,
    description: "Fluidez: cuántos nombres se te ocurren",
    steps: [
      "Elige una categoría: frutas, animales, ciudades, oficios",
      "Di en voz alta todos los que se te ocurran, sin parar",
      "Cuenta cuántos dijiste antes de quedarte en blanco",
      "Cambia de categoría y repite",
      "Anota tu mejor número para compararlo mañana",
    ],
    tip: "Decirlos en voz alta ayuda más que pensarlos en silencio.",
  },
  {
    id: "recuerdos-guiados",
    name: "Recuerdos guiados",
    level: "Fácil",
    duration: "8 min",
    icon: Album,
    description: "Traer a la memoria momentos vividos",
    steps: [
      "Elige una época: tu juventud, tu primer trabajo, tu barrio",
      "Recuerda un día concreto de esa época",
      "Piensa en los detalles: quién estaba, qué olía, qué sonaba",
      "Cuéntaselo a alguien, o dilo en voz alta",
      "Termina nombrando tres cosas buenas de ese recuerdo",
    ],
    tip: "Compartirlo con un familiar hace el ejercicio mucho más valioso.",
  },
  {
    id: "cuenta-atras",
    name: "Cuenta hacia atrás",
    level: "Reto",
    duration: "4 min",
    icon: Hash,
    description: "Atención sostenida con números",
    steps: [
      "Siéntate cómodo y respira hondo dos veces",
      "Cuenta desde 100 hacia atrás de 3 en 3: 100, 97, 94...",
      "Si te pierdes, vuelve al último número seguro y sigue",
      "Llega hasta donde puedas sin apurarte",
      "Descansa un minuto y hazlo una segunda vez",
    ],
    tip: "Perderse es parte del ejercicio. Retomar es lo que entrena la atención.",
  },
];
