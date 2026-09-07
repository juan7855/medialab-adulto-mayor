import { notFound } from "next/navigation";
import { Carrot, Clock, ListChecks, Lightbulb, Utensils } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
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
  const Icon = recipe.icon;

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
            height: 130,
            backgroundColor: tone.tint,
            border: `1px solid ${tone.line}`,
            borderRadius: "var(--r-lg)",
          }}
          aria-hidden="true"
        >
          <Icon size={54} strokeWidth={1.3} color={tone.ink} />
        </div>

        {/* Metadatos */}
        <div className="flex flex-wrap gap-2 px-1">
          <span className="pill">
            <Clock size={13} strokeWidth={2.2} aria-hidden="true" />
            {recipe.time}
          </span>
          <span className="pill">
            <Utensils size={13} strokeWidth={2.2} aria-hidden="true" />
            {recipe.servings}
          </span>
          <span
            className="pill"
            style={{ backgroundColor: tone.tint, borderColor: tone.line, color: tone.ink }}
          >
            {recipe.difficulty}
          </span>
        </div>

        {/* Ingredientes */}
        <section aria-label="Ingredientes">
          <SectionTitle icon={Carrot} accent={recipe.accent}>
            Ingredientes
          </SectionTitle>

          <ul className="card flex flex-col gap-2.5 mt-3 p-4 list-none m-0">
            {recipe.ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="flex items-start gap-2.5"
                style={{ fontSize: "0.9rem", fontWeight: 500 }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "999px",
                    backgroundColor: tone.ink,
                    flexShrink: 0,
                    marginTop: 8,
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
                  className="tile"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "999px",
                    backgroundColor: tone.tint,
                    borderColor: tone.line,
                    color: tone.ink,
                    fontSize: "0.86rem",
                    fontWeight: 800,
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "0.92rem", fontWeight: 500, lineHeight: 1.45 }}>
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
            backgroundColor: "var(--amber-tint)",
            border: "1px solid var(--amber-line)",
            borderRadius: "var(--r-lg)",
          }}
          role="note"
          aria-label="Consejo de la receta"
        >
          <Lightbulb
            size={19}
            strokeWidth={2}
            color="var(--amber-ink)"
            aria-hidden="true"
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p style={{ fontSize: "0.84rem", fontWeight: 600, color: "var(--ink-soft)" }}>
            {recipe.tip}
          </p>
        </div>
      </main>
    </div>
  );
}
