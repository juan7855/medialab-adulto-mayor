import Link from "next/link";
import { UserPlus } from "lucide-react";
import { obtenerPacienteId } from "@/lib/auth";
import { listarConversaciones } from "@/lib/comunidad";
import PageHeader from "@/components/PageHeader";
import Fecha from "@/components/Fecha";
import { COMUNIDAD } from "@/lib/theme";

export default async function MensajesPage() {
  const patientId = (await obtenerPacienteId())!;
  const conversaciones = await listarConversaciones(patientId);

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Mensajes"
        iconSrc={COMUNIDAD.icon}
        accent={COMUNIDAD.accent}
        backHref="/comunidad"
        backLabel="Comunidad"
      />

      <main className="px-4 pt-4" role="main">
        <Link href="/comunidad/mensajes/nuevo" className="btn-cta pressable w-full mb-4">
          <UserPlus size={22} strokeWidth={2.2} aria-hidden="true" />
          Nuevo mensaje
        </Link>

        {conversaciones.length === 0 ? (
          <p
            className="text-center mt-8"
            style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
          >
            Todavía no tienes conversaciones.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {conversaciones.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/comunidad/mensajes/${c.id}`}
                  className="card pressable flex items-center gap-3 p-3.5"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="flex-1 min-w-0">
                    <span className="flex items-center justify-between gap-2">
                      <span style={{ fontSize: "var(--t-sm)", fontWeight: 800 }}>{c.otroNombre}</span>
                      {c.ultimoMensajeFecha && (
                        <span style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}>
                          <Fecha iso={c.ultimoMensajeFecha} />
                        </span>
                      )}
                    </span>
                    <span
                      className="block mt-0.5 truncate"
                      style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
                    >
                      {c.ultimoMensaje ?? "Sin mensajes todavía"}
                    </span>
                  </span>
                  {c.noLeidos > 0 && (
                    <span
                      style={{
                        background: "var(--red-solid)",
                        color: "#FAF8F5",
                        borderRadius: "999px",
                        minWidth: "1.6rem",
                        height: "1.6rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "var(--t-xs)",
                        fontWeight: 800,
                        padding: "0 0.4rem",
                        flexShrink: 0,
                      }}
                    >
                      {c.noLeidos}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
