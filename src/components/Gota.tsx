import { rem } from "@/lib/scale";
import { ACCENTS, type AccentName } from "@/lib/theme";

export type Esquina = "arriba-izq" | "arriba-der" | "abajo-izq" | "abajo-der";

const RADIOS: Record<Esquina, string> = {
  "arriba-izq": "0 50% 50% 50%",
  "arriba-der": "50% 0 50% 50%",
  "abajo-der": "50% 50% 0 50%",
  "abajo-izq": "50% 50% 50% 0",
};

interface GotaProps {
  accent: AccentName;
  /** Lado, en px sobre la base de 22. Se pinta en rem. */
  size?: number;
  /** La esquina recta de la gota. En el Figma cada sección la gira distinto. */
  esquina?: Esquina;
  /** Pinta la gota dentro de un cuadro claro de su mismo color (fichas del inicio). */
  enCuadro?: boolean;
}

/**
 * La gota: círculo con una esquina recta, la forma de la mascota. Es el
 * icono de la app en el Figma: sin dibujo adentro, sólo color.
 */
export default function Gota({ accent, size = 44, esquina = "abajo-der", enCuadro = false }: GotaProps) {
  const tone = ACCENTS[accent];
  const gota = (
    <span
      aria-hidden="true"
      style={{
        display: "block",
        flexShrink: 0,
        width: enCuadro ? "60%" : rem(size),
        height: enCuadro ? "60%" : rem(size),
        backgroundColor: tone.solid,
        borderRadius: RADIOS[esquina],
      }}
    />
  );

  if (!enCuadro) return gota;

  return (
    <span
      aria-hidden="true"
      className="tile"
      style={{
        width: rem(size),
        height: rem(size),
        backgroundColor: tone.tint,
        borderRadius: rem(Math.round(size * 0.3)),
      }}
    >
      {gota}
    </span>
  );
}
