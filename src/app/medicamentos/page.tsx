import PageHeader from "@/components/PageHeader";
import MedicationList from "./MedicationList";
import FilaLista from "@/components/FilaLista";

export default function MedicamentosPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Mis medicamentos"
        subtitle='Toque "Ya lo tomé" al tomárselo.'
        backHref="/rutina"
        backLabel="Todo lo de hoy"
      />

      <main className="px-4 pt-4 flex flex-col gap-8" role="main">
        <section aria-label="Medicamentos de hoy">
          <MedicationList />
        </section>

        <FilaLista
          href="/medicamentos/como-va"
          titulo="Cómo va"
          subtitulo="Los últimos 7 días"
          accent="green"
          esquina="arriba-der"
        />
      </main>
    </div>
  );
}
