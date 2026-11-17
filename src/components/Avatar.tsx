/**
 * Paleta propia para avatares de la comunidad — no reutiliza ACCENTS porque
 * ahí "purple" es gris y "yellow"/"blue" repiten el mismo color que
 * "orange"/"cyan" (ver globals.css); con eso, varias personas terminaban
 * viéndose del mismo color o de gris, justo lo que esto debía evitar.
 * Colores aparte, bien separados entre sí y lejos del rojo de Emergencia.
 */
const PALETA_AVATAR = [
  "#2F80ED", // azul
  "#9B51E0", // morado
  "#219653", // verde
  "#D9822B", // naranja
  "#0F9B8E", // verde azulado
  "#D6467B", // rosado
  "#6D5BD0", // índigo
];

/** Color fijo y distinto por persona: el mismo paciente siempre sale del
 *  mismo color, para que en la comunidad no se confundan unos autores con
 *  otros (varias personas mayores publicando o comentando a la vez). */
export function colorDePaciente(patientId: number): string {
  return PALETA_AVATAR[Math.abs(patientId) % PALETA_AVATAR.length];
}

interface AvatarProps {
  patientId: number;
  name: string;
  size?: number;
}

/** Círculo con la inicial del nombre, en el color fijo de esa persona. */
export default function Avatar({ patientId, name, size = 38 }: AvatarProps) {
  const color = colorDePaciente(patientId);
  const inicial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: "999px",
        backgroundColor: color,
        color: "#FFFFFF",
        fontWeight: 800,
        fontSize: size * 0.42,
        flexShrink: 0,
      }}
    >
      {inicial}
    </span>
  );
}
