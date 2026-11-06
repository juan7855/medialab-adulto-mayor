import PageHeader from "@/components/PageHeader";
import FilaLista from "@/components/FilaLista";
import { TIPOS_JUEGO } from "./contenido";
import type { Esquina } from "@/components/Gota";
import type { AccentName } from "@/lib/theme";

const ESQUINAS: Esquina[] = ["abajo-der", "arriba-izq", "abajo-izq"];
const ACENTOS: AccentName[] = ["green", "orange", "cyan"];

export default function CognitivoPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Mente activa" backHref="/inicio" backLabel="Hoy" />

      <main className="px-4 pt-4 flex flex-col gap-3" role="main">
        {TIPOS_JUEGO.map((juego, i) => (
          <FilaLista
            key={juego.slug}
            href={`/cognitivo/${juego.slug}`}
            titulo={juego.titulo}
            subtitulo={juego.subtitulo}
            accent={ACENTOS[i]}
            esquina={ESQUINAS[i]}
          />
        ))}

        <p
          className="text-center mt-4"
          style={{ fontSize: "var(--t-sm)", color: "var(--ink-mute)" }}
        >
          Sin reloj ni puntaje. Juegue con calma.
        </p>
      </main>
    </div>
  );
}
