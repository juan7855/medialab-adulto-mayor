import { Salad, Soup, Wheat, type LucideIcon } from "lucide-react";
import type { AccentName } from "@/lib/theme";

export interface Recipe {
  id: string;
  name: string;
  icon: LucideIcon;
  accent: AccentName;
  time: string;
  difficulty: string;
  servings: string;
  ingredients: string[];
  steps: string[];
  tip: string;
}

export const RECIPES: Recipe[] = [
  {
    id: "sopa-verduras",
    name: "Sopa de Verduras",
    icon: Soup,
    accent: "orange" as const,
    time: "30 min",
    difficulty: "Fácil",
    servings: "4 porciones",
    ingredients: [
      "2 zanahorias peladas y cortadas",
      "2 papas medianas en cubos",
      "1 calabaza pequeña en cubos",
      "1 cebolla picada",
      "2 dientes de ajo",
      "1 litro de agua o caldo",
      "Sal y pimienta al gusto",
      "Perejil picado",
    ],
    steps: [
      "Lava y pela todas las verduras con cuidado.",
      "Corta las verduras en trozos pequeños y uniformes.",
      "Calienta una olla grande a fuego medio.",
      "Agrega la cebolla y el ajo, cocina 3 minutos.",
      "Añade todas las verduras y cubre con agua o caldo.",
      "Cocina a fuego medio por 20 minutos hasta que estén blandas.",
      "Agrega sal, pimienta y perejil al gusto.",
      "Sirve caliente y disfruta.",
    ],
    tip: "Puedes guardar la sopa en el refrigerador hasta 3 días.",
  },
  {
    id: "ensalada-atun",
    name: "Ensalada con Atún",
    icon: Salad,
    accent: "green" as const,
    time: "15 min",
    difficulty: "Muy fácil",
    servings: "2 porciones",
    ingredients: [
      "1 lata de atún en agua (escurrido)",
      "2 tazas de lechuga picada",
      "1 tomate mediano en cubos",
      "1/2 pepino en rodajas",
      "2 cucharadas de aceite de oliva",
      "Jugo de 1/2 limón",
      "Sal y pimienta al gusto",
    ],
    steps: [
      "Lava bien la lechuga, el tomate y el pepino.",
      "Corta el tomate en cubos y el pepino en rodajas.",
      "En un tazón grande, coloca la lechuga.",
      "Agrega el tomate y el pepino encima.",
      "Abre la lata de atún y escúrrela bien.",
      "Distribuye el atún sobre la ensalada.",
      "Mezcla el aceite y el limón, vierte sobre la ensalada.",
      "Agrega sal y pimienta al gusto. ¡Listo!",
    ],
    tip: "Prepara la ensalada justo antes de comer para que quede fresca.",
  },
  {
    id: "avena-fruta",
    name: "Avena con Fruta",
    icon: Wheat,
    accent: "amber" as const,
    time: "10 min",
    difficulty: "Muy fácil",
    servings: "1 porción",
    ingredients: [
      "1/2 taza de avena en hojuelas",
      "1 taza de agua o leche descremada",
      "1 plátano en rodajas",
      "Algunas fresas o fruta de temporada",
      "1 cucharada de miel (opcional)",
      "Canela al gusto",
    ],
    steps: [
      "Mide la avena y el líquido en una olla pequeña.",
      "Calienta a fuego medio, revolviendo constantemente.",
      "Cocina por 3-5 minutos hasta que espese.",
      "Vierte la avena en un tazón.",
      "Corta el plátano y las fresas en rodajas.",
      "Coloca la fruta encima de la avena.",
      "Agrega miel y canela si deseas.",
      "Disfruta caliente.",
    ],
    tip: "La avena es muy buena para el corazón y da energía por más tiempo.",
  },
];