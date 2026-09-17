"use client";

/**
 * Preferencia del asistente elegido, guardada en el navegador.
 *
 * Esto NO es la sesión de acceso — esa vive en el servidor, como cookie
 * firmada (ver src/lib/auth.ts) y se comprueba en src/middleware.ts. Esto es
 * sólo "qué personaje mostrar", que no necesita servidor porque no protege
 * nada: si alguien lo borra o lo cambia a mano, en el peor caso ve al otro
 * asistente hasta que vuelva a elegir.
 */

const CLAVE_ASISTENTE = "misalud.asistente";

export function guardarAsistente(id: string): void {
  try {
    window.localStorage.setItem(CLAVE_ASISTENTE, id);
  } catch {
    // Modo privado o almacenamiento bloqueado: se sigue igual, sin recordar.
  }
}

export function leerAsistente(): string | null {
  try {
    return window.localStorage.getItem(CLAVE_ASISTENTE);
  } catch {
    return null;
  }
}
