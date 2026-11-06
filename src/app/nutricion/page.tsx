import PageHeader from "@/components/PageHeader";
import FilaLista from "@/components/FilaLista";

/**
 * Nutrición como menú (Figma A11): cuatro filas y cada una abre su pantalla.
 * Antes el agua, el menú, las recetas y los consejos iban todos seguidos en
 * una página larga.
 */
const OPCIONES = [
  { href: "/nutricion/agua", titulo: "El agua de hoy", accent: "cyan", esquina: "arriba-der" },
  { href: "/nutricion/menu", titulo: "Lo que comí", accent: "orange", esquina: "abajo-izq" },
  { href: "/nutricion/recetas", titulo: "Recetas", accent: "green", esquina: "abajo-der" },
  { href: "/nutricion/consejos", titulo: "Consejos", accent: "purple", esquina: "arriba-izq" },
] as const;

export default function NutricionPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader title="Nutrición" backHref="/inicio" backLabel="Hoy" />

      <main className="px-4 pt-4" role="main">
        <ul className="flex flex-col gap-3 list-none p-0 m-0">
          {OPCIONES.map((o) => (
            <li key={o.href}>
              <FilaLista href={o.href} titulo={o.titulo} accent={o.accent} esquina={o.esquina} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
