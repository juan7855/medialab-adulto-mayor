import PageHeader from "@/components/PageHeader";
import RutinaList from "./RutinaList";

export default function RutinaPage() {
  const today = new Date().toISOString().split("T")[0];
  const todayFormatted = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F5F3FF" }}>
      <PageHeader
        title="Rutina"
        emoji="📅"
        color="#7C3AED"
        backHref="/"
        backLabel="Inicio"
      />

      <main
        className="px-4 py-5 flex flex-col gap-5"
        style={{ maxWidth: "480px", margin: "0 auto" }}
        role="main"
      >
        {/* Today header */}
        <div
          className="rounded-3xl p-5 shadow text-center"
          style={{ backgroundColor: "#EDE9FE", border: "2px solid #C4B5FD" }}
          role="region"
          aria-label="Fecha de hoy"
        >
          <p className="font-extrabold text-purple-900 capitalize" style={{ fontSize: "1.2rem" }}>
            📅 {todayFormatted}
          </p>
        </div>

        {/* Routine list */}
        <RutinaList date={today} />
      </main>
    </div>
  );
}
