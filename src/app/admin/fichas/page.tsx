import Avatar from "@/components/Avatar";
import BotonImprimir from "../BotonImprimir";

/**
 * Dos fichas imprimibles / compartibles con el perfil y la clave que cada
 * tester recibe antes de empezar la prueba. No es una página pública para
 * el adulto mayor: es herramienta del facilitador. Sin sesión; va fuera
 * del middleware (ver src/middleware.ts matcher).
 *
 * Diseñada para dos cosas:
 *   - Impresión en una hoja tamaño carta (dos tarjetas lado a lado).
 *   - Captura de pantalla para WhatsApp (cada tarjeta se ve sola en el
 *     celular; el media-query de impresión no la afecta ahí).
 *
 * Los datos van hardcoded a propósito: si en el futuro cambian las claves
 * o los perfiles demo, se actualizan acá en una sola línea. No vale la
 * pena leerlos de la base porque esta página no es parte del producto.
 */

interface Perfil {
  id: number;
  nombre: string;
  edad: number;
  condicion: string;
  pin: string;
  roleplay: string;
}

const PERFILES: Perfil[] = [
  {
    id: 5,
    nombre: "Don Álvaro Ruiz",
    edad: 72,
    condicion: "Vive con hipertensión",
    pin: "1776",
    roleplay:
      "Imagínese que es don Álvaro por los próximos 15 minutos. Toma pastillas para la presión en la mañana y en la noche, y le gusta salir a caminar.",
  },
  {
    id: 4,
    nombre: "Doña Marta González",
    edad: 68,
    condicion: "Vive con diabetes tipo 2",
    pin: "7642",
    roleplay:
      "Imagínese que es doña Marta por los próximos 15 minutos. Toma Metformina con las comidas y cuida los azúcares y las porciones de arroz y papa.",
  },
];

export const metadata = {
  title: "Fichas para los testers",
  robots: { index: false, follow: false },
};

export default function FichasPage() {
  return (
    <main
      className="min-h-screen p-5"
      style={{ backgroundColor: "var(--bg)" }}
      role="main"
    >
      <header className="no-print mb-5 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h1 style={{ fontSize: "var(--t-lg)", fontWeight: 800 }}>Fichas para los testers</h1>
          <BotonImprimir />
        </div>
        <p
          className="mt-1.5"
          style={{ fontSize: "var(--t-sm)", fontWeight: 500, color: "var(--ink-mute)", lineHeight: 1.4 }}
        >
          Imprima esta página, recorte las dos tarjetas y entregue una a cada tester antes de
          empezar. También puede tomarles pantallazo para compartir por WhatsApp.
        </p>
      </header>

      <div className="grid gap-5 max-w-5xl mx-auto fichas-grid">
        {PERFILES.map((p) => (
          <Ficha key={p.id} perfil={p} />
        ))}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          main { padding: 0 !important; background: white !important; }
          .fichas-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 1rem !important;
            padding: 1rem !important;
            max-width: none !important;
          }
          .ficha { break-inside: avoid; }
        }
        @media (min-width: 640px) {
          .fichas-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </main>
  );
}

function Ficha({ perfil }: { perfil: Perfil }) {
  return (
    <article
      className="ficha card p-6"
      style={{
        borderRadius: "var(--r-xl)",
        display: "flex",
        flexDirection: "column",
        gap: "1.2rem",
      }}
    >
      <header className="flex flex-col items-center text-center gap-2">
        <Avatar patientId={perfil.id} name={perfil.nombre} size={72} />
        <p
          style={{
            fontSize: "var(--t-xs)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--ink-mute)",
          }}
        >
          Su perfil para hoy
        </p>
        <h2 style={{ fontSize: "var(--t-xl)", fontWeight: 800, lineHeight: 1.15 }}>
          {perfil.nombre}
        </h2>
        <p style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-soft)" }}>
          {perfil.edad} años · {perfil.condicion}
        </p>
      </header>

      <p
        className="text-center"
        style={{ fontSize: "var(--t-sm)", fontWeight: 500, lineHeight: 1.45 }}
      >
        {perfil.roleplay}
      </p>

      <div
        className="p-4 text-center"
        style={{
          backgroundColor: "var(--green-tint)",
          border: "1px solid var(--green-line)",
          borderRadius: "var(--r-lg)",
        }}
      >
        <p
          style={{
            fontSize: "var(--t-xs)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "var(--green-deep)",
          }}
        >
          Su clave de cuatro números
        </p>
        <p
          className="mt-1"
          style={{ fontSize: "2.4rem", fontWeight: 800, letterSpacing: "0.3em", color: "var(--ink)" }}
        >
          {perfil.pin}
        </p>
      </div>

      <p
        style={{
          fontSize: "var(--t-xs)",
          fontWeight: 500,
          color: "var(--ink-mute)",
          textAlign: "center",
        }}
      >
        Entre a <strong style={{ color: "var(--ink)" }}>salud-medialab.vercel.app</strong> y escriba
        la clave.
      </p>
    </article>
  );
}
