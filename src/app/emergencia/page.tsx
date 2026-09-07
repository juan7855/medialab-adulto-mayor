import PageHeader from "@/components/PageHeader";
import Link from "next/link";

const CONTACTS = [
  { name: "Dr. García", role: "Médico de cabecera", phone: "555-0101", emoji: "👨‍⚕️", color: "#2563EB", bg: "#DBEAFE" },
  { name: "María (Hija)", role: "Familiar", phone: "555-0202", emoji: "👩", color: "#16A34A", bg: "#DCFCE7" },
  { name: "Carlos (Hijo)", role: "Familiar", phone: "555-0303", emoji: "👨", color: "#7C3AED", bg: "#EDE9FE" },
  { name: "Enfermera Sofía", role: "Cuidadora", phone: "555-0404", emoji: "👩‍⚕️", color: "#DC2626", bg: "#FEE2E2" },
];

export default function EmergenciaPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#FFF5F5" }}>
      <PageHeader
        title="Emergencia"
        emoji="🆘"
        color="#DC2626"
        backHref="/"
        backLabel="Inicio"
      />

      <main
        className="px-4 py-5 flex flex-col gap-5"
        style={{ maxWidth: "480px", margin: "0 auto" }}
        role="main"
      >
        {/* 911 big button */}
        <div
          className="rounded-3xl p-5 shadow-xl"
          style={{ backgroundColor: "#DC2626", border: "4px solid #991B1B" }}
          role="region"
          aria-label="Llamada de emergencia"
        >
          <h2
            className="font-extrabold text-white text-center mb-4"
            style={{ fontSize: "1.3rem" }}
          >
            🚨 Emergencia médica
          </h2>
          <a
            href="tel:911"
            role="button"
            aria-label="Llamar al número de emergencias 911"
            className="flex items-center justify-center gap-3 w-full rounded-3xl font-extrabold text-red-700 bg-white hover:bg-red-50 active:scale-95 transition-all shadow-lg"
            style={{ minHeight: "96px", fontSize: "2rem", textDecoration: "none" }}
          >
            <span aria-hidden="true">📞</span>
            <span>LLAMAR AL 911</span>
          </a>
        </div>

        {/* Instruction card */}
        <div
          className="rounded-3xl p-5 shadow flex items-start gap-3"
          style={{ backgroundColor: "#FEF9C3", border: "2px solid #FCD34D" }}
          role="note"
          aria-label="Qué hacer en una emergencia"
        >
          <span style={{ fontSize: "1.5rem" }} aria-hidden="true">📋</span>
          <div>
            <p className="font-extrabold text-yellow-900 mb-2" style={{ fontSize: "1.05rem" }}>
              En caso de emergencia:
            </p>
            <ol className="list-decimal list-inside flex flex-col gap-1">
              {[
                "Mantén la calma",
                "Llama al 911",
                "Avisa a un familiar",
                "No te muevas si sientes dolor",
              ].map((step, i) => (
                <li key={i} className="font-semibold text-yellow-800" style={{ fontSize: "1rem" }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Contacts */}
        <section aria-label="Contactos de emergencia">
          <h2
            className="font-extrabold text-gray-800 mb-3 px-1"
            style={{ fontSize: "1.25rem" }}
          >
            📞 Mis contactos
          </h2>
          <div className="flex flex-col gap-4">
            {CONTACTS.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:${contact.phone}`}
                aria-label={`Llamar a ${contact.name}, ${contact.role}, teléfono ${contact.phone}`}
                className="flex items-center gap-4 rounded-3xl p-4 shadow-md active:scale-95 transition-transform"
                style={{
                  backgroundColor: contact.bg,
                  border: `2px solid ${contact.color}40`,
                  textDecoration: "none",
                  minHeight: "96px",
                }}
              >
                {/* Avatar */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-2xl"
                  style={{ width: 72, height: 72, fontSize: "2.5rem", backgroundColor: "white" }}
                  aria-hidden="true"
                >
                  {contact.emoji}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-extrabold text-gray-900" style={{ fontSize: "1.15rem" }}>
                    {contact.name}
                  </div>
                  <div className="text-gray-600 font-medium" style={{ fontSize: "0.95rem" }}>
                    {contact.role}
                  </div>
                  <div
                    className="font-bold mt-1"
                    style={{ fontSize: "1rem", color: contact.color }}
                  >
                    📞 {contact.phone}
                  </div>
                </div>
                {/* Call icon */}
                <div
                  className="flex-shrink-0 flex items-center justify-center rounded-2xl text-white font-bold"
                  style={{ width: 56, height: 56, backgroundColor: contact.color, fontSize: "1.5rem" }}
                  aria-hidden="true"
                >
                  📞
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Back */}
        <Link
          href="/"
          role="button"
          aria-label="Volver al inicio"
          className="flex items-center justify-center gap-2 w-full rounded-3xl font-bold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 active:scale-95 transition-all shadow"
          style={{ minHeight: "72px", fontSize: "1.15rem", textDecoration: "none" }}
        >
          ◀ Volver al Inicio
        </Link>
      </main>
    </div>
  );
}
