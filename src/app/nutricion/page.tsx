import Link from "next/link";
import {
  ChefHat,
  ChevronRight,
  Droplets,
  Lightbulb,
  Salad,
  Soup,
  UtensilsCrossed,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import IconTile from "@/components/IconTile";
import WaterTracker from "./WaterTracker";
import MealList from "./MealList";
import { SECTIONS, type AccentName } from "@/lib/theme";

const SECTION = SECTIONS.find((s) => s.href === "/nutricion")!;

const RECIPES: {
  id: string;
  name: string;
  icon: LucideIcon;
  accent: AccentName;
  time: string;
  difficulty: string;
}[] = [
  { id: "sopa-verduras", name: "Sopa de Verduras", icon: Soup, accent: "orange", time: "30 min", difficulty: "Fácil" },
  { id: "ensalada-atun", name: "Ensalada con Atún", icon: Salad, accent: "green", time: "15 min", difficulty: "Muy fácil" },
  { id: "avena-fruta", name: "Avena con Fruta", icon: Wheat, accent: "yellow", time: "10 min", difficulty: "Muy fácil" },
];

const TIPS = [
  "Bebe al menos 8 vasos de agua al día.",
  "Come 5 porciones de frutas y verduras cada día.",
  "Reduce la sal para cuidar tu corazón.",
  "Come pescado 2 veces por semana.",
];

export default function NutricionPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Nutrición"
        subtitle="Come bien y toma agua"
        iconSrc={SECTION.icon}
        accent={SECTION.accent}
        backHref="/"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4 flex flex-col gap-7" role="main">
        {/* Agua */}
        <section aria-label="Control de agua">
          <SectionTitle icon={Droplets} accent="cyan">
            Agua de hoy
          </SectionTitle>
          <div className="card p-4 mt-3">
            <WaterTracker />
          </div>
        </section>

        {/* Menú */}
        <section aria-label="Menú del día">
          <SectionTitle icon={UtensilsCrossed} accent="orange">
            Menú de hoy
          </SectionTitle>
          <div className="mt-3">
            <MealList />
          </div>
        </section>

        {/* Recetas */}
        <section aria-label="Recetas saludables">
          <SectionTitle icon={ChefHat} accent="green">
            Recetas
          </SectionTitle>

          <ul className="flex flex-col gap-3 mt-3 list-none p-0 m-0">
            {RECIPES.map((recipe) => (
              <li key={recipe.id}>
                <Link
                  href={`/nutricion/receta/${recipe.id}`}
                  className="card pressable flex items-center gap-3.5 p-3.5"
                  style={{ textDecoration: "none", color: "inherit" }}
                  aria-label={`Receta ${recipe.name}. ${recipe.time}, dificultad ${recipe.difficulty}`}
                >
                  <IconTile icon={recipe.icon} accent={recipe.accent} size={60} strokeWidth={1.9} />
                  <span className="flex-1 min-w-0">
                    <span className="block" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
                      {recipe.name}
                    </span>
                    <span
                      className="block mt-1"
                      style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
                    >
                      {recipe.time} · {recipe.difficulty}
                    </span>
                  </span>
                  <ChevronRight size={26} strokeWidth={2.3} color="var(--ink-mute)" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Consejos */}
        <section aria-label="Consejos de nutrición">
          <SectionTitle icon={Lightbulb} accent="yellow">
            Consejos
          </SectionTitle>

          <ul className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
            {TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2.5 p-3.5"
                style={{
                  backgroundColor: "var(--surface)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-md)",
                  fontSize: "var(--t-sm)",
                  fontWeight: 500,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "999px",
                    backgroundColor: "var(--yellow-solid)",
                    flexShrink: 0,
                    marginTop: 8,
                  }}
                />
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
