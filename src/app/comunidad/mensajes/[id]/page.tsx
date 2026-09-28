import { notFound } from "next/navigation";
import { obtenerPacienteId } from "@/lib/auth";
import { obtenerConversacionParaPaciente } from "@/lib/comunidad";
import PageHeader from "@/components/PageHeader";
import HiloMensajes from "@/components/HiloMensajes";
import { COMUNIDAD } from "@/lib/theme";

export default async function HiloPage({ params }: { params: Promise<{ id: string }> }) {
  const patientId = (await obtenerPacienteId())!;

  const conversationId = Number((await params).id);
  if (!Number.isInteger(conversationId)) {
    notFound();
  }

  const conversacion = await obtenerConversacionParaPaciente(conversationId, patientId);
  if (!conversacion) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PageHeader
        title={conversacion.otroNombre}
        iconSrc={COMUNIDAD.icon}
        accent={COMUNIDAD.accent}
        backHref="/comunidad/mensajes"
        backLabel="Mensajes"
      />
      <HiloMensajes
        conversationId={conversacion.id}
        miId={patientId}
        otroId={conversacion.otroPacienteId}
        otroNombre={conversacion.otroNombre}
      />
    </div>
  );
}
