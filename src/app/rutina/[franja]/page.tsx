import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import RutinaList from "../RutinaList";
import { GROUPS } from "../franjas";

export default async function FranjaPage({ params }: { params: Promise<{ franja: string }> }) {
  const { franja } = await params;
  const grupo = GROUPS.find((g) => g.key === franja);
  if (!grupo) notFound();

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title={grupo.label}
        subtitle="Toque el botón verde cuando la termine."
        backHref="/rutina"
        backLabel="Todo lo de hoy"
      />

      <main className="px-4 pt-4" role="main">
        <RutinaList franja={grupo.key} />
      </main>
    </div>
  );
}
