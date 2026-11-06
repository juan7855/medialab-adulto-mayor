import PageHeader from "@/components/PageHeader";
import JuegoFoto from "./JuegoFoto";

export default function FotoPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="La foto"
        backHref="/cognitivo"
        backLabel="Mente activa"
      />
      <main className="px-4 pt-4" role="main">
        <JuegoFoto />
      </main>
    </div>
  );
}
