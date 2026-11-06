import PageHeader from "@/components/PageHeader";
import MedicationHistory from "../MedicationHistory";

export default function ComoVaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Cómo va"
        subtitle="Sus medicamentos de los últimos 7 días."
        backHref="/medicamentos"
        backLabel="Mis medicamentos"
      />
      <main className="px-4 pt-4" role="main">
        <MedicationHistory />
      </main>
    </div>
  );
}
