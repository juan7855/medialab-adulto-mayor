/**
 * Reducir una foto en el navegador, antes de subirla.
 *
 * La foto de un teléfono moderno pesa 3–8 MB y mide 4000 px de lado: subirla
 * tal cual sería lento con datos móviles (y el cuerpo de una petición en
 * Vercel no pasa de 4.5 MB). Reducirla acá, en el teléfono de quien publica,
 * convierte eso en 150–400 KB sin que la foto se vea peor en una pantalla de
 * móvil. El servidor vuelve a validar el resultado: esto es comodidad, no
 * seguridad.
 */

import {
  CALIDAD_FOTO,
  LADO_MAXIMO_FOTO,
  PESO_MAXIMO_FOTO,
  type FotoSubida,
} from "./imagenes";

export interface FotoElegida {
  /** `data:image/jpeg;base64,...`, lista para enviar y para previsualizar. */
  dataUrl: string;
  width: number;
  height: number;
}

/** Lo que se manda en el cuerpo de la petición. */
export function cuerpoDeFoto(foto: FotoElegida): Pick<FotoSubida, "width" | "height"> & {
  dataUrl: string;
} {
  return { dataUrl: foto.dataUrl, width: foto.width, height: foto.height };
}

/** Pinta el archivo en un canvas ya reducido, respetando la orientación EXIF
 *  (si no, las fotos verticales de iPhone salen tumbadas). */
async function dibujarReducida(archivo: File): Promise<HTMLCanvasElement> {
  let ancho: number;
  let alto: number;
  let fuente: ImageBitmap | HTMLImageElement;

  if (typeof createImageBitmap === "function") {
    fuente = await createImageBitmap(archivo, { imageOrientation: "from-image" });
    ancho = fuente.width;
    alto = fuente.height;
  } else {
    const url = URL.createObjectURL(archivo);
    try {
      fuente = await new Promise<HTMLImageElement>((listo, falla) => {
        const img = new Image();
        img.onload = () => listo(img);
        img.onerror = () => falla(new Error("no se pudo leer la imagen"));
        img.src = url;
      });
      ancho = fuente.naturalWidth;
      alto = fuente.naturalHeight;
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  const escala = Math.min(1, LADO_MAXIMO_FOTO / Math.max(ancho, alto));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(ancho * escala));
  canvas.height = Math.max(1, Math.round(alto * escala));

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("sin canvas 2d");

  // El resultado es JPEG, que no tiene transparencia: sin este relleno, las
  // zonas transparentes de un PNG saldrían negras.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(fuente, 0, 0, canvas.width, canvas.height);

  if ("close" in fuente) fuente.close();

  return canvas;
}

function pesoDeDataUrl(dataUrl: string): number {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const relleno = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  return (base64.length / 4) * 3 - relleno;
}

/**
 * Convierte el archivo que eligió la persona en una foto lista para subir.
 * Lanza si el archivo no es una imagen que el navegador sepa abrir (pasa con
 * algún HEIC viejo en Android).
 */
export async function prepararFoto(archivo: File): Promise<FotoElegida> {
  const canvas = await dibujarReducida(archivo);

  let calidad = CALIDAD_FOTO;
  let dataUrl = canvas.toDataURL("image/jpeg", calidad);

  // Una foto muy detallada (mucho texto, mucho follaje) todavía puede pasarse
  // del tope a calidad normal; se baja un par de pasos antes de rendirse.
  while (pesoDeDataUrl(dataUrl) > PESO_MAXIMO_FOTO && calidad > 0.4) {
    calidad -= 0.15;
    dataUrl = canvas.toDataURL("image/jpeg", calidad);
  }

  if (pesoDeDataUrl(dataUrl) > PESO_MAXIMO_FOTO) {
    throw new Error("la foto sigue pesando demasiado");
  }

  return { dataUrl, width: canvas.width, height: canvas.height };
}
