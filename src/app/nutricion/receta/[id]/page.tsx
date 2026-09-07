import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import { RECIPES } from "../data";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return RECIPES.map((r) => ({ id: r.id }));
}

export default async function RecetaPage({ params }: Props) {
  const { id } = await params;
  const recipe = RECIPES.find((r) => r.id === id);
  if (!recipe) return notFound();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F0FDF4" }}>
      <PageHeader
        title={recipe.name}
        emoji={recipe.emoji}
        color="#16A34A"
        backHref="/nutricion"
        backLabel="Nutrición"
      />

      <main
        className="px-4 py-5 flex flex-col gap-5"
        style={{ maxWidth: "480px", margin: "0 auto" }}
        role="main"
      >
        {/* Info */}
        <div
          className="rounded-3xl p-5 shadow flex items-center gap-4"
          style={{ backgroundColor: "white" }}
          role="region"
          aria-label="Información de la receta"
        >
          <div
            className="flex-shrink-0 flex items-center justify-center rounded-2xl"
            style={{ width: 80, height: 80, fontSize: "2.8rem", backgroundColor: "#DCFCE7" }}
            aria-hidden="true"
          >
            {recipe.emoji}
          </div>
          <div>
            <h2 className="font-extrabold text-gray-900" style={{ fontSize: "1.2rem" }}>
              {recipe.name}
            </h2>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="bg-green-100 text-green-700 rounded-full px-3 py-0.5 font-bold" style={{ fontSize: "0.85rem" }}>
                ⏱ {recipe.time}
              </span>
              <span className="bg-blue-100 text-blue-700 rounded-full px-3 py-0.5 font-bold" style={{ fontSize: "0.85rem" }}>
                {recipe.difficulty}
              </span>
              <span className="bg-yellow-100 text-yellow-700 rounded-full px-3 py-0.5 font-bold" style={{ fontSize: "0.85rem" }}>
                🍽 {recipe.servings}
              </span>
            </div>
          </div>
        </div>

        {/* Ingredients */}
        <section
          className="rounded-3xl p-5 shadow"
          style={{ backgroundColor: "white" }}
          aria-label="Ingredientes"
        >
          <h3
            className="font-extrabold text-gray-800 mb-4"
            style={{ fontSize: "1.2rem" }}
          >
            🛒 Ingredientes
          </h3>
          <ul className="flex flex-col gap-2" aria-label={`Ingredientes de ${recipe.name}`}>
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl p-3"
                style={{ backgroundColor: "#F0FDF4", fontSize: "1.05rem" }}
              >
                <span className="text-green-500 font-bold flex-shrink-0" aria-hidden="true">●</span>
                <span className="font-medium text-gray-800">{ing}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section
          className="rounded-3xl p-5 shadow"
          style={{ backgroundColor: "white" }}
          aria-label="Pasos de preparación"
        >
          <h3
            className="font-extrabold text-gray-800 mb-4"
            style={{ fontSize: "1.2rem" }}
          >
            👩‍🍳 Preparación
          </h3>
          <ol className="flex flex-col gap-3" aria-label={`Pasos para preparar ${recipe.name}`}>
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className="flex items-start gap-4 rounded-2xl p-4"
                style={{ backgroundColor: "#DCFCE7", fontSize: "1.05rem" }}
              >
                <span
                  className="flex-shrink-0 flex items-center justify-center rounded-full font-extrabold text-white bg-green-600"
                  style={{ width: 40, height: 40, fontSize: "1.1rem" }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span className="font-medium text-gray-800 leading-snug pt-1">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Tip */}
        <div
          className="rounded-3xl p-5 shadow flex items-start gap-3"
          style={{ backgroundColor: "#FEF3C7", border: "2px solid #FCD34D" }}
          role="note"
          aria-label="Consejo de la receta"
        >
          <span style={{ fontSize: "1.5rem" }} aria-hidden="true">💡</span>
          <p className="font-semibold text-yellow-900" style={{ fontSize: "1.05rem" }}>
            {recipe.tip}
          </p>
        </div>
      </main>
    </div>
  );
}
