import PageHeader from "@/components/PageHeader";
import RutinaList from "./RutinaList";
import { RUTINA } from "@/lib/theme";

export default function RutinaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Rutina"
        subtitle="Su día, paso a paso"
        iconSrc={RUTINA.icon}
        accent={RUTINA.accent}
        backHref="/inicio"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4" role="main">
        <RutinaList />
      </main>
    </div>
  );
}
