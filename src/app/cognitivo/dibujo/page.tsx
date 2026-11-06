import PageHeader from "@/components/PageHeader";
import JuegoDibujo from "./JuegoDibujo";

export default function DibujoPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Dibuja de memoria"
        backHref="/cognitivo"
        backLabel="Mente activa"
      />
      <main className="px-4 pt-4" role="main">
        <JuegoDibujo />
      </main>
    </div>
  );
}
