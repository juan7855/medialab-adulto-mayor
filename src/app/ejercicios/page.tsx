import Link from "next/link";
import PageHeader from "@/components/PageHeader";

const EXERCISES = [
  {
    id: "caminar",
    name: "Caminata Suave",
    level: "Ligero",
    duration: "15 min",
    emoji: "🚶",
    description: "Caminata pausada para activar el cuerpo",
    color: "#DBEAFE",
    levelColor: "#2563EB",
    steps: [
      "Ponte ropa cómoda y zapatos antideslizantes",
      "Comienza caminando despacio durante 2 minutos",
      "Mantén la espalda recta y los brazos relajados",
      "Camina a paso normal durante 10 minutos",
      "Termina con 3 minutos de caminata muy lenta",
    ],
  },
  {
    id: "estiramiento",
    name: "Estiramiento",
    level: "Ligero",
    duration: "10 min",
    emoji: "🧘",
    description: "Ejercicios de flexibilidad sentado",
    color: "#DCFCE7",
    levelColor: "#16A34A",
    steps: [
      "Siéntate en una silla firme con los pies en el suelo",
      "Gira el cuello lentamente de lado a lado (5 veces)",
      "Levanta los brazos sobre la cabeza y baja lentamente (8 veces)",
      "Estira las piernas hacia adelante una a una (5 veces)",
      "Respira profundo 5 veces para terminar",
    ],
  },
  {
    id: "equilibrio",
    name: "Equilibrio",
    level: "Moderado",
    duration: "12 min",
    emoji: "⚖️",
    description: "Ejercicios para mejorar el equilibrio",
    color: "#FEF9C3",
    levelColor: "#CA8A04",
    steps: [
      "Párate junto a una silla o pared para apoyo",
      "Levanta un pie del suelo por 10 segundos",
      "Repite con el otro pie (5 veces cada uno)",
      "Camina talón-punta en línea recta (10 pasos)",
      "Descansa sentado 2 minutos",
    ],
  },
  {
    id: "fuerza",
    name: "Fuerza Suave",
    level: "Moderado",
    duration: "15 min",
    emoji: "💪",
    description: "Ejercicios de fuerza sin pesas",
    color: "#FFE4E6",
    levelColor: "#DC2626",
    steps: [
      "Siéntate y levántate de la silla sin usar los brazos (8 veces)",
      "Aprieta y suelta los puños durante 30 segundos",
      "Levanta los talones del suelo parado (10 veces)",
      "Haz pequeños círculos con los hombros (5 cada dirección)",
      "Termina con respiración profunda",
    ],
  },
];

export default function EjerciciosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EFF6FF" }}>
      <PageHeader
        title="Ejercicios"
        emoji="🏃"
        color="#2563EB"
        backHref="/"
        backLabel="Inicio"
      />

      <main className="px-4 py-5" style={{ maxWidth: "480px", margin: "0 auto" }} role="main">
        {/* Intro card */}
        <div
          className="rounded-3xl p-5 mb-5 shadow"
          style={{ backgroundColor: "#DBEAFE", border: "2px solid #93C5FD" }}
          role="region"
          aria-label="Consejo del día"
        >
          <p
            className="font-semibold text-blue-900 text-center"
            style={{ fontSize: "1.1rem" }}
          >
            💡 Muévete todos los días. ¡Aunque sean 10 minutos!
          </p>
        </div>

        {/* Level filter labels */}
        <div className="flex gap-4 mb-4 px-1">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500"></div>
            <span className="font-medium text-gray-700" style={{ fontSize: "0.95rem" }}>Ligero</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="font-medium text-gray-700" style={{ fontSize: "0.95rem" }}>Moderado</span>
          </div>
        </div>

        {/* Exercise cards */}
        <div className="flex flex-col gap-4" role="list" aria-label="Lista de ejercicios">
          {EXERCISES.map((ex) => (
            <Link
              key={ex.id}
              href={`/ejercicios/${ex.id}`}
              role="listitem"
              aria-label={`${ex.name}, nivel ${ex.level}, duración ${ex.duration}`}
              className="flex items-center gap-4 rounded-3xl shadow-md active:scale-95 transition-transform duration-150"
              style={{
                backgroundColor: ex.color,
                border: `2px solid ${ex.levelColor}30`,
                padding: "18px 20px",
                textDecoration: "none",
                minHeight: "96px",
              }}
            >
              {/* Emoji */}
              <div
                className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                style={{
                  width: 80,
                  height: 80,
                  backgroundColor: "white",
                  fontSize: "2.5rem",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
                aria-hidden="true"
              >
                {ex.emoji}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h2
                  className="font-extrabold text-gray-900 leading-tight"
                  style={{ fontSize: "1.2rem" }}
                >
                  {ex.name}
                </h2>
                <p className="text-gray-600 mt-1" style={{ fontSize: "0.95rem" }}>
                  {ex.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span
                    className="rounded-full px-3 py-0.5 font-bold text-white"
                    style={{ backgroundColor: ex.levelColor, fontSize: "0.85rem" }}
                  >
                    {ex.level}
                  </span>
                  <span className="font-semibold text-gray-600" style={{ fontSize: "0.95rem" }}>
                    ⏱ {ex.duration}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <span className="text-gray-400 text-2xl flex-shrink-0" aria-hidden="true">▶</span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

export { EXERCISES };
