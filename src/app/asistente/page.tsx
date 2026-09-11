import SelectorAsistente from "@/components/SelectorAsistente";

export default function AsistentePage() {
  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      <div className="px-1 pt-8">
        <h1 style={{ fontSize: "var(--t-2xl)", fontWeight: 800, lineHeight: 1.08 }}>
          ¿Quién te acompaña?
        </h1>
        <p
          className="mt-2"
          style={{ fontSize: "var(--t-sm)", fontWeight: 600, color: "var(--ink-mute)" }}
        >
          Elige tu asistente. Estará contigo cada día.
        </p>
      </div>

      <div className="mt-7">
        <SelectorAsistente />
      </div>

      <footer
        className="text-center mt-auto pt-9"
        style={{ fontSize: "var(--t-xs)", color: "var(--ink-mute)", fontWeight: 500 }}
        role="contentinfo"
      >
        Puedes cambiarlo cuando quieras
      </footer>
    </main>
  );
}
