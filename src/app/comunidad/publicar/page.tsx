import PageHeader from "@/components/PageHeader";
import FormularioPost from "@/components/FormularioPost";
import { COMUNIDAD } from "@/lib/theme";

export default function PublicarPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Publicar"
        iconSrc={COMUNIDAD.icon}
        accent={COMUNIDAD.accent}
        backHref="/comunidad"
        backLabel="Comunidad"
      />

      <main className="px-4 pt-4" role="main">
        <FormularioPost />
      </main>
    </div>
  );
}
