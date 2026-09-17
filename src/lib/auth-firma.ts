/**
 * Firma y verificación de la cookie de sesión, sin depender de Next.js ni
 * de node:crypto.
 *
 * Se usa Web Crypto (globalThis.crypto.subtle) a propósito: es lo único que
 * funciona igual en las rutas de la API (runtime de Node) y en el
 * middleware (runtime Edge, donde node:crypto no existe). timingSafeEqual
 * no hace falta reimplementarlo: crypto.subtle.verify ya compara la firma
 * en tiempo constante.
 */

export const NOMBRE_COOKIE_SESION = "misalud_sesion";

function requiereSecreto(): string {
  const valor = process.env.SESSION_SECRET;
  if (!valor) {
    throw new Error(
      "SESSION_SECRET no está configurado. Sin él, ninguna sesión de " +
        "paciente puede firmarse ni verificarse.",
    );
  }
  return valor;
}

function importarClave(secreto: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secreto),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function bufferAHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexABytes(hex: string): Uint8Array<ArrayBuffer> | null {
  if (hex.length % 2 !== 0 || !/^[0-9a-f]*$/i.test(hex)) return null;
  // El buffer se crea aparte y explícito (en vez de dejar que
  // `new Uint8Array(n)` lo infiera) porque TS últimamente tipa ese
  // constructor como Uint8Array<ArrayBufferLike>, que crypto.subtle.verify
  // no acepta (pide un ArrayBuffer concreto, no la unión con
  // SharedArrayBuffer).
  const buffer = new ArrayBuffer(hex.length / 2);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/** Valor a guardar en la cookie: "<id>.<firma>". */
export async function firmarPacienteId(patientId: number): Promise<string> {
  const payload = String(patientId);
  const clave = await importarClave(requiereSecreto());
  const firma = await crypto.subtle.sign("HMAC", clave, new TextEncoder().encode(payload));
  return `${payload}.${bufferAHex(firma)}`;
}

/** Verifica el valor de la cookie y devuelve el id, o null si falta o fue alterado. */
export async function verificarCookieSesion(
  valor: string | undefined | null,
): Promise<number | null> {
  if (!valor) return null;

  const punto = valor.indexOf(".");
  if (punto <= 0) return null;
  const payload = valor.slice(0, punto);
  const firmaBytes = hexABytes(valor.slice(punto + 1));
  if (!firmaBytes) return null;

  const clave = await importarClave(requiereSecreto());
  const valida = await crypto.subtle.verify(
    "HMAC",
    clave,
    firmaBytes,
    new TextEncoder().encode(payload),
  );
  if (!valida) return null;

  const id = Number(payload);
  return Number.isInteger(id) && id > 0 ? id : null;
}
