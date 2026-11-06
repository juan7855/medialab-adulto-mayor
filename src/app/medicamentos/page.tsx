import PageHeader from "@/components/PageHeader";
import MedicationList from "./MedicationList";
import MedicationHistory from "./MedicationHistory";

export default function MedicamentosPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Mis medicamentos"
        subtitle='Toque "Ya lo tomé" al tomárselo.'
        backHref="/inicio"
        backLabel="Hoy"
      />

      <main className="px-4 pt-4 flex flex-col gap-8" role="main">
        <section aria-label="Medicamentos de hoy">
          <MedicationList />
        </section>

        <section aria-labelledby="titulo-historial">
          <h2 id="titulo-historial" style={{ fontSize: "var(--t-lg)", fontWeight: 700 }}>
            Los últimos días
          </h2>
          <div className="mt-3">
            <MedicationHistory />
          </div>
        </section>
      </main>
    </div>
  );
}
