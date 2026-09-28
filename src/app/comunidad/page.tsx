import Link from "next/link";
import { MessageSquarePlus, Send, Users } from "lucide-react";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, listarPostsForo } from "@/lib/comunidad";
import PageHeader from "@/components/PageHeader";
import Fecha from "@/components/Fecha";
import { COMUNIDAD } from "@/lib/theme";

export default async function ComunidadPage() {
  const patientId = (await obtenerPacienteId())!;
  const esMiembro = await esMiembroComunidad(patientId);
  const posts = esMiembro ? await listarPostsForo() : [];

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Comunidad"
        subtitle="Foro y mensajes con otros"
        iconSrc={COMUNIDAD.icon}
        accent={COMUNIDAD.accent}
        backHref="/inicio"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4" role="main">
        {!esMiembro ? (
          <div
            className="flex items-start gap-2.5 p-3.5"
            style={{
              backgroundColor: "var(--yellow-tint)",
              border: "1px solid var(--yellow-line)",
              borderRadius: "var(--r-lg)",
            }}
            role="note"
          >
            <Users
              size={22}
              strokeWidth={2}
              color="var(--ink-soft)"
              aria-hidden="true"
              style={{ flexShrink: 0, marginTop: 1 }}
            />
            <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}>
              Tu cuidador todavía no te agregó a la comunidad. Cuando lo haga, vas a poder ver el
              foro y escribir con otras personas.
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2.5 mb-4">
              <Link href="/comunidad/publicar" className="btn-cta pressable flex-1">
                <MessageSquarePlus size={22} strokeWidth={2.2} aria-hidden="true" />
                Publicar
              </Link>
              <Link href="/comunidad/mensajes" className="btn-soft pressable flex-1">
                <Send size={20} strokeWidth={2.2} aria-hidden="true" />
                Mensajes
              </Link>
            </div>

            {posts.length === 0 ? (
              <p
                className="text-center mt-8"
                style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
              >
                Nadie ha publicado todavía. ¡Sé la primera persona!
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/comunidad/${post.id}`}
                      className="card pressable block p-3.5"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span style={{ fontSize: "var(--t-sm)", fontWeight: 800 }}>
                          {post.authorName}
                        </span>
                        <span style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}>
                          <Fecha iso={post.createdAt} />
                        </span>
                      </div>
                      <p
                        className="mt-1.5"
                        style={{ fontSize: "var(--t-md)", fontWeight: 500, lineHeight: 1.4 }}
                      >
                        {post.content}
                      </p>
                      <span
                        className="block mt-2"
                        style={{ fontSize: "var(--t-xs)", fontWeight: 700, color: "var(--ink-mute)" }}
                      >
                        {post.commentCount === 0
                          ? "Sin comentarios"
                          : post.commentCount === 1
                            ? "1 comentario"
                            : `${post.commentCount} comentarios`}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
