import BotonImprimir from "../BotonImprimir";

/**
 * Guion imprimible para el facilitador que acompaña al tester durante los
 * 15 minutos de la prueba. Sin sesión, igual que /admin/fichas, va fuera
 * del middleware (ver src/middleware.ts matcher). Hardcoded a propósito:
 * si cambia el guion, se actualiza acá, no vale la pena abstraerlo.
 */

interface Paso {
  minuto: string;
  titulo: string;
  pedir: string;
  observar: string;
}

const PASOS: Paso[] = [
  {
    minuto: "0–1",
    titulo: "Entrada",
    pedir:
      "Entréguele la ficha con la clave. Dígale: «Imagínese que es don Álvaro (o doña Marta) por los próximos 15 minutos». Pídale que escriba la clave.",
    observar:
      "¿Encuentra sin ayuda dónde escribir la clave? ¿Los números del teclado le quedan cómodos?",
  },
  {
    minuto: "1–3",
    titulo: "Cómo se siente hoy",
    pedir:
      "Pídale que toque «Contarle cómo estoy» y que conteste cada pregunta. Que elija el número que mejor describa cómo se siente.",
    observar: "¿Entiende las preguntas? ¿Los números del 1 al 10 le resultan claros?",
  },
  {
    minuto: "3–6",
    titulo: "Ejercicios y rutina",
    pedir:
      "Dígale que vaya a «Ejercicios» desde el Inicio. Si hoy le toca una rutina, pídale que abra uno de los ejercicios y mire el video. Si es caminata o descanso, pregúntele qué entiende de la pantalla.",
    observar:
      "¿Encuentra el video? ¿Puede abrir y cerrar los pasos del acordeón? ¿El video se ve del tamaño correcto?",
  },
  {
    minuto: "6–8",
    titulo: "Medicamentos",
    pedir:
      "Pídale que vaya a «Medicamentos» y marque uno como tomado. Luego pídale que lo desmarque, por si se equivocó.",
    observar: "¿Entiende la diferencia entre «marcar» y «deshacer»? ¿Es claro qué toca hoy?",
  },
  {
    minuto: "8–10",
    titulo: "Nutrición",
    pedir:
      "Dígale que vaya a «Nutrición». Primero el agua: que toque el vaso que marque los que lleva tomados hoy. Después «Lo que comí»: que marque un grupo de alimentos.",
    observar:
      "¿Los vasos de agua se entienden solos? ¿Los grupos de alimentos le dicen algo útil?",
  },
  {
    minuto: "10–12",
    titulo: "Comunidad",
    pedir:
      "Pídale que vaya a «Comunidad», que lea una publicación, que la comente o que publique algo breve si se anima.",
    observar:
      "¿Distingue entre lectores (colores de avatar)? ¿Publicar le parece sencillo o lo evita?",
  },
  {
    minuto: "12–14",
    titulo: "Emergencia",
    pedir:
      "Pregúntele qué cree que hace el botón rojo de abajo. Pídale (sin tocarlo) que le cuente qué espera que pase si lo toca en una emergencia.",
    observar:
      "¿Lo reconoce inmediatamente como «emergencia»? ¿Le genera confianza o temor tocarlo?",
  },
  {
    minuto: "14–15",
    titulo: "Preguntas finales",
    pedir:
      "Pregunte: ¿Qué fue lo más fácil? ¿Qué fue lo más confuso? ¿Qué le gustaría ver aquí que hoy no está? ¿Lo usaría todos los días?",
    observar:
      "Anote la respuesta textual: las palabras de la persona valen más que la paráfrasis.",
  },
];

const RECORDATORIOS = [
  "Entre un tester y el próximo, toque «Reiniciar demo» en el pie de la pantalla de la clave y elija el perfil que va a reusar. Eso deja la aplicación como si fuera la primera vez.",
  "No corrija lo que hace el tester: si se pierde, anote dónde se perdió. Es información más valiosa que la prueba perfecta.",
  "Si nombra algo con otras palabras («la cosa roja», «el bichito del agua»), anote esas palabras: es lenguaje de usuario real.",
  "Al final, agradezca y recuérdele que su opinión va a mejorar la app para otras personas como él o ella.",
];

export const metadata = {
  title: "Guion del facilitador",
  robots: { index: false, follow: false },
};

export default function GuionPage() {
  return (
    <main
      className="min-h-screen p-5"
      style={{ backgroundColor: "var(--bg)" }}
      role="main"
    >
      <header className="no-print mb-5 max-w-4xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h1 style={{ fontSize: "var(--t-lg)", fontWeight: 800 }}>Guion del facilitador</h1>
          <BotonImprimir />
        </div>
        <p
          className="mt-1.5"
          style={{ fontSize: "var(--t-sm)", fontWeight: 500, color: "var(--ink-mute)", lineHeight: 1.4 }}
        >
          Imprímalo o déjelo abierto en su celular mientras acompaña al tester. Son 15 minutos en
          total, un paso cada 2 minutos aproximadamente.
        </p>
      </header>

      <article className="max-w-4xl mx-auto flex flex-col gap-4">
        <header
          className="card p-5"
          style={{
            backgroundColor: "var(--green-tint)",
            borderColor: "var(--green-line)",
            borderRadius: "var(--r-xl)",
          }}
        >
          <h2 style={{ fontSize: "var(--t-lg)", fontWeight: 800 }}>
            Prueba de usuario · Panela
          </h2>
          <p
            className="mt-1"
            style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}
          >
            15 minutos · Dos perfiles disponibles: don Álvaro (72, hipertensión) y doña Marta (68,
            diabetes). Reparta los perfiles 50/50 entre los testers.
          </p>
        </header>

        <ol className="flex flex-col gap-3 list-none p-0 m-0">
          {PASOS.map((paso, i) => (
            <li
              key={i}
              className="card paso p-5"
              style={{ borderRadius: "var(--r-xl)", display: "flex", gap: "1rem" }}
            >
              <div
                style={{
                  flexShrink: 0,
                  minWidth: "3.8rem",
                  textAlign: "center",
                  borderRight: "1px solid var(--line)",
                  paddingRight: "1rem",
                }}
              >
                <p
                  style={{
                    fontSize: "var(--t-xs)",
                    fontWeight: 700,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--ink-mute)",
                  }}
                >
                  Min
                </p>
                <p
                  style={{ fontSize: "var(--t-md)", fontWeight: 800, color: "var(--ink)" }}
                >
                  {paso.minuto}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <h3 style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>{paso.titulo}</h3>
                <p
                  className="mt-1.5"
                  style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.4 }}
                >
                  <strong style={{ fontWeight: 700 }}>Pídale:</strong> {paso.pedir}
                </p>
                <p
                  className="mt-1.5"
                  style={{
                    fontSize: "var(--t-sm)",
                    fontWeight: 500,
                    lineHeight: 1.4,
                    color: "var(--ink-soft)",
                  }}
                >
                  <strong style={{ fontWeight: 700 }}>Observe:</strong> {paso.observar}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <section
          className="card p-5"
          style={{
            backgroundColor: "var(--yellow-tint)",
            borderColor: "var(--yellow-line)",
            borderRadius: "var(--r-xl)",
          }}
        >
          <h3 style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>Antes y durante la prueba</h3>
          <ul className="mt-2 flex flex-col gap-1.5 list-disc pl-5">
            {RECORDATORIOS.map((r, i) => (
              <li
                key={i}
                style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.4 }}
              >
                {r}
              </li>
            ))}
          </ul>
        </section>
      </article>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          main { padding: 0 !important; background: white !important; }
          .paso { break-inside: avoid; }
        }
      `}</style>
    </main>
  );
}
