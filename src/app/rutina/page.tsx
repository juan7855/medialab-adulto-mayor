import { CalendarClock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import RutinaList from "./RutinaList";

export default function RutinaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Rutina"
        subtitle="Tu día, paso a paso"
        icon={CalendarClock}
        accent="purple"
        backHref="/"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4" role="main">
        <RutinaList />
      </main>
    </div>
  );
}
