import { obtenerPacienteId } from "@/lib/auth";
import { listarMiembrosParaChat } from "@/lib/comunidad";
import PageHeader from "@/components/PageHeader";
import IniciarConversacionBoton from "@/components/IniciarConversacionBoton";
import { COMUNIDAD } from "@/lib/theme";

export default async function NuevoMensajePage() {
  const patientId = (await obtenerPacienteId())!;
  const miembros = await listarMiembrosParaChat(patientId);

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Con quién quieres hablar"
        iconSrc={COMUNIDAD.icon}
        accent={COMUNIDAD.accent}
        backHref="/comunidad/mensajes"
        backLabel="Mensajes"
      />

      <main className="px-4 pt-4" role="main">
        {miembros.length === 0 ? (
          <p
            className="text-center mt-8"
            style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
          >
            Todavía no hay nadie más en la comunidad.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {miembros.map((m) => (
              <li key={m.id}>
                <IniciarConversacionBoton patientId={m.id} name={m.name} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
