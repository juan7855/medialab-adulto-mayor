import { notFound } from "next/navigation";
import { Carrot, Clock, ListChecks, Lightbulb, Utensils } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import IconTile from "@/components/IconTile";
import { RECIPES } from "../data";
import { ACCENTS } from "@/lib/theme";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return RECIPES.map((recipe) => ({ id: recipe.id }));
}

export default async function RecipeDetailPage({ params }: Props) {
  const { id } = await params;
  const recipe = RECIPES.find((r) => r.id === id);
  if (!recipe) return notFound();

  const tone = ACCENTS[recipe.accent];

  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title={recipe.name}
        subtitle={`${recipe.difficulty} · ${recipe.servings}`}
        icon={recipe.icon}
        accent={recipe.accent}
        backHref="/nutricion"
        backLabel="Nutrición"
      />

      <main className="px-4 pt-3 flex flex-col gap-5" role="main">
        {/* Portada */}
        <div
          className="flex items-center justify-center"
          style={{
            height: 136,
            backgroundColor: tone.tint,
            border: `1px solid ${tone.line}`,
            borderRadius: "var(--r-lg)",
          }}
        >
          <IconTile icon={recipe.icon} accent={recipe.accent} size={76} strokeWidth={1.7} />
        </div>

        {/* Metadatos */}
        <div className="flex flex-wrap gap-2 px-1">
          <span className="pill">
            <Clock size={15} strokeWidth={2.2} aria-hidden="true" />
            {recipe.time}
          </span>
          <span className="pill">
            <Utensils size={15} strokeWidth={2.2} aria-hidden="true" />
            {recipe.servings}
          </span>
          <span className="pill" style={{ backgroundColor: tone.tint, borderColor: tone.line }}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Ingredientes */}
        <section aria-label="Ingredientes">
          <SectionTitle icon={Carrot} accent={recipe.accent}>
            Ingredientes
          </SectionTitle>

          <ul className="card flex flex-col gap-3 mt-3 p-4 list-none m-0">
            {recipe.ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="flex items-start gap-3"
                style={{ fontSize: "var(--t-sm)", fontWeight: 500 }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "999px",
                    backgroundColor: tone.solid,
                    flexShrink: 0,
                    marginTop: 9,
                  }}
                />
                {ingredient}
              </li>
            ))}
          </ul>
        </section>

        {/* Preparación */}
        <section aria-label="Pasos de preparación">
          <SectionTitle icon={ListChecks} accent={recipe.accent}>
            Preparación
          </SectionTitle>

          <ol className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
            {recipe.steps.map((step, i) => (
              <li key={i} className="card flex items-start gap-3.5 p-3.5">
                <span
                  style={{
                    width: 38,
                    height: 38,
                    flexShrink: 0,
                    borderRadius: "999px",
                    backgroundColor: tone.tint,
                    border: `1px solid ${tone.line}`,
                    color: "var(--ink)",
                    fontSize: "var(--t-sm)",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.45 }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Consejo */}
        <div
          className="flex items-start gap-2.5 p-3.5"
          style={{
            backgroundColor: "var(--yellow-tint)",
            border: "1px solid var(--yellow-line)",
            borderRadius: "var(--r-lg)",
          }}
          role="note"
          aria-label="Consejo de la receta"
        >
          <Lightbulb
            size={22}
            strokeWidth={2}
            color="var(--ink-soft)"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}>
            {recipe.tip}
          </p>
        </div>
      </main>
    </div>
  );
}
