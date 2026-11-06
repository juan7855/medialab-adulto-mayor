import { eq } from "drizzle-orm";
import { db } from "@/db";
import { cognitiveActivities } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import PageHeader from "@/components/PageHeader";
import CognitiveList from "./CognitiveList";

export default async function CognitivoPage() {
  const patientId = (await obtenerPacienteId())!;
  const catalogo = await db
    .select()
    .from(cognitiveActivities)
    .where(eq(cognitiveActivities.patientId, patientId));

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Mente activa"
        backHref="/inicio"
        backLabel="Hoy"
      />

      <main className="px-4 pt-4" role="main">
        <CognitiveList activities={catalogo} />
      </main>
    </div>
  );
}
