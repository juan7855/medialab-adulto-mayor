import PageHeader from "@/components/PageHeader";
import WaterTracker from "./WaterTracker";
import Link from "next/link";

const MEALS = [
  {
    id: "desayuno",
    name: "Desayuno",
    time: "7:00 – 8:00 AM",
    emoji: "🍳",
    items: ["Avena con fruta", "Té o leche", "Pan integral"],
    color: "#FEF9C3",
    borderColor: "#FCD34D",
  },
  {
    id: "almuerzo",
    name: "Almuerzo",
    time: "12:00 – 1:00 PM",
    emoji: "🍲",
    items: ["Sopa de verduras", "Pollo al vapor", "Ensalada verde", "Arroz integral"],
    color: "#DCFCE7",
    borderColor: "#86EFAC",
  },
  {
    id: "cena",
    name: "Cena",
    time: "6:00 – 7:00 PM",
    emoji: "🥗",
    items: ["Ensalada con atún", "Pan integral", "Fruta de temporada"],
    color: "#DBEAFE",
    borderColor: "#93C5FD",
  },
];

const TIPS = [
  { emoji: "💧", text: "Bebe al menos 8 vasos de agua al día." },
  { emoji: "🥦", text: "Come 5 porciones de frutas y verduras cada día." },
  { emoji: "🧂", text: "Reduce la sal para cuidar tu corazón." },
  { emoji: "🐟", text: "Come pescado 2 veces por semana." },
];

const RECIPES = [
  {
    id: "sopa-verduras",
    name: "Sopa de Verduras",
    emoji: "🥣",
    time: "30 min",
    difficulty: "Fácil",
  },
  {
    id: "ensalada-atun",
    name: "Ensalada con Atún",
    emoji: "🥗",
    time: "15 min",
    difficulty: "Muy fácil",
  },
  {
    id: "avena-fruta",
    name: "Avena con Fruta",
    emoji: "🍓",
    time: "10 min",
    difficulty: "Muy fácil",
  },
];

export default function NutricionPage() {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F0FDF4" }}>
      <PageHeader
        title="Nutrición"
        emoji="🥗"
        color="#16A34A"
        backHref="/"
        backLabel="Inicio"
      />

      <main
        className="px-4 py-5 flex flex-col gap-5"
        style={{ maxWidth: "480px", margin: "0 auto" }}
        role="main"
      >
        {/* Water tracker */}
        <section
          className="rounded-3xl p-5 shadow"
          style={{ backgroundColor: "white" }}
          aria-label="Control de agua"
        >
          <h2
            className="font-extrabold text-gray-800 mb-3"
            style={{ fontSize: "1.25rem" }}
          >
            💧 Agua de hoy
          </h2>
          <WaterTracker date={today} />
        </section>

        {/* Meals */}
        <section aria-label="Plan de comidas del día">
          <h2
            className="font-extrabold text-gray-800 mb-3 px-1"
            style={{ fontSize: "1.25rem" }}
          >
            🍽 Menú de hoy
          </h2>
          <div className="flex flex-col gap-4">
            {MEALS.map((meal) => (
              <div
                key={meal.id}
                className="rounded-3xl p-5 shadow"
                style={{
                  backgroundColor: meal.color,
                  border: `2px solid ${meal.borderColor}`,
                }}
                role="region"
                aria-label={meal.name}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span style={{ fontSize: "2rem" }} aria-hidden="true">{meal.emoji}</span>
                  <div>
                    <h3 className="font-extrabold text-gray-900" style={{ fontSize: "1.15rem" }}>
                      {meal.name}
                    </h3>
                    <p className="text-gray-500 font-medium" style={{ fontSize: "0.9rem" }}>
                      🕐 {meal.time}
                    </p>
                  </div>
                </div>
                <ul className="flex flex-col gap-1.5" aria-label={`Alimentos de ${meal.name}`}>
                  {meal.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 font-medium text-gray-800"
                      style={{ fontSize: "1.05rem" }}
                    >
                      <span className="text-green-500 font-bold" aria-hidden="true">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Recipes */}
        <section aria-label="Recetas saludables">
          <h2
            className="font-extrabold text-gray-800 mb-3 px-1"
            style={{ fontSize: "1.25rem" }}
          >
            👨‍🍳 Recetas
          </h2>
          <div className="flex flex-col gap-3">
            {RECIPES.map((recipe) => (
              <Link
                key={recipe.id}
                href={`/nutricion/receta/${recipe.id}`}
                className="flex items-center gap-4 rounded-3xl p-4 shadow active:scale-95 transition-transform"
                style={{
                  backgroundColor: "white",
                  border: "2px solid #D1FAE5",
                  textDecoration: "none",
                  minHeight: "88px",
                }}
                aria-label={`Ver receta: ${recipe.name}, ${recipe.time}, dificultad ${recipe.difficulty}`}
              >
                <span style={{ fontSize: "2.2rem" }} aria-hidden="true">{recipe.emoji}</span>
                <div className="flex-1">
                  <div className="font-extrabold text-gray-900" style={{ fontSize: "1.1rem" }}>
                    {recipe.name}
                  </div>
                  <div className="text-gray-500 font-medium mt-0.5" style={{ fontSize: "0.9rem" }}>
                    ⏱ {recipe.time} · {recipe.difficulty}
                  </div>
                </div>
                <span className="text-gray-400 text-2xl" aria-hidden="true">▶</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section aria-label="Consejos de nutrición">
          <h2
            className="font-extrabold text-gray-800 mb-3 px-1"
            style={{ fontSize: "1.25rem" }}
          >
            💡 Consejos
          </h2>
          <div className="flex flex-col gap-3">
            {TIPS.map((tip, i) => (
              <div
                key={i}
                className="rounded-2xl p-4 flex items-start gap-3 shadow-sm"
                style={{ backgroundColor: "#F0FDF4", border: "2px solid #BBF7D0" }}
                role="note"
              >
                <span style={{ fontSize: "1.5rem" }} aria-hidden="true">{tip.emoji}</span>
                <p className="font-semibold text-gray-800" style={{ fontSize: "1.05rem" }}>
                  {tip.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
