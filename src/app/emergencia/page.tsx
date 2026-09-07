import { HeartPulse, ListChecks, Phone, Siren, Stethoscope, UserRound, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import IconTile from "@/components/IconTile";
import type { AccentName } from "@/lib/theme";

const CONTACTS: {
  name: string;
  role: string;
  phone: string;
  icon: LucideIcon;
  accent: AccentName;
}[] = [
  { name: "Dr. García", role: "Médico de cabecera", phone: "555-0101", icon: Stethoscope, accent: "blue" },
  { name: "María (Hija)", role: "Familiar", phone: "555-0202", icon: UserRound, accent: "green" },
  { name: "Carlos (Hijo)", role: "Familiar", phone: "555-0303", icon: UserRound, accent: "purple" },
  { name: "Enfermera Sofía", role: "Cuidadora", phone: "555-0404", icon: HeartPulse, accent: "orange" },
];

const STEPS = [
  "Mantén la calma",
  "Llama al 911",
  "Avisa a un familiar",
  "No te muevas si sientes dolor",
];

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Emergencia"
        subtitle="Pide ayuda rápido"
        icon={Siren}
        accent="red"
        backHref="/"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4 flex flex-col gap-7" role="main">
        {/* Llamada al 911 */}
        <a
          href="tel:911"
          className="pressable flex flex-col items-center justify-center gap-2 p-6"
          style={{
            backgroundColor: "var(--red-ink)",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-lg)",
            textDecoration: "none",
            color: "#fff",
            minHeight: "8rem",
          }}
          aria-label="Llamar al número de emergencias 911"
        >
          <Phone size={34} strokeWidth={2} aria-hidden="true" />
          <span style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Llamar al 911
          </span>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, opacity: 0.85 }}>
            Emergencia médica
          </span>
        </a>

        {/* Qué hacer */}
        <section aria-label="Qué hacer en una emergencia">
          <SectionTitle icon={ListChecks} accent="amber">
            Qué hacer
          </SectionTitle>

          <ol className="card flex flex-col gap-3 mt-3 p-4 list-none m-0">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span
                  className="tile"
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "999px",
                    backgroundColor: "var(--amber-tint)",
                    borderColor: "var(--amber-line)",
                    color: "var(--amber-ink)",
                    fontSize: "0.8rem",
                    fontWeight: 800,
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "0.9rem", fontWeight: 600 }}>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Contactos */}
        <section aria-label="Contactos de emergencia">
          <SectionTitle icon={Phone} accent="red">
            Mis contactos
          </SectionTitle>

          <ul className="flex flex-col gap-3 mt-3 list-none p-0 m-0">
            {CONTACTS.map((contact) => (
              <li key={contact.phone}>
                <a
                  href={`tel:${contact.phone}`}
                  className="card pressable flex items-center gap-3.5 p-3.5"
                  style={{ textDecoration: "none", color: "inherit" }}
                  aria-label={`Llamar a ${contact.name}, ${contact.role}, teléfono ${contact.phone}`}
                >
                  <IconTile icon={contact.icon} accent={contact.accent} size={54} strokeWidth={1.8} />

                  <span className="flex-1 min-w-0">
                    <span className="block" style={{ fontSize: "1rem", fontWeight: 800 }}>
                      {contact.name}
                    </span>
                    <span
                      className="block mt-0.5"
                      style={{ fontSize: "0.74rem", fontWeight: 500, color: "var(--ink-mute)" }}
                    >
                      {contact.role}
                    </span>
                    <span
                      className="block mt-0.5"
                      style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--ink-soft)" }}
                    >
                      {contact.phone}
                    </span>
                  </span>

                  <span
                    className="tile"
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: "999px",
                      backgroundColor: "var(--green-ink)",
                      borderColor: "var(--green-ink)",
                      color: "#fff",
                    }}
                    aria-hidden="true"
                  >
                    <Phone size={20} strokeWidth={2.3} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
