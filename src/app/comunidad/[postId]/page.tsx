import { notFound } from "next/navigation";
import { obtenerPacienteId } from "@/lib/auth";
import { esMiembroComunidad, obtenerPostConComentarios } from "@/lib/comunidad";
import PageHeader from "@/components/PageHeader";
import Fecha from "@/components/Fecha";
import BotonReportar from "@/components/BotonReportar";
import FormularioComentario from "@/components/FormularioComentario";
import { COMUNIDAD } from "@/lib/theme";

export default async function PostPage({ params }: { params: Promise<{ postId: string }> }) {
  const patientId = (await obtenerPacienteId())!;
  if (!(await esMiembroComunidad(patientId))) {
    notFound();
  }

  const postId = Number((await params).postId);
  if (!Number.isInteger(postId)) {
    notFound();
  }

  const resultado = await obtenerPostConComentarios(postId);
  if (!resultado) {
    notFound();
  }

  const { post, comentarios } = resultado;

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Comunidad"
        iconSrc={COMUNIDAD.icon}
        accent={COMUNIDAD.accent}
        backHref="/comunidad"
        backLabel="Comunidad"
      />

      <main className="px-4 pt-4" role="main">
        <div className="card p-3.5">
          <div className="flex items-center justify-between gap-2">
            <span style={{ fontSize: "var(--t-sm)", fontWeight: 800 }}>{post.authorName}</span>
            <span style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}>
              <Fecha iso={post.createdAt} />
            </span>
          </div>
          <p className="mt-1.5" style={{ fontSize: "var(--t-md)", fontWeight: 500, lineHeight: 1.4 }}>
            {post.content}
          </p>
          {post.authorId !== patientId && (
            <div className="mt-2.5">
              <BotonReportar targetType="post" targetId={post.id} compact />
            </div>
          )}
        </div>

        <h2 className="mt-5 mb-2 px-1" style={{ fontSize: "var(--t-sm)", fontWeight: 800 }}>
          {comentarios.length === 0 ? "Sin comentarios" : `${comentarios.length} comentarios`}
        </h2>

        <ul className="flex flex-col gap-2.5">
          {comentarios.map((c) => (
            <li key={c.id} className="card p-3">
              <div className="flex items-center justify-between gap-2">
                <span style={{ fontSize: "var(--t-xs)", fontWeight: 800 }}>{c.authorName}</span>
                <span style={{ fontSize: "var(--t-xs)", fontWeight: 600, color: "var(--ink-mute)" }}>
                  <Fecha iso={c.createdAt} />
                </span>
              </div>
              <p className="mt-1" style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.4 }}>
                {c.content}
              </p>
              {c.authorId !== patientId && (
                <div className="mt-2">
                  <BotonReportar targetType="comment" targetId={c.id} compact />
                </div>
              )}
            </li>
          ))}
        </ul>

        <FormularioComentario postId={post.id} />
      </main>
    </div>
  );
}
