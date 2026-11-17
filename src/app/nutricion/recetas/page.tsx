import { eq, desc } from "drizzle-orm";
import { ChefHat } from "lucide-react";
import Link from "next/link";
import { db } from "@/db";
import { recipes as recipesTable } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import FilaLista from "@/components/FilaLista";
import { RECIPES } from "../contenido";

export default async function RecetasPage() {
  const patientId = (await obtenerPacienteId())!;
  const propias = await db
    .select()
    .from(recipesTable)
    .where(eq(recipesTable.patientId, patientId))
    .orderBy(desc(recipesTable.createdAt));

  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Recetas" backHref="/nutricion" backLabel="Nutrición" />
      <main className="px-4 pt-4" role="main">
        <Link href="/nutricion/recetas/nueva" className="btn-cta pressable w-full mb-4">
          <ChefHat size={22} strokeWidth={2.2} aria-hidden="true" />
          Agregar mi receta
        </Link>

        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {propias.map((r) => (
            <li key={`propia-${r.id}`}>
              <FilaLista
                href={`/nutricion/receta/${r.id}`}
                titulo={r.name}
                subtitulo={`${r.time ? `${r.time} · ` : ""}${r.difficulty} · Su receta`}
                accent={"purple"}
                ariaLabel={`Receta ${r.name}, agregada por usted. ${r.time}, dificultad ${r.difficulty}`}
              />
            </li>
          ))}
          {RECIPES.map((r) => (
            <li key={r.id}>
              <FilaLista
                href={`/nutricion/receta/${r.id}`}
                titulo={r.name}
                subtitulo={`${r.time} · ${r.difficulty}`}
                accent={r.accent}
                ariaLabel={`Receta ${r.name}. ${r.time}, dificultad ${r.difficulty}`}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
