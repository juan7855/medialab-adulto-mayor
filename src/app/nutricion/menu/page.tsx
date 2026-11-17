import { eq } from "drizzle-orm";
import { db } from "@/db";
import { foodGroups as foodGroupsTable } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import FoodGroupList from "../FoodGroupList";
import { accentOf } from "@/lib/theme";

export default async function MenuPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  const grupos = await db
    .select()
    .from(foodGroupsTable)
    .where(eq(foodGroupsTable.patientId, patientId))
    .orderBy(foodGroupsTable.sortOrder, foodGroupsTable.id);

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Lo que comí"
        subtitle="Marque los grupos de alimentos que ya comió hoy."
        backHref="/nutricion"
        backLabel="Nutrición"
      />
      <main className="px-4 pt-4" role="main">
        <FoodGroupList groups={grupos.map((g) => ({ ...g, accent: accentOf(g.accent) }))} />
      </main>
    </div>
  );
}
