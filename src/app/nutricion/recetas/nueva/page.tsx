import PageHeader from "@/components/PageHeader";
import FormularioReceta from "@/components/FormularioReceta";

export default function NuevaRecetaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Agregar mi receta"
        subtitle="Quedará guardada junto a las demás recetas."
        backHref="/nutricion/recetas"
        backLabel="Recetas"
      />
      <main className="px-4 pt-4" role="main">
        <FormularioReceta />
      </main>
    </div>
  );
}
