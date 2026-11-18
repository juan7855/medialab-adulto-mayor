import "./load-env";
import { db } from "./index";
import { cognitiveActivities } from "./schema";
import { eq } from "drizzle-orm";

/**
 * Juegos de Mente Activa propios de cada perfil demo, según su condición.
 * Don Álvaro (hipertensión) y Doña Marta (diabetes) reciben juegos
 * distintos, con temas de su día a día. Sólo toca los IDs 4 (Marta) y 5
 * (Álvaro); si ya tienen juegos, no los duplica.
 *
 * Uso: npx tsx src/db/seed-mente-activa.ts
 */

const ID_MARTA = 4;
const ID_ALVARO = 5;

type Fila = typeof cognitiveActivities.$inferInsert;

const JUEGOS_ALVARO: Omit<Fila, "patientId">[] = [
  {
    name: "Memoria de la receta sin sal",
    level: "Fácil",
    emoji: "🧠",
    durationLabel: "5 min",
    description: "Recordar ingredientes de una comida baja en sodio",
    steps: [
      "Piense en una comida sencilla que le guste, como sopa de verduras o pollo asado",
      "Diga en voz alta los ingredientes que lleva, sin mirar nada",
      "Ahora recuerde cuáles puede sazonar con limón, ajo o hierbas en vez de sal",
      "Repita la lista una vez más y compare con lo que recordó al principio",
    ],
    tip: "Lo importante no es acertar todo. Repetirlo cada día ayuda a la memoria.",
  },
  {
    name: "Cuentas de la farmacia",
    level: "Fácil",
    emoji: "🧮",
    durationLabel: "5 min",
    description: "Cálculo mental con horarios de las pastillas",
    steps: [
      "Piense en sus pastillas de la mañana y de la noche",
      "Cuente cuántas tomas hace en un día completo",
      "Calcule cuántas tomas hace en una semana",
      "Compruebe con su lista de medicamentos",
    ],
    tip: "Si le cuesta, cuente de a una toma. La idea es pensar con calma.",
  },
  {
    name: "Caminos del barrio",
    level: "Reto",
    emoji: "🗂️",
    durationLabel: "6 min",
    description: "Recordar lugares de su caminata diaria",
    steps: [
      "Piense en el recorrido que hace cuando sale a caminar",
      "Diga en voz alta cada lugar en orden: esquina, tienda, parque…",
      "Cuente cuántos lugares recuerda antes de quedarse en blanco",
      "Intente recordarlos al revés, desde el final hasta el inicio",
    ],
    tip: "Recorrer el camino mentalmente también entrena la memoria.",
  },
];

const JUEGOS_MARTA: Omit<Fila, "patientId">[] = [
  {
    name: "Memoria de los alimentos",
    level: "Fácil",
    emoji: "🧠",
    durationLabel: "5 min",
    description: "Recordar porciones y alimentos del plato",
    steps: [
      "Piense en un plato de almuerzo equilibrado",
      "Diga en voz alta los alimentos que lo componen",
      "Ubique cuál es el carbohidrato, cuál la proteína y cuál la verdura",
      "Repita la lista y compare con lo que recordó al principio",
    ],
    tip: "Recordar lo que come le ayuda a planear sus comidas del día.",
  },
  {
    name: "Cuentas del mercado",
    level: "Fácil",
    emoji: "🧮",
    durationLabel: "5 min",
    description: "Cálculo mental con compras para la semana",
    steps: [
      "Piense en tres frutas que compra seguido",
      "Súmelas de cabeza, sin papel",
      "Calcule cuánto costaría si comprara dos de cada una",
      "Compruebe el resultado con una calculadora",
    ],
    tip: "Si le cuesta, use números más pequeños. La idea es pensar, no acertar.",
  },
  {
    name: "Nombra frutas y verduras",
    level: "Reto",
    emoji: "🗂️",
    durationLabel: "6 min",
    description: "Fluidez: cuántos alimentos saludables se le ocurren",
    steps: [
      "Elija una categoría: frutas, verduras o legumbres",
      "Diga en voz alta todos los que se le ocurran, sin parar",
      "Cuente cuántos dijo antes de quedarse en blanco",
      "Cambie de categoría y repita",
    ],
    tip: "Decirlos en voz alta ayuda más que pensarlos en silencio.",
  },
];

async function sembrar(patientId: number, juegos: Omit<Fila, "patientId">[], nombre: string) {
  const existentes = await db
    .select()
    .from(cognitiveActivities)
    .where(eq(cognitiveActivities.patientId, patientId));

  if (existentes.length > 0) {
    console.log(`  ${nombre}: ya tiene ${existentes.length} juegos, no se duplican`);
    return;
  }

  await db.insert(cognitiveActivities).values(juegos.map((j) => ({ ...j, patientId })));
  console.log(`  ${nombre}: ${juegos.length} juegos sembrados`);
}

async function main() {
  await sembrar(ID_ALVARO, JUEGOS_ALVARO, "Álvaro");
  await sembrar(ID_MARTA, JUEGOS_MARTA, "Marta");
  console.log("✅ Listo");
  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
