import PageHeader from "@/components/PageHeader";
import RutinaHub from "./RutinaHub";

export default function RutinaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Todo lo de hoy"
        subtitle="Toque una parte del día para ver qué le toca."
        backHref="/inicio"
        backLabel="Hoy"
      />

      <main className="px-4 pt-4" role="main">
        <RutinaHub />
      </main>
    </div>
  );
}
