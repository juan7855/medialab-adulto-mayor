import Link from "next/link";
import {
  Apple,
  ChefHat,
  ChevronRight,
  Clock,
  CookingPot,
  Croissant,
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
import { ACCENTS, type AccentName } from "@/lib/theme";

const MEALS: {
  id: string;
  name: string;
  time: string;
  icon: LucideIcon;
  accent: AccentName;
  items: string[];
}[] = [
  {
    id: "desayuno",
    name: "Desayuno",
    time: "7:00 – 8:00",
    icon: Croissant,
    accent: "amber",
    items: ["Avena con fruta", "Té o leche", "Pan integral"],
  },
  {
    id: "almuerzo",
    name: "Almuerzo",
    time: "12:00 – 13:00",
    icon: CookingPot,
    accent: "orange",
    items: ["Sopa de verduras", "Pollo al vapor", "Ensalada verde", "Arroz integral"],
  },
  {
    id: "cena",
    name: "Cena",
    time: "18:00 – 19:00",
    icon: Salad,
    accent: "green",
    items: ["Ensalada con atún", "Pan integral", "Fruta de temporada"],
  },
];

const RECIPES: { id: string; name: string; icon: LucideIcon; accent: AccentName; time: string; difficulty: string }[] = [
  { id: "sopa-verduras", name: "Sopa de Verduras", icon: Soup, accent: "orange", time: "30 min", difficulty: "Fácil" },
  { id: "ensalada-atun", name: "Ensalada con Atún", icon: Salad, accent: "green", time: "15 min", difficulty: "Muy fácil" },
  { id: "avena-fruta", name: "Avena con Fruta", icon: Wheat, accent: "amber", time: "10 min", difficulty: "Muy fácil" },
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
        icon={Apple}
        accent="orange"
        backHref="/"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4 flex flex-col gap-7" role="main">
        {/* Agua */}
        <section aria-label="Control de agua">
          <SectionTitle icon={Droplets} accent="blue">
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

          <div className="flex flex-col gap-3.5 mt-3">
            {MEALS.map((meal) => {
              const tone = ACCENTS[meal.accent];
              const Icon = meal.icon;

              return (
                <article key={meal.id} className="card" style={{ overflow: "hidden" }}>
                  {/* Portada teñida */}
                  <div
                    className="flex items-center justify-center"
                    style={{
                      height: 104,
                      backgroundColor: tone.tint,
                      borderBottom: `1px solid ${tone.line}`,
                    }}
                    aria-hidden="true"
                  >
                    <Icon size={46} strokeWidth={1.4} color={tone.ink} />
                  </div>

                  <div className="p-4">
                    <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{meal.name}</h3>
                    <span className="pill mt-2">
                      <Clock size={13} strokeWidth={2.2} aria-hidden="true" />
                      {meal.time}
                    </span>

                    <ul className="flex flex-col gap-1.5 mt-3.5 list-none p-0 m-0">
                      {meal.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-center gap-2.5"
                          style={{ fontSize: "0.9rem", fontWeight: 500 }}
                        >
                          <span
                            aria-hidden="true"
                            style={{
                              width: 5,
                              height: 5,
                              borderRadius: "999px",
                              backgroundColor: tone.ink,
                              flexShrink: 0,
                            }}
                          />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              );
            })}
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
                  <IconTile icon={recipe.icon} accent={recipe.accent} size={58} strokeWidth={1.7} />
                  <span className="flex-1 min-w-0">
                    <span className="block" style={{ fontSize: "1rem", fontWeight: 800 }}>
                      {recipe.name}
                    </span>
                    <span
                      className="block mt-1"
                      style={{ fontSize: "0.74rem", fontWeight: 500, color: "var(--ink-mute)" }}
                    >
                      {recipe.time} · {recipe.difficulty}
                    </span>
                  </span>
                  <ChevronRight size={22} strokeWidth={2.2} color="var(--ink-mute)" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Consejos */}
        <section aria-label="Consejos de nutrición">
          <SectionTitle icon={Lightbulb} accent="amber">
            Consejos
          </SectionTitle>

          <ul className="flex flex-col gap-2 mt-3 list-none p-0 m-0">
            {TIPS.map((tip) => (
              <li
                key={tip}
                className="flex items-start gap-2.5 p-3.5"
                style={{
                  backgroundColor: "var(--surface-soft)",
                  border: "1px solid var(--line)",
                  borderRadius: "var(--r-md)",
                  fontSize: "0.86rem",
                  fontWeight: 500,
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "999px",
                    backgroundColor: "var(--amber-ink)",
                    flexShrink: 0,
                    marginTop: 7,
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
