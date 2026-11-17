import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { recipes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { obtenerPacienteId } from "@/lib/auth";

const LARGO_MAXIMO_NOMBRE = 80;
const LARGO_MAXIMO_LINEA = 200;
const MAX_LINEAS = 20;

/** Separa un bloque de texto en líneas, recorta cada una y descarta las
 *  vacías: así el formulario puede mandar un textarea de "una cosa por
 *  línea" sin que el usuario tenga que armar un arreglo. */
function aLineas(texto: unknown): string[] {
  if (typeof texto !== "string") return [];
  return texto
    .split("\n")
    .map((l) => l.trim().slice(0, LARGO_MAXIMO_LINEA))
    .filter((l) => l.length > 0)
    .slice(0, MAX_LINEAS);
}

/** Las recetas propias de este paciente, además del puñado fijo de la app. */
export async function GET() {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const propias = await db
      .select()
      .from(recipes)
      .where(eq(recipes.patientId, patientId))
      .orderBy(desc(recipes.createdAt));

    return NextResponse.json(propias);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const patientId = await obtenerPacienteId();
    if (patientId === null) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = (await req.json()) as {
      name?: string;
      time?: string;
      difficulty?: string;
      servings?: string;
      ingredients?: string;
      steps?: string;
      tip?: string;
    };

    const name = (body.name ?? "").trim().slice(0, LARGO_MAXIMO_NOMBRE);
    const ingredients = aLineas(body.ingredients);
    const steps = aLineas(body.steps);

    if (!name || ingredients.length === 0 || steps.length === 0) {
      return NextResponse.json(
        { error: "Falta el nombre, los ingredientes o la preparación" },
        { status: 400 },
      );
    }

    const DIFICULTADES = new Set(["Muy fácil", "Fácil", "Moderada"]);
    const difficulty = DIFICULTADES.has(body.difficulty ?? "") ? body.difficulty! : "Fácil";

    const [creada] = await db
      .insert(recipes)
      .values({
        patientId,
        name,
        time: (body.time ?? "").trim().slice(0, 40),
        servings: (body.servings ?? "").trim().slice(0, 40),
        difficulty,
        ingredients,
        steps,
        tip: body.tip?.trim() ? body.tip.trim().slice(0, LARGO_MAXIMO_LINEA) : null,
      })
      .returning({ id: recipes.id });

    return NextResponse.json({ ok: true, id: creada.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
