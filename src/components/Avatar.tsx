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

/**
 * Iniciales del nombre y el apellido ("Ana Torres" -> "AT"), no solo la
 * primera letra: con un solo nombre, en esta comunidad tres de cuatro
 * personas empiezan por A (Ademar, Álvaro, Ana) y se veían igual aunque el
 * color ya las distinguía. Con nombre y apellido vuelve a ser inconfundible.
 * Si el nombre trae una sola palabra, se deja solo esa inicial (no se
 * repite la misma letra dos veces).
 */
function inicialesDe(name: string): string {
  const palabras = name.trim().split(/\s+/).filter(Boolean);
  if (palabras.length === 0) return "?";
  const primera = palabras[0].charAt(0).toUpperCase();
  if (palabras.length === 1) return primera;
  const ultima = palabras[palabras.length - 1].charAt(0).toUpperCase();
  return `${primera}${ultima}`;
}

interface AvatarProps {
  patientId: number;
  name: string;
  size?: number;
}

/** Círculo con las iniciales del nombre, en el color fijo de esa persona. */
export default function Avatar({ patientId, name, size = 38 }: AvatarProps) {
  const color = colorDePaciente(patientId);
  const iniciales = inicialesDe(name);

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
        fontSize: size * (iniciales.length > 1 ? 0.34 : 0.42),
        letterSpacing: iniciales.length > 1 ? "-0.03em" : undefined,
        flexShrink: 0,
      }}
    >
      {iniciales}
    </span>
  );
}
