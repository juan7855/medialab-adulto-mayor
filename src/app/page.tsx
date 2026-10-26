import { rem } from "@/lib/scale";
import TecladoNumerico from "@/components/TecladoNumerico";

export default function AccesoPage() {
  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      {/* Marca */}
      <div className="flex items-center gap-2 pt-6 pb-6 px-1">
        {/* eslint-disable-next-line @next/next/no-img-element -- logo local */}
        <img src="/logo/panela-logo.png" alt="Panela" style={{ height: rem(30), width: "auto" }} />
      </div>

      <div className="px-1">
        <h1 style={{ fontSize: "var(--t-2xl)", fontWeight: 800, lineHeight: 1.08 }}>
          Escriba su clave
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
        Panela · Su salud, día a día
      </footer>
    </main>
  );
}
