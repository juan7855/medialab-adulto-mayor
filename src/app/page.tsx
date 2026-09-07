import Link from "next/link";

const SECTIONS = [
  {
    href: "/ejercicios",
    emoji: "🏃",
    label: "Ejercicios",
    description: "Rutinas y videos",
    bg: "#2563EB",
    border: "#1D4ED8",
    textColor: "white",
  },
  {
    href: "/nutricion",
    emoji: "🥗",
    label: "Nutrición",
    description: "Comidas y agua",
    bg: "#16A34A",
    border: "#15803D",
    textColor: "white",
  },
  {
    href: "/medicamentos",
    emoji: "💊",
    label: "Medicamentos",
    description: "Pastillas y recordatorios",
    bg: "#DC2626",
    border: "#B91C1C",
    textColor: "white",
  },
  {
    href: "/rutina",
    emoji: "📅",
    label: "Rutina",
    description: "Agenda del día",
    bg: "#7C3AED",
    border: "#6D28D9",
    textColor: "white",
  },
];

function getCurrentGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

function getTodayDate() {
  return new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function HomePage() {
  const greeting = getCurrentGreeting();
  const today = getTodayDate();

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#F0F4FF" }}
      role="main"
    >
      {/* Header */}
      <header
        className="w-full text-white text-center py-6 px-4 shadow-lg"
        style={{ background: "linear-gradient(135deg, #1E40AF 0%, #2563EB 100%)" }}
        role="banner"
      >
        <div className="flex items-center justify-center gap-3 mb-1">
          <span style={{ fontSize: "2.5rem" }} aria-hidden="true">❤️</span>
          <h1
            className="font-extrabold tracking-tight"
            style={{ fontSize: "2rem", lineHeight: 1.1 }}
          >
            MiSalud
          </h1>
        </div>
        <p
          className="font-semibold opacity-90 mt-1"
          style={{ fontSize: "1.15rem" }}
          aria-label={`${greeting}. Hoy es ${today}`}
        >
          {greeting} 👋
        </p>
        <p
          className="opacity-80 mt-1 capitalize"
          style={{ fontSize: "0.95rem" }}
          aria-hidden="true"
        >
          {today}
        </p>
      </header>

      {/* 2×2 Grid */}
      <section
        aria-label="Menú principal"
        className="flex-1 grid grid-cols-2 gap-4 p-5"
        style={{ maxWidth: "480px", width: "100%", margin: "0 auto" }}
      >
        {SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            role="button"
            aria-label={`Ir a ${section.label}: ${section.description}`}
            className="flex flex-col items-center justify-center rounded-3xl shadow-lg active:scale-95 transition-transform duration-150 select-none"
            style={{
              backgroundColor: section.bg,
              border: `3px solid ${section.border}`,
              minHeight: "180px",
              padding: "20px 12px",
              textDecoration: "none",
            }}
          >
            {/* Icon */}
            <div
              className="flex items-center justify-center rounded-2xl mb-4"
              style={{
                width: 96,
                height: 96,
                backgroundColor: "rgba(255,255,255,0.2)",
                fontSize: "3.2rem",
              }}
              aria-hidden="true"
            >
              {section.emoji}
            </div>

            {/* Label */}
            <span
              className="font-extrabold text-center leading-tight"
              style={{
                color: section.textColor,
                fontSize: "1.3rem",
                letterSpacing: "-0.01em",
              }}
            >
              {section.label}
            </span>

            {/* Description */}
            <span
              className="text-center mt-1"
              style={{
                color: "rgba(255,255,255,0.85)",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              {section.description}
            </span>
          </Link>
        ))}
      </section>

      {/* Emergency Contact Banner */}
      <div className="px-5 pb-6" style={{ maxWidth: "480px", width: "100%", margin: "0 auto" }}>
        <Link
          href="/emergencia"
          role="button"
          aria-label="Botón de emergencia: contactar a familiar o médico"
          className="flex items-center justify-center gap-3 w-full rounded-3xl shadow-lg active:scale-95 transition-transform duration-150"
          style={{
            backgroundColor: "#FF4500",
            border: "3px solid #CC3700",
            minHeight: "72px",
            textDecoration: "none",
            padding: "0 20px",
          }}
        >
          <span style={{ fontSize: "2rem" }} aria-hidden="true">🆘</span>
          <span
            className="font-extrabold text-white"
            style={{ fontSize: "1.25rem" }}
          >
            EMERGENCIA
          </span>
        </Link>
      </div>

      {/* Footer */}
      <footer
        className="text-center py-4 text-gray-500"
        style={{ fontSize: "0.85rem" }}
        role="contentinfo"
      >
        MiSalud © 2025 · App para adultos mayores
      </footer>
    </main>
  );
}
