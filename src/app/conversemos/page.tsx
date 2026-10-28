import { redirect } from "next/navigation";
import { obtenerPacienteId } from "@/lib/auth";
import { encuestaCompleta } from "@/lib/encuesta-servidor";
import FormularioConversemos from "@/components/FormularioConversemos";

/** Después de la encuesta: dos preguntas abiertas, ninguna obligatoria. */
export default async function ConversemosPage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  // Las respuestas se guardan en la fila de la encuesta: sin ella no hay dónde.
  if (!(await encuestaCompleta(patientId))) redirect("/encuesta");

  return (
    <main className="min-h-screen flex flex-col px-4 pb-10" role="main">
      <div className="px-1 pt-8">
        <h1 style={{ fontSize: "var(--t-xl)", fontWeight: 800, lineHeight: 1.1 }}>
          Un momento más
        </h1>
        <p
          className="mt-2"
          style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
        >
          Puede responder solo si lo desea.
        </p>
      </div>

      <div className="mt-6">
        <FormularioConversemos />
      </div>
    </main>
  );
}
