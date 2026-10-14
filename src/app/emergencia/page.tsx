import { HeartPulse, ListChecks, Phone, Stethoscope, UserRound, type LucideIcon } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import SectionTitle from "@/components/SectionTitle";
import IconTile from "@/components/IconTile";
import { EMERGENCIA, type AccentName } from "@/lib/theme";

const CONTACTS: {
  name: string;
  role: string;
  phone: string;
  icon: LucideIcon;
  accent: AccentName;
}[] = [
  { name: "Dr. García", role: "Médico de cabecera", phone: "555-0101", icon: Stethoscope, accent: "cyan" },
  { name: "María (Hija)", role: "Familiar", phone: "555-0202", icon: UserRound, accent: "green" },
  { name: "Carlos (Hijo)", role: "Familiar", phone: "555-0303", icon: UserRound, accent: "purple" },
  { name: "Enfermera Sofía", role: "Cuidadora", phone: "555-0404", icon: HeartPulse, accent: "orange" },
];

const STEPS = [
  "Mantenga la calma",
  "Llame al 123",
  "Avise a un familiar",
  "No se mueva si siente dolor",
];

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen pb-10">
      <PageHeader
        title="Emergencia"
        subtitle="Pida ayuda rápido"
        iconSrc={EMERGENCIA.icon}
        accent={EMERGENCIA.accent}
        backHref="/inicio"
        backLabel="Inicio"
      />

      <main className="px-4 pt-4 flex flex-col gap-7" role="main">
        {/* Llamada al 123, la línea única de emergencias en Colombia */}
        <a
          href="tel:123"
          className="pressable flex flex-col items-center justify-center gap-2 p-6"
          style={{
            backgroundColor: "var(--red-solid)",
            borderRadius: "var(--r-xl)",
            boxShadow: "var(--shadow-lg)",
            textDecoration: "none",
            color: "#fff",
            minHeight: "9rem",
          }}
          aria-label="Llamar al número de emergencias 123"
        >
          <Phone size={38} strokeWidth={2.1} aria-hidden="true" />
          <span style={{ fontSize: "var(--t-xl)", fontWeight: 800, letterSpacing: "-0.02em" }}>
            Llamar al 123
          </span>
          <span style={{ fontSize: "var(--t-xs)", fontWeight: 600, opacity: 0.9 }}>
            Emergencia médica
          </span>
        </a>

        {/* Qué hacer */}
        <section aria-label="Qué hacer en una emergencia">
          <SectionTitle icon={ListChecks} accent="yellow">
            Qué hacer
          </SectionTitle>

          <ol className="card flex flex-col gap-3.5 mt-3 p-4 list-none m-0">
            {STEPS.map((step, i) => (
              <li key={step} className="flex items-center gap-3">
                <span
                  style={{
                    width: 34,
                    height: 34,
                    flexShrink: 0,
                    borderRadius: "999px",
                    backgroundColor: "var(--yellow-solid)",
                    color: "var(--ink)",
                    fontSize: "var(--t-xs)",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <span style={{ fontSize: "var(--t-sm)", fontWeight: 600 }}>{step}</span>
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
                  <IconTile icon={contact.icon} accent={contact.accent} size={50} strokeWidth={2} />

                  <span className="flex-1 min-w-0">
                    <span className="block" style={{ fontSize: "var(--t-md)", fontWeight: 800 }}>
                      {contact.name}
                    </span>
                    <span
                      className="block mt-0.5"
                      style={{ fontSize: "var(--t-xs)", fontWeight: 500, color: "var(--ink-mute)" }}
                    >
                      {contact.role}
                    </span>
                    <span
                      className="block mt-0.5"
                      style={{ fontSize: "var(--t-sm)", fontWeight: 700, color: "var(--ink-soft)" }}
                    >
                      {contact.phone}
                    </span>
                  </span>

                  <span
                    style={{
                      width: 44,
                      height: 44,
                      flexShrink: 0,
                      borderRadius: "999px",
                      backgroundColor: "var(--cta)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    aria-hidden="true"
                  >
                    <Phone size={22} strokeWidth={2.3} />
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
