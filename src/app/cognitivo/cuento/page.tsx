import PageHeader from "@/components/PageHeader";
import JuegoCuento from "./JuegoCuento";

export default function CuentoPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="El cuento de hoy"
        backHref="/cognitivo"
        backLabel="Mente activa"
      />
      <main className="px-4 pt-4" role="main">
        <JuegoCuento />
      </main>
    </div>
  );
}
