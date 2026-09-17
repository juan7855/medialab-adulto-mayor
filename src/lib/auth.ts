import { cookies } from "next/headers";
import { NOMBRE_COOKIE_SESION, firmarPacienteId, verificarCookieSesion } from "./auth-firma";

/**
 * Sesión del paciente, verificada en el servidor. Para usar dentro de Route
 * Handlers y Server Components (usan next/headers, que no existe en el
 * middleware — por eso la firma/verificación vive aparte, en auth-firma.ts).
 *
 * Antes había sólo una bandera en localStorage ("misalud.sesion" = "ok"):
 * el navegador decidía si había sesión, así que cualquiera podía escribirla
 * a mano en la consola y entrar. Esto usa una cookie httpOnly (invisible
 * para JavaScript del navegador) que lleva el id del paciente firmado con
 * HMAC, así el servidor confía en ella sin volver a preguntar a la base de
 * datos en cada request sólo para saber "quién es".
 *
 * No es una sesión de nivel bancario (no expira sola, no se puede revocar
 * una sesión suelta sin rotar el secreto de todas), pero es honesta: lo que
 * dice llevar es lo que lleva, y no se puede falsificar sin conocer
 * SESSION_SECRET. Para una app familiar, con pocos pacientes y sesiones que
 * viven meses en el mismo teléfono, es proporcional.
 */

/** Abre sesión para este paciente: pone la cookie firmada. */
export async function crearSesion(patientId: number): Promise<void> {
  const almacen = await cookies();
  almacen.set(NOMBRE_COOKIE_SESION, await firmarPacienteId(patientId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Un año: el mismo teléfono de la misma persona, no una sesión web
    // corta. Cerrar sesión (borrarSesion) es explícito, no por expiración.
    maxAge: 60 * 60 * 24 * 365,
  });
}

/** El id del paciente de la cookie actual, o null si no hay sesión válida. */
export async function obtenerPacienteId(): Promise<number | null> {
  const almacen = await cookies();
  return verificarCookieSesion(almacen.get(NOMBRE_COOKIE_SESION)?.value);
}

/** Cierra la sesión: borra la cookie. */
export async function borrarSesion(): Promise<void> {
  const almacen = await cookies();
  almacen.delete(NOMBRE_COOKIE_SESION);
}
