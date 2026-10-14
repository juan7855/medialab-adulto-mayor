import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { obtenerPacienteId } from "@/lib/auth";
import { encuestaCompleta } from "@/lib/encuesta-servidor";
import FormularioEncuesta from "@/components/FormularioEncuesta";

export default async function EncuestaPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  if (await encuestaCompleta(patientId)) redirect("/animo");

  const [patient] = await db
    .select({ name: patients.name })
    .from(patients)
    .where(eq(patients.id, patientId));

  return (
    <main className="min-h-screen flex flex-col px-4 pb-10" role="main">
      <div className="px-1 pt-8">
        <h1 style={{ fontSize: "var(--t-xl)", fontWeight: 800, lineHeight: 1.1 }}>
          Antes de empezar
        </h1>
        <p
          className="mt-2"
          style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
        >
          Son unas preguntas rápidas. Todas son obligatorias.
        </p>
      </div>

      <div className="mt-6">
        <FormularioEncuesta nombreInicial={patient?.name ?? ""} />
      </div>
    </main>
  );
}
