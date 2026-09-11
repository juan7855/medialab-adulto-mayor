import { HeartPulse } from "lucide-react";
import TecladoNumerico from "@/components/TecladoNumerico";

export default function AccesoPage() {
  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      {/* Marca */}
      <div className="flex items-center gap-2 pt-6 pb-6 px-1">
        <HeartPulse size={22} strokeWidth={2.2} color="var(--ink)" aria-hidden="true" />
        <span
          style={{
            fontSize: "var(--t-xs)",
            fontWeight: 800,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          MiSalud
        </span>
      </div>

      <div className="px-1">
        <h1 style={{ fontSize: "var(--t-2xl)", fontWeight: 800, lineHeight: 1.08 }}>
          Escribe tu clave
        </h1>
        <p
          className="mt-2"
          style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
        >
          Son cuatro números
        </p>
      </div>

      <div className="mt-7">
        <TecladoNumerico />
      </div>

      <footer
        className="text-center mt-auto pt-9"
        style={{ fontSize: "var(--t-xs)", color: "var(--ink-mute)", fontWeight: 500 }}
        role="contentinfo"
      >
        MiSalud · Tu salud, día a día
      </footer>
    </main>
  );
}
