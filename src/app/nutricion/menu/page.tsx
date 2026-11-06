import { eq } from "drizzle-orm";
import { db } from "@/db";
import { meals as mealsTable } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import MealList from "../MealList";
import { accentOf } from "@/lib/theme";

export default async function MenuPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  const menu = await db
    .select()
    .from(mealsTable)
    .where(eq(mealsTable.patientId, patientId))
    .orderBy(mealsTable.id);

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Lo que comí"
        subtitle="Marque cada comida cuando la termine."
        backHref="/nutricion"
        backLabel="Nutrición"
      />
      <main className="px-4 pt-4" role="main">
        <MealList meals={menu.map((m) => ({ ...m, accent: accentOf(m.accent) }))} />
      </main>
    </div>
  );
}
