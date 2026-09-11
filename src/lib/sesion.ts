"use client";

/**
 * Clave de acceso de la maqueta.
 *
 * Está escrita aquí a propósito, en el código que se envía al navegador:
 * NO es seguridad, es un cerrojo de demostración. Cuando haya usuarios de
 * verdad, la comprobación tiene que pasar al servidor contra una clave
 * guardada con hash, y esta constante desaparece.
 */
export const CLAVE_DEMO = "1234";

const CLAVE_SESION = "misalud.sesion";
const CLAVE_ASISTENTE = "misalud.asistente";

function leer(clave: string): string | null {
  try {
    return window.localStorage.getItem(clave);
  } catch {
    return null;
  }
}

function guardar(clave: string, valor: string): void {
  try {
    window.localStorage.setItem(clave, valor);
  } catch {
    // Modo privado o almacenamiento bloqueado: se sigue igual, sin recordar.
  }
}

export function abrirSesion(): void {
  guardar(CLAVE_SESION, "ok");
}

export function haySesion(): boolean {
  return leer(CLAVE_SESION) === "ok";
}

export function guardarAsistente(id: string): void {
  guardar(CLAVE_ASISTENTE, id);
}

export function leerAsistente(): string | null {
  return leer(CLAVE_ASISTENTE);
}

export function cerrarSesion(): void {
  try {
    window.localStorage.removeItem(CLAVE_SESION);
  } catch {
    // nada que hacer
  }
}
