import { rem } from "@/lib/scale";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { redirect } from "next/navigation";
import { obtenerPacienteId } from "@/lib/auth";
import { encuestaCompleta } from "@/lib/encuesta-servidor";
import TarjetaAsistente from "@/components/TarjetaAsistente";
import CerrarSesion from "@/components/CerrarSesion";
import Greeting from "@/components/Greeting";
import ResumenHoy from "@/components/ResumenHoy";
import Gota, { type Esquina } from "@/components/Gota";
import { COMUNIDAD, SECTIONS, type Section } from "@/lib/theme";

/**
 * Las cuatro fichas del inicio, en el orden del Figma (A02). Medicamentos y
 * la rutina no van aquí: están dentro de "Todo lo de hoy", justo encima.
 */
const FICHAS: Section[] = ["/ejercicios", "/nutricion", "/comunidad", "/cognitivo"].map(
  (href) => [...SECTIONS, COMUNIDAD].find((s) => s.href === href)!,
);

/** La esquina recta de cada gota, como las gira el Figma. */
const ESQUINAS: Record<string, Esquina> = {
  "/ejercicios": "abajo-der",
  "/nutricion": "abajo-izq",
  "/medicamentos": "abajo-der",
  "/cognitivo": "arriba-izq",
  "/rutina": "arriba-der",
  "/comunidad": "abajo-izq",
};

/**
 * Ficha de sección del Figma: tarjeta blanca con borde arena, gota de color
 * en un cuadro claro y el nombre debajo. Dos por fila; el texto va a tamaño
 * reducido porque "Medicamentos" debe caber en media pantalla.
 */
function SectionTile({ section }: { section: Section }) {
  return (
    <Link
      href={section.href}
      className="card pressable flex flex-col justify-between gap-4 p-3.5 h-full"
      style={{
        borderRadius: "var(--r-xl)",
        textDecoration: "none",
        color: "inherit",
        minHeight: rem(118),
      }}
      aria-label={`${section.label}. ${section.description}`}
    >
      <Gota accent={section.accent} size={52} esquina={ESQUINAS[section.href]} enCuadro />
      <span style={{ fontSize: "var(--t-sm)", fontWeight: 600, lineHeight: 1.15 }}>
        {section.label}
      </span>
    </Link>
  );
}

export default async function HomePage() {
  // middleware.ts ya garantiza que hay sesión antes de llegar aquí.
  const patientId = (await obtenerPacienteId())!;
  // La encuesta de bienestar es obligatoria antes de usar la app.
  if (!(await encuestaCompleta(patientId))) redirect("/encuesta");
  const [patient] = await db
    .select({ name: patients.name })
    .from(patients)
    .where(eq(patients.id, patientId));
  const primerNombre = patient?.name.split(" ")[0] ?? "";

  return (
    <main className="min-h-screen flex flex-col px-4 pb-8" role="main">
      {/* Marca */}
      <div className="flex items-center justify-between gap-2 pt-6 pb-4 px-1">
        <div className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element -- logo local */}
          <img src="/logo/panela-logo.png" alt="Panela" style={{ height: rem(34), width: "auto" }} />
        </div>
      </div>

      {/* Bienvenida: Panela habla con la persona */}
      <section
        className="relative overflow-hidden p-4"
        style={{ backgroundColor: "var(--beige)", borderRadius: "var(--r-xl)" }}
        aria-label="Bienvenida"
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: rem(130),
            height: rem(110),
            borderRadius: `0 0 0 ${rem(110)}`,
            backgroundColor: "var(--beige-deep)",
          }}
        />
        <div className="relative">
          <Greeting name={primerNombre} />
          <TarjetaAsistente />
        </div>
      </section>

      <div className="mt-4">
        <ResumenHoy />
      </div>

      <nav aria-label="Secciones principales" className="grid grid-cols-2 gap-3 mt-3">
        {FICHAS.map((section, i) => (
          <div key={section.href} className="animate-rise" style={{ animationDelay: `${i * 40}ms` }}>
            <SectionTile section={section} />
          </div>
        ))}
      </nav>

      <footer
        className="text-center mt-auto pt-9 flex flex-col gap-4"
        style={{ fontSize: "var(--t-xs)", color: "var(--ink-mute)", fontWeight: 500 }}
        role="contentinfo"
      >
        Panela · Su salud, día a día
        <CerrarSesion />
      </footer>
    </main>
  );
}
