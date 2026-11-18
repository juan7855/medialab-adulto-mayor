import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { cognitiveActivities } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import CognitiveList from "./CognitiveList";

// El catálogo es propio de cada paciente: se resuelve por sesión en cada visita.
export const dynamic = "force-dynamic";

export default async function CognitivoPage() {
  const patientId = (await obtenerPacienteId())!;
  const juegos = await db
    .select()
    .from(cognitiveActivities)
    .where(eq(cognitiveActivities.patientId, patientId))
    .orderBy(asc(cognitiveActivities.id));

  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Mente activa" backHref="/inicio" backLabel="Hoy" />

      <main className="px-4 pt-4" role="main">
        <CognitiveList activities={juegos} />
      </main>
    </div>
  );
}
