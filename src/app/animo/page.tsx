import { redirect } from "next/navigation";
import { obtenerPacienteId } from "@/lib/auth";
import { encuestaCompleta } from "@/lib/encuesta-servidor";
import AsistenteActivo from "@/components/AsistenteActivo";
import FormularioAnimo from "@/components/FormularioAnimo";

export default async function AnimoPage() {
  // La encuesta de bienestar es obligatoria antes de usar la app.
  const patientId = (await obtenerPacienteId())!;
  if (!(await encuestaCompleta(patientId))) redirect("/encuesta");

  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      <div className="flex items-center gap-4 pt-8">
        <AsistenteActivo size={110} />
        <h1 style={{ fontSize: "var(--t-xl)", fontWeight: 800, lineHeight: 1.1 }}>
          ¿Cómo te encuentras hoy?
        </h1>
      </div>

      <div className="mt-6">
        <FormularioAnimo />
      </div>
    </main>
  );
}
