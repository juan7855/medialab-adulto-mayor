import { rem } from "@/lib/scale";
import { ASISTENTE as asistente } from "@/lib/asistentes";

interface Props {
  /** Alto de la ilustración, en px sobre la base de 22. */
  size?: number;
}

/** La ilustración de Panela. */
export default function AsistenteActivo({ size = 150 }: Props) {
  return (
    <span
      className="flex items-end justify-center"
      style={{
        backgroundColor: asistente.tinte,
        border: `1px solid ${asistente.borde}`,
        borderRadius: "var(--r-lg)",
        overflow: "hidden",
        height: rem(size + 10),
        width: rem(size),
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- ilustración local */}
      <img
        src={asistente.imagen}
        alt=""
        style={{ height: rem(size), width: "auto", display: "block" }}
      />
    </span>
  );
}
