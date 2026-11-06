import PageHeader from "@/components/PageHeader";
import FilaLista from "@/components/FilaLista";
import { RECIPES } from "../contenido";

export default function RecetasPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Recetas" backHref="/nutricion" backLabel="Nutrición" />
      <main className="px-4 pt-4" role="main">
        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {RECIPES.map((r) => (
            <li key={r.id}>
              <FilaLista
                href={`/nutricion/receta/${r.id}`}
                titulo={r.name}
                subtitulo={`${r.time} · ${r.difficulty}`}
                accent={r.accent}
                ariaLabel={`Receta ${r.name}. ${r.time}, dificultad ${r.difficulty}`}
              />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
