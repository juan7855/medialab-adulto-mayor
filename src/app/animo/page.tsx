import AsistenteActivo from "@/components/AsistenteActivo";
import FormularioAnimo from "@/components/FormularioAnimo";

export default function AnimoPage() {
  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      <div className="flex items-center gap-4 pt-8">
        <AsistenteActivo size={110} />
        <h1 style={{ fontSize: "var(--t-xl)", fontWeight: 800, lineHeight: 1.1 }}>
          ¿Cómo te encuentras hoy?
        </h1>
      </div>

      <div className="mt-6">
        <FormularioAnimo />
      </div>
    </main>
  );
}
