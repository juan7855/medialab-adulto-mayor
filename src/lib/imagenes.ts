/**
 * Reglas de las fotos de la comunidad, compartidas por el navegador (que las
 * reduce antes de subirlas) y el servidor (que vuelve a comprobarlo todo,
 * porque el cliente puede mentir).
 */

/** Lado mayor al que se reduce la foto antes de subirla, en px. */
export const LADO_MAXIMO_FOTO = 1400;

/** Calidad del JPEG al recomprimir en el navegador. */
export const CALIDAD_FOTO = 0.75;

/**
 * Tope de peso ya decodificado. Con 1400 px de lado y calidad 0.75 una foto
 * normal pesa 150–400 KB, así que 2 MB deja aire de sobra para fotos muy
 * detalladas sin abrir la puerta a subir un archivo enorme. Importa también
 * porque el cuerpo de una petición en Vercel no puede pasar de 4.5 MB y
 * base64 infla un tercio.
 */
export const PESO_MAXIMO_FOTO = 2 * 1024 * 1024;

export const TIPOS_FOTO_PERMITIDOS = ["image/jpeg", "image/png", "image/webp"] as const;

export type TipoFoto = (typeof TIPOS_FOTO_PERMITIDOS)[number];

export interface FotoSubida {
  mime: TipoFoto;
  /** base64 sin el prefijo `data:...;base64,`. */
  data: string;
  width: number;
  height: number;
}

/**
 * Lee lo que llegó en el cuerpo de la petición como una foto válida, o
 * devuelve un motivo en palabras para responder 400. Nunca lanza.
 */
export function leerFotoDelCuerpo(valor: unknown): { foto: FotoSubida } | { error: string } {
  if (valor === undefined || valor === null) return { error: "Sin foto" };
  if (typeof valor !== "object") return { error: "Foto inválida" };

  const { dataUrl, width, height } = valor as {
    dataUrl?: unknown;
    width?: unknown;
    height?: unknown;
  };

  if (typeof dataUrl !== "string") return { error: "Foto inválida" };

  const coincidencia = /^data:([a-z/+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
  if (!coincidencia) return { error: "Foto inválida" };

  const [, mime, base64] = coincidencia;
  if (!(TIPOS_FOTO_PERMITIDOS as readonly string[]).includes(mime)) {
    return { error: "Ese tipo de imagen no se puede publicar" };
  }

  // 4 caracteres de base64 son 3 bytes: así se mide el peso real sin
  // decodificar el texto entero sólo para descartarlo.
  const relleno = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const bytes = (base64.length / 4) * 3 - relleno;
  if (bytes > PESO_MAXIMO_FOTO) return { error: "La foto es demasiado pesada" };

  const w = Math.round(Number(width));
  const h = Math.round(Number(height));
  if (!Number.isFinite(w) || !Number.isFinite(h) || w < 1 || h < 1 || w > 10000 || h > 10000) {
    return { error: "Foto inválida" };
  }

  return { foto: { mime: mime as TipoFoto, data: base64, width: w, height: h } };
}
