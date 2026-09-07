import PageHeader from "@/components/PageHeader";
import MedicationList from "./MedicationList";
import MedicationHistory from "./MedicationHistory";
import Link from "next/link";

export default function MedicamentosPage() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5F5" }}>
      <PageHeader
        title="Medicamentos"
        emoji="💊"
        color="#DC2626"
        backHref="/"
        backLabel="Inicio"
      />

      <main
        className="px-4 py-5 flex flex-col gap-5"
        style={{ maxWidth: "480px", margin: "0 auto" }}
        role="main"
      >
        {/* Emergency contact */}
        <Link
          href="/emergencia"
          role="button"
          aria-label="Botón de emergencia: llamar a familiar o médico"
          className="flex items-center justify-center gap-3 w-full rounded-3xl shadow-lg active:scale-95 transition-transform"
          style={{
            backgroundColor: "#FF4500",
            border: "3px solid #CC3700",
            minHeight: "72px",
            textDecoration: "none",
            padding: "0 20px",
          }}
        >
          <span style={{ fontSize: "2rem" }} aria-hidden="true">🆘</span>
          <span className="font-extrabold text-white" style={{ fontSize: "1.25rem" }}>
            EMERGENCIA – Llamar ayuda
          </span>
        </Link>

        {/* Medications of the day */}
        <section
          className="rounded-3xl p-5 shadow"
          style={{ backgroundColor: "white" }}
          aria-label="Medicamentos de hoy"
        >
          <h2
            className="font-extrabold text-gray-800 mb-4"
            style={{ fontSize: "1.25rem" }}
          >
            💊 Medicamentos de hoy
          </h2>
          <MedicationList date={today} />
        </section>

        {/* History */}
        <section
          className="rounded-3xl p-5 shadow"
          style={{ backgroundColor: "white" }}
          aria-label="Historial de los últimos 7 días"
        >
          <h2
            className="font-extrabold text-gray-800 mb-4"
            style={{ fontSize: "1.25rem" }}
          >
            📅 Historial (7 días)
          </h2>
          <MedicationHistory />
        </section>
      </main>
    </div>
  );
}
