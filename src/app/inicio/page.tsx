import { ASISTENTE } from "@/lib/asistentes";
import { rem } from "@/lib/scale";
import Link from "next/link";
import { eq } from "drizzle-orm";
import {
  Apple,
  Brain,
  CalendarCheck,
  Dumbbell,
  MessagesSquare,
  Pill,
  type LucideIcon,
} from "lucide-react";
import { db } from "@/db";
import { patients } from "@/db/schema";
import { redirect } from "next/navigation";
import { obtenerPacienteId } from "@/lib/auth";
import { encuestaCompleta } from "@/lib/encuesta-servidor";
import TarjetaAsistente from "@/components/TarjetaAsistente";
import CerrarSesion from "@/components/CerrarSesion";
import Greeting from "@/components/Greeting";
import ResumenHoy from "@/components/ResumenHoy";
import { ACCENTS, COMUNIDAD, EMERGENCIA, RUTINA, SECTIONS, type Section } from "@/lib/theme";

/** Glifo de cada sección dentro de su gota de color. */
const GLIFOS: Record<string, LucideIcon> = {
  "/ejercicios": Dumbbell,
  "/nutricion": Apple,
  "/medicamentos": Pill,
  "/cognitivo": Brain,
  "/rutina": CalendarCheck,
  "/comunidad": MessagesSquare,
};

/**
 * Ficha de sección: tarjeta blanca con una gota de color (la forma de la
 * mascota) y el nombre debajo. Dos por fila; el texto va a tamaño reducido
 * porque "Medicamentos" es la palabra más larga y debe caber en media pantalla.
 */
function SectionTile({ section }: { section: Section }) {
  const Glifo = GLIFOS[section.href] ?? Dumbbell;
  const tone = ACCENTS[section.accent];

  return (
    <Link
      href={section.href}
      className="pressable flex flex-col justify-between gap-3 p-3 h-full"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: "var(--r-xl)",
        boxShadow: "var(--shadow-sm)",
        textDecoration: "none",
        color: "inherit",
        minHeight: rem(112),
      }}
      aria-label={`${section.label}. ${section.description}`}
    >
      <span
        className="tile"
        style={{
          width: rem(50),
          height: rem(50),
          backgroundColor: tone.tint,
          border: `1px solid ${tone.line}`,
          borderRadius: "var(--r-md)",
        }}
        aria-hidden="true"
      >
        <span
          className="tile"
          style={{
            width: "72%",
            height: "72%",
            backgroundColor: tone.solid,
            borderRadius: "50% 50% 50% 14%",
          }}
        >
          <Glifo color="#fff" strokeWidth={2.2} style={{ width: "60%", height: "60%" }} />
        </span>
      </span>
      <span style={{ fontSize: "var(--t-sm)", fontWeight: 800, lineHeight: 1.15 }}>
        {section.label}
      </span>
    </Link>
  );
}

/** Emergencia: botón compacto en coral arriba a la derecha, siempre a la vista. */
function EmergenciaBoton() {
  return (
    <Link
      href={EMERGENCIA.href}
      className="pressable flex items-center gap-2"
      style={{
        backgroundColor: "var(--red-solid)",
        borderRadius: "999px",
        padding: `${rem(8)} ${rem(14)}`,
        color: "#fff",
        textDecoration: "none",
        fontSize: "var(--t-sm)",
        fontWeight: 800,
      }}
      aria-label={`${EMERGENCIA.label}. ${EMERGENCIA.description}`}
    >
      <span
        aria-hidden="true"
        style={{ width: rem(10), height: rem(10), borderRadius: "999px", backgroundColor: "#fff" }}
      />
      {EMERGENCIA.label}
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
          {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
          <img src={ASISTENTE.imagen} alt="" style={{ height: rem(34), width: "auto" }} />
          <span style={{ fontSize: "var(--t-md)", fontWeight: 800, color: "var(--green-solid)" }}>
            Panela
          </span>
        </div>
        <EmergenciaBoton />
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
            top: "-2.2rem",
            right: "-1.6rem",
            width: rem(120),
            height: rem(120),
            borderRadius: "999px",
            backgroundColor: "rgba(255, 255, 255, 0.35)",
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
        {[...SECTIONS, RUTINA, COMUNIDAD].map((section, i) => (
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
